import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import React from 'react';
import Icon from '../../components/icon/icon';
import { useDropzone } from 'react-dropzone';
import { useAlert } from '../../hooks/alertContext';
import { Link } from 'react-router-dom';
import SkeletonMUP from '../../components/skeleton/skeleton';
import { MEDIA_DELETE } from '../../hooks/useFetch';
import ImageMUP from '../../components/image/image';

const EditAssetDataMain = ({
  asset,
  setDataAsset,
  loading,
  loadingUpdate,
  taxonomy,
  formData,
  setFormData,
  files,
  setFiles,
}) => {
  const token = window.localStorage.getItem('token');
  const { mode } = useColorScheme();
  const showAlert = useAlert();
  const [thumbnail, setThumbnail] = React.useState('');
  const [delThumbLoading, setDelThumbLoading] = React.useState(false);
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
      'image/png': ['.png'],
      'image/jpg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    maxSize: 3000000, // 3MB
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
      // Limpa a thumbnail existente quando um novo arquivo é enviado
      setThumbnail('');
    },
    onDropRejected: (rejectedFiles) => {
      showAlert(
        `Arquivo inválido. Tamanho máximo: 3MB. Tipos permitidos: PNG ou JPG.`,
        'error',
      );
    },
  });

  // No useEffect de inicialização
  React.useEffect(() => {
    function setInitialData() {
      if (asset && taxonomy?.data) {
        setFormData((prev) => ({
          ...prev,
          title: asset.title || '',
          subtitle: asset.subtitle || '',
          download: asset.download || '',
          content: asset.post_content || '',
          version: asset.version || '',
          font: asset.font || '',
          size_file: asset.size_file || '',
          category: asset.category?.[0] || null,
          compatibility: asset.compatibility || [],
          post_tag: asset.post_tag || [],
        }));

        // Estados locais apenas para UI
        setThumbnail(asset.thumbnail || '');
      }
    }
    setInitialData();
  }, [asset, taxonomy?.data]);

  const handleRemoveImage = () => {
    //Remove imagem cadastrada
    async function deleteThumbnail() {
      setDelThumbLoading(true);
      try {
        const { url, options } = MEDIA_DELETE(token);
        const response = await fetch(
          `${url}?asset_id=${asset.id}&media_id=${asset.thumbnail_id}&media_type=thumbnail`,
          options,
        );
        const json = await response.json();
        if (json.success) {
          setDataAsset((prev) => ({
            ...prev,
            thumbnail: '',
          }));
          showAlert('Capa removida!', 'success');
        } else {
          showAlert(json.message || 'Erro ao remover a capa.', 'error');
        }
      } catch (err) {
        setDelThumbLoading(false);
        showAlert(err.message || err, 'error');
      } finally {
        setDelThumbLoading(false);
      }
    }
    deleteThumbnail();

    // Remove tanto a imagem enviada quanto a thumbnail existente
    setFiles([]);
    setThumbnail('');
  };

  const thumbs = (
    <div className="dropzone-thumbs">
      {/* Mostra a pré-visualização do novo arquivo OU a thumbnail existente */}
      {(files.length > 0 || thumbnail) && (
        <>
          <ImageMUP
            src={files.length > 0 ? files[0].preview : thumbnail}
            onLoad={() => {
              if (files.length > 0) {
                URL.revokeObjectURL(files[0].preview);
              }
            }}
            loading={delThumbLoading}
            alt="Preview da capa"
          />
          <Tooltip title="Remover" arrow placement="top">
            <Button
              variant="outlined"
              onClick={handleRemoveImage}
              aria-label="Remover imagem"
              className="dropzone-deleteFile"
              color="error"
              size="xsmall"
            >
              <Icon icon="close" size={25} />
            </Button>
          </Tooltip>
        </>
      )}
    </div>
  );

  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  // Remova todos os estados locais e use apenas formData e setFormData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      category: newValue
        ? {
            term_id: newValue.slug, // Usando slug como ID
            name: newValue.name,
            slug: newValue.slug,
          }
        : null,
    }));
  };

  const handleCompatibilityChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      compatibility: newValue.map((item) => ({
        term_id: item.slug, // Usando slug como ID
        name: item.name,
        slug: item.slug,
      })),
    }));
  };

  const handleTagsChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      post_tag: newValue.map((item) => ({
        term_id: item.slug, // Usando slug como ID
        name: item.name,
        slug: item.slug,
      })),
    }));
  };

  if (loading) {
    return (
      <fieldset className="edit-contentEdit" style={{ marginTop: '20px' }}>
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
          <Icon icon="edit" /> Dados Principais
        </Typography>
      </legend>

      <div className={`loadingUpdate${loadingUpdate ? ' show' : ''}`}>
        <CircularProgress color={mode === 'dark' ? 'white' : 'black'} />
        <Typography variant="body2">
          Aguarde, isso pode demorar um pouco...
        </Typography>
      </div>

      <Grid container spacing={3}>
        <Grid container spacing={3} size={12}>
          <Grid size="auto">
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              size="small"
              sx={{ width: '200px', height: '100%' }}
            >
              Auditar
            </Button>
          </Grid>
          <Grid size="grow">
            <TextField
              required
              id="title"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
              label="Título Principal do Ativo"
              variant="standard"
              color="info"
              fullWidth
            />
          </Grid>
          <Grid size="auto" alignItems="center" display="flex">
            <Tooltip
              title={
                <>
                  <Typography variant="body2" align="center">
                    Título principal do ativo.
                  </Typography>
                  <Typography variant="body2" align="center">
                    Prefira por títulos curtos e descritivos.
                  </Typography>
                </>
              }
              arrow
            >
              <span>
                <Icon icon="info" aria-label="Informações sobre o título" />
              </span>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container spacing={1} size={12}>
          <Grid size={12}>
            <Typography variant="body2" color="textSecondary">
              Envie uma imagem de capa ( Recomendado: 1800px | 1360px )
            </Typography>
          </Grid>
          <Grid size="grow">
            <Box
              {...getRootProps()}
              className={isDragActive ? 'dropzone dropzone-hover' : 'dropzone'}
            >
              <input {...getInputProps()} />
              <Grid container spacing={1} size={12}>
                <Grid size="auto">
                  <Icon icon="image" size={60} />
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
          <Grid size="auto">{thumbs}</Grid>
        </Grid>
        <Grid container spacing={3} size={12}>
          <Grid size={6}>
            <TextField
              required
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              label="Subtítulo do Ativo"
              variant="outlined"
              color="info"
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              loading={loading}
              value={formData.category}
              onChange={handleCategoryChange}
              getOptionLabel={(option) => option?.name || ''}
              options={
                taxonomy?.data?.filter(
                  (item) => item.taxonomy === 'category',
                ) || []
              }
              isOptionEqualToValue={(option, value) =>
                option?.term_id === value?.term_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Categoria"
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
        <Grid container spacing={3} size={12}>
          <Grid item size="grow">
            <TextField
              required
              id="download"
              name="download"
              value={formData.download}
              onChange={handleInputChange}
              label="Link de download do pacote"
              variant="outlined"
              color="info"
              fullWidth
            />
          </Grid>
          {formData.download && (
            <Grid item size="auto">
              <Link target="_blank" to={formData.download}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Icon icon="download" />}
                  sx={{ height: '100%' }}
                >
                  Teste o link
                </Button>
              </Link>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={3} size={12}>
          <Grid size={6}>
            <Autocomplete
              freeSolo
              multiple
              limitTags={3}
              value={formData.post_tag || []}
              onChange={handleTagsChange}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  const tag = taxonomy.data.find((t) => t.slug === option);
                  return tag?.name || option;
                }
                return option.name || '';
              }}
              options={
                taxonomy?.data?.filter(
                  ({ taxonomy }) => taxonomy === 'post_tag',
                ) || []
              }
              isOptionEqualToValue={(option, value) => {
                if (typeof option === 'string' || typeof value === 'string') {
                  return option === value;
                }
                return option.slug === value.slug;
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const label =
                    typeof option === 'string'
                      ? taxonomy.data.find((t) => t.slug === option)?.name ||
                        option
                      : option.name;
                  return (
                    <Chip
                      label={label}
                      {...getTagProps({ index })}
                      key={typeof option === 'string' ? option : option.term_id}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" color="info" fullWidth />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              freeSolo
              multiple
              limitTags={3}
              value={formData.compatibility || []}
              onChange={handleCompatibilityChange}
              getOptionLabel={(option) => option.name || ''}
              options={
                taxonomy?.data?.length > 0
                  ? taxonomy.data.filter(
                      ({ taxonomy }) => taxonomy === 'compatibility',
                    )
                  : []
              }
              isOptionEqualToValue={(option, value) =>
                option.term_id === value.term_id
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option.term_id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Compatibilidades"
                  color="info"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </fieldset>
  );
};

export default EditAssetDataMain;
