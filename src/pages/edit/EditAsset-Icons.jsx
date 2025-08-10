import React from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import Icon from '../../components/icon/icon';
import SkeletonMUP from '../../components/skeleton/skeleton';
import { useAlert } from '../../hooks/alertContext';
import { useDropzone } from 'react-dropzone';
import ImageMUP from '../../components/image/image';
import { MEDIA_DELETE, MEDIA_POST, PREVIEWS_GET } from '../../hooks/useFetch';
import EditAssetDetailsIcons from './EditAsset-DetailsIcons';
import EditAssetDeleteIcon from './EditAsset-DeleteIcon';

const EditAssetIcons = ({
  asset,
  loading,
  taxonomy,
  formData,
  setFormData,
}) => {
  const token = window.localStorage.getItem('token');
  const { mode } = useColorScheme();
  const showAlert = useAlert();
  const [icons, setIcons] = React.useState([]);
  const [filesIcons, setFilesIcons] = React.useState([]);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(2);
  const [uploadQueue, setUploadQueue] = React.useState([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [contrast, setContrast] = React.useState(false);
  const [iconSelected, setIconSelected] = React.useState(0);
  const [idIconDelete, setIdIconDelete] = React.useState(0);
  const [iconData, setIconData] = React.useState(null);

  // Efeito para processar a fila de upload
  React.useEffect(() => {
    const processUploadQueue = async () => {
      if (uploadQueue.length > 0 && !isUploading) {
        setIsUploading(true);
        const { id: uploadId, file } = uploadQueue[0];

        try {
          const uploadFormData = new FormData();
          uploadFormData.append('preview[]', file);

          const currentCategory = formData.categoryIcon?.slug;
          const currentStyle = formData.styleIcon?.slug;

          if (!currentCategory) {
            throw new Error('Categoria não selecionada');
          }

          if (!currentStyle) {
            throw new Error('Estilo não selecionado');
          }

          uploadFormData.append('icon_category[]', currentCategory);
          uploadFormData.append('icon_style[]', currentStyle);
          uploadFormData.append('post_id', asset.id);

          const { url, options } = MEDIA_POST(token);
          options.body = uploadFormData;

          const response = await fetch(url, options);
          const json = await response.json();

          if (json.success) {
            setIcons((prev) => [
              {
                ...json.data[0],
                uploadId,
              },
              ...prev,
            ]);

            setUploadProgress((prev) => ({
              ...prev,
              [uploadId]: 'completed',
            }));
          } else {
            throw new Error(json.message || 'Erro no upload');
          }
        } catch (error) {
          console.error('Upload error:', error);
          setUploadProgress((prev) => ({
            ...prev,
            [uploadId]: 'failed', // Corrigido aqui
          }));
          showAlert(`Falha no upload: ${error.message}`, 'error');
        } finally {
          setUploadQueue((prev) => prev.slice(1));
          setIsUploading(false);
        }
      }
    };

    processUploadQueue();
  }, [uploadQueue, isUploading]);

  // Atualização no onDrop do dropzone
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/webp': ['.webp'],
      'image/png': ['.png'],
      'image/jpg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 100,
    maxSize: 1000000,
    onDrop: (acceptedFiles) => {
      // Verificação mais robusta
      if (!formData.categoryIcon || !formData.styleIcon) {
        showAlert(
          'Selecione uma Categoria e um Estilo válidos antes de enviar os ícones',
          'error',
        );
        return;
      }

      // Verifique se os slugs existem
      if (!formData.categoryIcon.slug || !formData.styleIcon.slug) {
        showAlert(
          'Categoria ou Estilo inválidos. Selecione novamente.',
          'error',
        );
        return;
      }

      const newUploads = acceptedFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}`,
        file,
        status: 'queued',
      }));

      setFilesIcons((prev) => [
        ...prev,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            isSvg: file.type === 'image/svg+xml',
            uploadId: `${file.name}-${file.lastModified}-${Date.now()}`,
          }),
        ),
      ]);

      setUploadQueue((prev) => [...prev, ...newUploads]);
      setUploadProgress((prev) => ({
        ...prev,
        ...newUploads.reduce((acc, item) => {
          acc[item.id] = 'queued';
          return acc;
        }, {}),
      }));
    },
    onDropRejected: () => {
      showAlert(
        'Arquivo inválido. Tamanho máximo: 1MB. Tipos permitidos: SVG, WEBP, PNG ou JPG.',
        'error',
      );
    },
  });

  // Componente de status do upload
  const UploadStatusIndicator = ({ fileId }) => {
    const status = uploadProgress[fileId];

    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          left: 4,
          right: 4,
          height: 4,
          bgcolor: 'grey.200',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width:
              status === 'completed'
                ? '100%'
                : status === 'failed'
                ? '100%'
                : '30%',
            height: '100%',
            bgcolor:
              status === 'completed'
                ? 'success.main'
                : status === 'failed'
                ? 'error.main'
                : 'primary.main',
            transition: 'width 0.3s ease',
            animation: status === 'queued' ? '$pulse 1.5s infinite' : 'none',
          }}
        />
      </Box>
    );
  };

  // Carrega os ícones existentes
  const ensurePositiveNumber = (value, fallback = 1) => {
    const num = Number(value);
    return Number.isInteger(num) && num > 0 ? num : fallback;
  };

  // Efeito para debounce da pesquisa
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 1 segundo de delay após parar de digitar

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Efeito que dispara a pesquisa quando o termo debounced muda
  React.useEffect(() => {
    if (debouncedSearchTerm !== '' || icons.length > 0) {
      loadIcons(1, true); // Recarrega da página 1 quando o termo debounced muda
    }
  }, [debouncedSearchTerm]);

  const loadIcons = React.useCallback(
    async (pageToLoad = 1, shouldReset = false) => {
      try {
        const pageNumber = ensurePositiveNumber(pageToLoad);
        setIsLoadingMore(true);
        setIsSearching(true);

        const { url, options } = PREVIEWS_GET(token);
        let apiUrl = `${url}/${asset.id}?page=${pageNumber}&orderby=modified&order=DESC`;

        // Agora usa debouncedSearchTerm em vez de searchTerm
        if (debouncedSearchTerm) {
          apiUrl += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
        }

        const response = await fetch(apiUrl, options);
        const json = await response.json();

        if (!json.success)
          throw new Error(json.message || 'Failed to load icons');

        const newIcons = json.data.previews || [];

        setIcons((prev) => (shouldReset ? newIcons : [...prev, ...newIcons]));
        setHasMore(
          json.data.pagination.current_page < json.data.pagination.total_pages,
        );

        setCurrentPage((prev) => (shouldReset ? 2 : prev + 1));
      } catch (error) {
        console.error('Error loading icons:', error);
        showAlert(error.message || 'Erro ao carregar ícones', 'error');
      } finally {
        setIsLoadingMore(false);
        setIsSearching(false);
      }
    },
    [asset.id, debouncedSearchTerm], // Agora depende de debouncedSearchTerm
  );

  React.useEffect(() => {
    if (asset?.id) {
      // Usa um debounce para evitar muitas requisições enquanto digita
      const handler = setTimeout(() => {
        loadIcons(1, true); // Recarrega da página 1 quando o termo muda
      }, 500); // 500ms de delay

      return () => clearTimeout(handler);
    }
  }, [searchTerm, asset?.id, loadIcons]);

  // Carregamento inicial
  React.useEffect(() => {
    if (asset?.id) {
      loadIcons(1, true); // Força reset começando da página 1
    }
  }, [asset?.id]);

  // Função para carregar mais itens
  const loadMoreIcons = React.useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadIcons(currentPage); // Usa currentPage atual sem reset
    }
  }, [isLoadingMore, hasMore, currentPage, loadIcons]);

  // Carrega os ícones iniciais
  React.useEffect(() => {
    if (asset?.id) {
      loadIcons(true);
    }
  }, [asset?.id, loadIcons]);

  // Limpa as URLs de preview quando o componente desmonta
  React.useEffect(() => {
    return () => {
      filesIcons.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [filesIcons]);

  // Manipuladores de mudança de categoria e estilo
  const handleCategoryIconChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      categoryIcon: newValue
        ? {
            term_id: newValue.slug,
            name: newValue.name,
            slug: newValue.slug,
          }
        : null,
    }));
  };

  const handleStyleIconChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      styleIcon: newValue
        ? {
            term_id: newValue.slug,
            name: newValue.name,
            slug: newValue.slug,
          }
        : null,
    }));
  };

  // Remove um novo ícone que ainda não foi enviado
  const handleRemoveNewIcon = (uploadId) => {
    // Remove da lista de arquivos
    setFilesIcons((prev) => prev.filter((file) => file.uploadId !== uploadId));

    // Remove da fila de upload se ainda estiver lá
    setUploadQueue((prev) => prev.filter((item) => item.id !== uploadId));

    // Remove do progresso
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[uploadId];
      return newProgress;
    });
  };

  // Função para tentar novamente o upload
  const retryUpload = (uploadId) => {
    const fileData = filesIcons.find((f) => f.uploadId === uploadId);
    if (fileData) {
      setUploadQueue((prev) => [
        {
          id: uploadId, // Mantém o mesmo ID
          file: fileData,
          status: 'queued',
        },
        ...prev,
      ]);
      setUploadProgress((prev) => ({
        ...prev,
        [uploadId]: 'queued',
      }));
    }
  };

  // Componente de lista de ícones
  const IconsList = () => (
    <Box>
      {/* Grid de ícones */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
        className="list-icon"
      >
        {/* Ícones existentes */}
        {icons.map((icon) => (
          <Box
            key={`${icon.id}-${Date.now()}`}
            className={`list-icon-item${
              iconSelected > 0 && iconSelected === icon.id ? ' selected' : ''
            }`}
            position="relative"
            onClick={() => setIconSelected(icon.id) + setIconData(icon)}
          >
            {icon?.url ? (
              <ImageMUP
                src={icon.url}
                width={80}
                height={80}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                className="icon"
              />
            ) : (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'var(--mui-palette-background-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon="broken_image" size={24} />
              </Box>
            )}
            <Tooltip title="Excluir" arrow>
              <Button
                variant="contained"
                onClick={() => setIdIconDelete(icon.id)}
                size="small"
                color="error"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  minWidth: 'auto',
                  p: 0.5,
                }}
              >
                <Icon icon="close" size={16} />
              </Button>
            </Tooltip>
            <Typography variant="caption" component="span">
              {icon.title}
            </Typography>
          </Box>
        ))}

        {/* Novos ícones sendo enviados */}
        {filesIcons.map((file) => {
          const uploadId = file.uploadId;
          const status = uploadProgress[uploadId];

          return (
            <Box key={`upload-${uploadId}`} position="relative">
              {file.preview ? (
                file.isSvg ? (
                  <Box
                    component="img"
                    src={file.preview}
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                    onError={() =>
                      setFilesIcons((prev) =>
                        prev.filter((f) => f.uploadId !== uploadId),
                      )
                    }
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      bgcolor: mode === 'dark' ? 'grey.800' : 'grey.100',
                      opacity: status === 'completed' ? 1 : 0.7,
                    }}
                    alt="Pré-visualização do ícone"
                  />
                ) : (
                  <ImageMUP
                    src={file.preview}
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                    onError={() =>
                      setFilesIcons((prev) =>
                        prev.filter((f) => f.uploadId !== uploadId),
                      )
                    }
                    width={80}
                    height={80}
                    sx={{ opacity: status === 'completed' ? 1 : 0.7 }}
                    alt="Pré-visualização do ícone"
                  />
                )
              ) : (
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}

              <UploadStatusIndicator fileId={uploadId} />
              {status === 'failed' && (
                <Tooltip
                  title="Falha no upload - Clique para tentar novamente"
                  arrow
                >
                  <Button
                    variant="contained"
                    onClick={() => retryUpload(uploadId)}
                    size="small"
                    color="warning"
                    sx={{
                      position: 'absolute',
                      top: 30,
                      right: 4,
                      minWidth: 'auto',
                      p: 0.5,
                    }}
                  >
                    <Icon icon="refresh" size={16} />
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="Remover" arrow>
                <Button
                  variant="contained"
                  onClick={() => handleRemoveNewIcon(uploadId)}
                  size="small"
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    minWidth: 'auto',
                    p: 0.5,
                  }}
                >
                  <Icon icon="close" size={16} />
                </Button>
              </Tooltip>
              <Typography variant="caption" component="span">
                {file.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {hasMore && (
        <Box display="flex" justifyContent="center" sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={loadMoreIcons}
            disabled={isLoadingMore}
            startIcon={
              isLoadingMore ? (
                <CircularProgress size={16} />
              ) : (
                <Icon icon="expand_more" size={16} />
              )
            }
            sx={{
              minWidth: 200,
              py: 1.5,
            }}
          >
            {isLoadingMore ? 'Carregando...' : 'Carregar Mais Ícones'}
          </Button>
        </Box>
      )}

      {/* Mensagem de fim */}
      {!hasMore && icons.length > 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          sx={{ py: 2 }}
        >
          Todos os ícones foram carregados
        </Typography>
      )}

      {/* Mensagem quando não há ícones */}
      {!hasMore && icons.length === 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          sx={{ py: 2 }}
        >
          Nenhum ícone encontrado
        </Typography>
      )}
    </Box>
  );

  if (loading) {
    return (
      <fieldset
        className="edit-contentEdit anima-fade-bottom"
        style={{ marginTop: '20px' }}
      >
        <legend>
          <SkeletonMUP num={1} variant="rounded" width="100px" height="30px" />
        </legend>
        <Stack gap={3} display="flex" flexDirection="column">
          <Stack gap={3} display="flex" flexDirection="row">
            <SkeletonMUP num={2} variant="rounded" width="48%" height="50px" />
          </Stack>
          <SkeletonMUP num={1} variant="rounded" width="98%" height="250px" />
          <Stack gap={3} display="flex" flexDirection="row">
            <SkeletonMUP num={2} variant="rounded" width="48%" height="50px" />
          </Stack>
        </Stack>
      </fieldset>
    );
  }

  return (
    <fieldset className="edit-contentEdit anima-fade-bottom">
      <legend>
        <Typography variant="h4" className="title">
          <Icon icon="icon" /> Envie os ícones
        </Typography>
      </legend>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="body2">
            <b>DICA:</b> Vai enviar vários ícones? Envie por remessa! Escolha a
            categoria, o estilo e faça o upload. Lembrando que você só pode
            enviar até <b>100 arquivos</b> por remessa.
          </Typography>
        </Grid>

        <Grid container spacing={3} size={12}>
          <Grid size="grow" container spacing={1} alignItems="center">
            <Grid size="auto">
              <Icon icon="grid-horizontal" size={40} />
            </Grid>
            <Grid size="grow">
              <Autocomplete
                loading={loading}
                value={formData.categoryIcon}
                onChange={handleCategoryIconChange}
                getOptionLabel={(option) => option?.name || ''}
                options={
                  taxonomy?.data?.filter(
                    (item) => item.taxonomy === 'icon_category',
                  ) || []
                }
                isOptionEqualToValue={(option, value) =>
                  option?.term_id === value?.term_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    //required
                    label="Categoria dos ícones"
                    color="info"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid size="grow" container spacing={1} alignItems="center">
            <Grid size="auto">
              <Icon icon="palette" size={40} />
            </Grid>
            <Grid size="grow">
              <Autocomplete
                loading={loading}
                value={formData.styleIcon}
                onChange={handleStyleIconChange}
                getOptionLabel={(option) => option?.name || ''}
                options={
                  taxonomy?.data?.filter(
                    (item) => item.taxonomy === 'icon_style',
                  ) || []
                }
                isOptionEqualToValue={(option, value) =>
                  option?.term_id === value?.term_id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    //required
                    label="Estilo dos ícones"
                    color="info"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid size={12}>
            <Box
              {...getRootProps()}
              className={isDragActive ? 'dropzone dropzone-hover' : 'dropzone'}
              sx={{ p: 3, textAlign: 'center', cursor: 'pointer' }}
            >
              <input {...getInputProps()} />
              <Grid container spacing={1} size={12}>
                <Grid size="auto">
                  <Icon icon="icon" size={60} />
                </Grid>
                <Grid size="auto">
                  <Typography variant="body1">
                    {isDragActive ? (
                      <b>Solte a imagem aqui</b>
                    ) : (
                      <>
                        <b>Clique</b> ou arraste para enviar
                      </>
                    )}
                  </Typography>
                  <Typography variant="body2">PNG ou JPG (max. 3MB)</Typography>
                </Grid>
              </Grid>

              <Button size="small" variant="contained">
                Selecionar outro arquivo
              </Button>
            </Box>
          </Grid>

          <Grid size="grow">
            <TextField
              fullWidth
              color="info"
              variant="outlined"
              placeholder="Pesquisar ícones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="search" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton onClick={() => setSearchTerm('')}>
                    <Icon icon="close" />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid size="auto">
            <Button
              size="small"
              variant="contained"
              color={contrast ? 'black' : 'white'}
              startIcon={<Icon icon="contrast" />}
              sx={{
                height: '100%',
                color: contrast
                  ? 'var(--mui-palette-white-main)'
                  : 'var(--mui-palette-black-main)',
              }}
              onClick={() => setContrast(!contrast)}
            >
              Constraste
            </Button>
          </Grid>
          <Grid container size={12} gap={3}>
            {isSearching ? (
              <Grid
                display="flex"
                gap={2}
                justifyContent="center"
                alignItems="center"
                container
                size={iconSelected > 0 ? 8 : 12}
              >
                <CircularProgress color="neutral" /> Buscando...
              </Grid>
            ) : (
              <Grid
                size={iconSelected > 0 ? 8 : 12}
                className={contrast ? 'contrast' : ''}
              >
                <IconsList />
              </Grid>
            )}

            {iconSelected > 0 && iconData !== null && (
              <Grid size={4}>
                <EditAssetDetailsIcons
                  contrast={contrast}
                  setIconSelected={setIconSelected}
                  iconData={iconData}
                  setIconData={setIconData}
                  taxonomy={taxonomy}
                  setIcons={setIcons}
                  idAsset={asset.id}
                  slugAsset={asset.slug}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <EditAssetDeleteIcon
        idIcon={idIconDelete}
        idAsset={asset.id}
        setIdIcon={setIdIconDelete}
        iconData={iconData}
        setIcons={setIcons}
        setIconSelected={setIconSelected}
      />
    </fieldset>
  );
};

export default EditAssetIcons;
