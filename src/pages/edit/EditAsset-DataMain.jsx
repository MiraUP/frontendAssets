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
} from '@mui/material';
import React from 'react';
import Icon from '../../components/icon/icon';
import { useDropzone } from 'react-dropzone';
import { useAlert } from '../../hooks/alertContext';
import { Link } from 'react-router-dom';
import SkeletonMUP from '../../components/skeleton/skeleton';

const EditAssetDataMain = ({ asset, loading, taxonomy, setTaxonomy }) => {
  const showAlert = useAlert();
  const [title, setTitle] = React.useState('');
  const [subTitle, setSubTitle] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [download, setDownload] = React.useState('');
  const [compatibility, setCompatibility] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [files, setFiles] = React.useState([]);

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: {
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

  React.useEffect(() => {
    function setInitialData() {
      if (asset && taxonomy?.data) {
        setTitle(asset.title || '');
        setSubTitle(asset.subtitle || '');
        setThumbnail(asset.thumbnail || '');
        setDownload(asset.download || '');
        setCompatibility(asset.compatibility || []);
        setTags(asset.post_tag || []);
        if (asset.category) {
          const categoryData = Array.isArray(asset.category)
            ? asset.category[0]
            : asset.category;
          const foundCategory = taxonomy.data.find(
            (item) =>
              item.taxonomy === 'category' &&
              item.term_id === categoryData.term_id,
          );
          setCategory(foundCategory || null);
        }
      }
    }

    setInitialData();
  }, [asset, taxonomy?.data]);

  const handleRemoveImage = () => {
    // Remove tanto a imagem enviada quanto a thumbnail existente
    setFiles([]);
    setThumbnail('');
  };

  const thumbs = (
    <div className="dropzone-thumbs">
      {/* Mostra a pré-visualização do novo arquivo OU a thumbnail existente */}
      {(files.length > 0 || thumbnail) && (
        <>
          <img
            src={files.length > 0 ? files[0].preview : thumbnail}
            onLoad={() => {
              if (files.length > 0) {
                URL.revokeObjectURL(files[0].preview);
              }
            }}
            alt="Preview"
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

  console.log('asset', asset);
  console.log('Current category:', category);

  return (
    <fieldset className="edit-contentEdit">
      <legend>
        <Typography variant="h4" className="title">
          <Icon icon="edit" /> Dados Principais
        </Typography>
      </legend>

      <Grid container spacing={3}>
        <Grid container spacing={3} size={12}>
          <Grid item size="auto">
            <Button
              color="secondary"
              variant="contained"
              size="small"
              sx={{ width: '200px', height: '100%' }}
            >
              Auditar
            </Button>
          </Grid>
          <Grid item size="grow">
            <TextField
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Título Principal do Ativo"
              variant="standard"
              color="info"
              fullWidth
            />
          </Grid>
          <Grid item size="auto" alignItems="center" display="flex">
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
          <Grid item size={12}>
            <Typography variant="body2" color="textSecondary">
              Envie uma imagem de capa ( 1500px | 1000px )
            </Typography>
          </Grid>
          <Grid item size="grow">
            <Box
              {...getRootProps()}
              className={isDragActive ? 'dropzone dropzone-hover' : 'dropzone'}
            >
              <input {...getInputProps()} />
              <Grid container spacing={1} size={12}>
                <Grid item size="auto">
                  <Icon icon="image" size={60} />
                </Grid>
                <Grid item size="auto">
                  <Typography variant="body1">
                    {isDragActive ? (
                      <b>Solte os arquivos aqui</b>
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
          <Grid item size="auto">
            {thumbs}
          </Grid>
        </Grid>
        <Grid container spacing={3} size={12}>
          <Grid item size={6}>
            <TextField
              id="subtitle"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              label="Subtítulo do Ativo"
              variant="outlined"
              color="info"
              fullWidth
            />
          </Grid>
          <Grid item size={6}>
            <Autocomplete
              disablePortal
              loading={loading}
              value={category}
              onChange={(event, newValue) => {
                setCategory(newValue);
              }}
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
              id="download"
              value={download}
              onChange={(e) => setDownload(e.target.value)}
              label="Link de download do pacote"
              variant="outlined"
              color="info"
              fullWidth
            />
          </Grid>
          <Grid item size="auto">
            <Link target="_blank" to={download ? download : ''}>
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
        </Grid>

        <Grid container spacing={3} size={12}>
          <Grid item size={6}>
            <Autocomplete
              multiple
              limitTags={3}
              disablePortal
              value={tags} // Alterado de defaultValue para value
              onChange={(event, newValue) => {
                setTags(newValue);
              }}
              getOptionLabel={(option) => option.name || ''}
              options={
                taxonomy?.data?.length > 0
                  ? taxonomy.data.filter(
                      ({ taxonomy }) => taxonomy === 'post_tag',
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
                <TextField {...params} label="Tags" color="info" fullWidth />
              )}
            />
          </Grid>
          <Grid item size={6}>
            <Autocomplete
              multiple
              limitTags={3}
              disablePortal
              value={compatibility} // Alterado de defaultValue para value
              onChange={(event, newValue) => {
                setCompatibility(newValue);
              }}
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
