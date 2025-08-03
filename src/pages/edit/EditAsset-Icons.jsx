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
  Typography,
  useColorScheme,
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import Icon from '../../components/icon/icon';
import SkeletonMUP from '../../components/skeleton/skeleton';
import { useAlert } from '../../hooks/alertContext';
import { useDropzone } from 'react-dropzone';
import ImageMUP from '../../components/image/image';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MEDIA_DELETE, MEDIA_POST, PREVIEWS_GET } from '../../hooks/useFetch';

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
  const [isSearching, setIsSearching] = React.useState(false);
  const [contrast, setContrast] = React.useState(false);

  useEffect(() => {
    console.log('Estado atual dos ícones:', {
      icons,
      filesIcons,
      uploadQueue,
      uploadProgress,
      isUploading,
      formData,
    });
  }, [icons, filesIcons, uploadQueue, uploadProgress, isUploading]);

  // Efeito para processar a fila de upload
  useEffect(() => {
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

          console.log('Enviando upload com:', {
            category: currentCategory,
            style: currentStyle,
            file: file.name, // Mudar de fileToUpload.file.name para file.name
          });

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

  const loadIcons = useCallback(
    async (pageToLoad = 1, shouldReset = false) => {
      try {
        const pageNumber = ensurePositiveNumber(pageToLoad);
        setIsLoadingMore(true);

        const { url, options } = PREVIEWS_GET(token);
        let apiUrl = `${url}/${asset.id}?page=${pageNumber}&orderby=modified&order=DESC`;

        // Adiciona o parâmetro de busca se houver termo
        if (searchTerm) {
          apiUrl += `&search=${encodeURIComponent(searchTerm)}`;
          setIsSearching(true);
        } else {
          setIsSearching(false);
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
      }
    },
    [asset.id, token, showAlert, searchTerm], // Adicione searchTerm às dependências
  );

  useEffect(() => {
    if (asset?.id) {
      // Usa um debounce para evitar muitas requisições enquanto digita
      const handler = setTimeout(() => {
        loadIcons(1, true); // Recarrega da página 1 quando o termo muda
      }, 500); // 500ms de delay

      return () => clearTimeout(handler);
    }
  }, [searchTerm, asset?.id, loadIcons]);

  // Carregamento inicial
  useEffect(() => {
    if (asset?.id) {
      loadIcons(1, true); // Força reset começando da página 1
    }
  }, [asset?.id, loadIcons]);

  // Função para carregar mais itens
  const loadMoreIcons = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadIcons(currentPage); // Usa currentPage atual sem reset
    }
  }, [isLoadingMore, hasMore, currentPage, loadIcons]);

  // Carrega os ícones iniciais
  useEffect(() => {
    if (asset?.id) {
      loadIcons(true);
    }
  }, [asset?.id, loadIcons]);

  // Limpa as URLs de preview quando o componente desmonta
  useEffect(() => {
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

  // Remove um ícone existente
  const handleRemoveExistingIcon = async (iconId) => {
    try {
      setIcons((prev) => prev.filter((icon) => icon.id !== iconId));

      const { url, options } = MEDIA_DELETE(token);
      const response = await fetch(
        `${url}?media_type=preview&asset_id=${asset.id}&media_id=${iconId}`,
        options,
      );
      const json = await response.json();

      if (json.success) {
        setIcons((prev) => prev.filter((icon) => icon.id !== iconId));
        showAlert('Ícone removido com sucesso!', 'success');
      } else {
        console.log(json);
        throw new Error('Falha ao remover ícone');
      }
    } catch (err) {
      showAlert(err.message || 'Erro ao remover ícone', 'error');
    }
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

  // Componente de lista de ícones com Infinite Scroll
  const IconsList = () => (
    <InfiniteScroll
      dataLength={icons.length}
      next={loadMoreIcons}
      hasMore={hasMore}
      loader={
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      }
      endMessage={
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          py={2}
        >
          {icons.length === 0
            ? 'Nenhum ícone encontrado'
            : 'Todos os ícones foram carregados'}
        </Typography>
      }
      style={{ overflow: 'visible' }}
      shouldUpdateScroll={false}
    >
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
        gap={2}
        py={2}
      >
        {/* Ícones existentes */}
        {icons.map((icon) => (
          <Box key={`${icon.id}-${Date.now()}`} position="relative">
            {icon?.url ? (
              <ImageMUP
                src={icon.url}
                width={80}
                height={80}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
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
                <Icon icon="broken_image" size={24} />
              </Box>
            )}
            <Button
              variant="contained"
              onClick={() => handleRemoveExistingIcon(icon.id)}
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 'auto',
                p: 0.5,
              }}
            >
              <Icon icon="close" size={16} />
            </Button>
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
              <ImageMUP
                src={file.preview || null}
                onLoad={() => file.preview && URL.revokeObjectURL(file.preview)}
                width={80}
                height={80}
                sx={{ opacity: status === 'completed' ? 1 : 0.7 }}
                alt="Ícone sendo enviado"
              />

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
            </Box>
          );
        })}
      </Box>
    </InfiniteScroll>
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
                    required
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
                    required
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
              color="white"
              startIcon={<Icon icon="contrast" />}
              sx={{ height: '100%', color: 'var(--mui-palette-black-main)' }}
              onClick={() => setContrast(!contrast)}
            >
              Constraste
            </Button>
          </Grid>
          <Grid size={12} className={contrast ? 'contrast' : ''}>
            <IconsList />
          </Grid>
        </Grid>
      </Grid>
    </fieldset>
  );
};

export default EditAssetIcons;
