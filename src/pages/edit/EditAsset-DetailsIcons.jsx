import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  Grid,
  InputBase,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import ImageMUP from '../../components/image/image';
import { useAlert } from '../../hooks/alertContext';
import Icon from '../../components/icon/icon';
import EditAssetDeleteIcon from './EditAsset-DeleteIcon';
import { MEDIA_PUT } from '../../hooks/useFetch';

const EditAssetDetailsIcons = ({
  contrast,
  setIconSelected,
  iconData,
  setIconData,
  setIcons,
  idAsset,
  slugAsset,
  taxonomy,
}) => {
  const token = window.localStorage.getItem('token');
  const [title, setTitle] = useState(iconData?.title || '');
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null); // Alterado para single value
  const [styles, setStyles] = useState([]); // Alterado para array
  const [isSaving, setIsSaving] = useState(false);
  const [idIconDelete, setIdIconDelete] = React.useState(0);
  const [deleteTag, setDeleteTag] = React.useState('');
  const showAlert = useAlert();

  // Inicializa os estados quando o iconData muda
  useEffect(() => {
    if (iconData?.tags) {
      setTags(
        iconData.tags.map((tag) => ({
          term_id: tag.term_id,
          name: tag.name,
          slug: tag.slug,
          taxonomy: tag.taxonomy || 'icon_tag',
        })),
      );
    }

    if (iconData?.categories?.length > 0) {
      // Pega a primeira categoria (única)
      setCategory({
        term_id: iconData.categories[0].term_id,
        name: iconData.categories[0].name,
        slug: iconData.categories[0].slug,
        taxonomy: 'icon_category',
      });
    }

    if (iconData?.styles) {
      setStyles(
        iconData.styles.map((style) => ({
          term_id: style.term_id,
          name: style.name,
          slug: style.slug,
          taxonomy: 'icon_style',
        })),
      );
    }
  }, [iconData]);

  const handleTagsChange = (event, newValue) => {
    setTags(newValue);
  };

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  const handleStylesChange = (event, newValue) => {
    setStyles(newValue);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const dataToUpdate = {
        post_slug: slugAsset,
        icon_id: iconData.id,
        post_category: category?.slug || category?.term_id, // Envia slug ou ID
        post_style: styles.map((style) => style.slug || style.term_id), // Array de slugs/IDs
        post_tag: tags.map((tag) => tag.name), // Array de slugs/IDs
      };

      const { url, options } = MEDIA_PUT(token);
      options.body = JSON.stringify(dataToUpdate);

      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || `Erro ${response.status}`);
      }

      if (json.success) {
        showAlert(json.message, 'success');
        setIconData((prev) => ({
          ...prev,
          tags,
          categories: category ? [category] : [],
          styles,
        }));
      } else {
        throw new Error(json.message || 'Erro ao atualizar dados');
      }
    } catch (error) {
      showAlert(error.message, 'error');
      console.error('Erro detalhado:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTag = (tagToDelete) => async () => {
    try {
      setIsSaving(true);

      const dataToUpdate = {
        post_slug: slugAsset,
        icon_id: iconData.id,
        delete_tag: String(tagToDelete.term_id), // Garante que será string para o PHP
      };

      const { url, options } = MEDIA_PUT(token);
      options.body = JSON.stringify(dataToUpdate);

      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok) throw new Error(json.message || 'Erro ao remover tag');

      if (json.success) {
        setTags(tags.filter((tag) => tag.term_id !== tagToDelete.term_id));
        showAlert(json.message, 'success');
      } else {
        throw new Error(json.message || 'Erro ao remover tag');
      }
    } catch (error) {
      showAlert(error.message, 'error');
      console.error('Erro detalhado:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtra as opções disponíveis
  const tagOptions =
    taxonomy?.data?.filter(({ taxonomy }) => taxonomy === 'icon_tag') || [];

  const categoryOptions =
    taxonomy?.data?.filter(({ taxonomy }) => taxonomy === 'icon_category') ||
    [];

  const styleOptions =
    taxonomy?.data?.filter(({ taxonomy }) => taxonomy === 'icon_style') || [];

  return (
    <Box className={`icon-detail${contrast ? ' contrast' : ''}`}>
      <Grid container size={12} gap={3}>
        <Grid size={12} className="preview">
          <IconButton
            className="anima-rotate-zoom"
            sx={{ position: 'absolute', right: 5, top: 5 }}
            onClick={() => setIconSelected(0)}
          >
            <Icon icon="close" />
          </IconButton>
          <ImageMUP src={iconData.url} width={100} height={100} />
          <InputBase
            fullWidth
            placeholder="Título do ícone"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ 'aria-label': 'Título do ícone' }}
          />
        </Grid>
        <Divider
          variant="middle"
          sx={{
            width: 'calc(100% - 32px)',
            borderColor: 'var(--mui-palette-background-border)',
          }}
        />

        {/* Campo de Categoria (único) */}
        <Grid size={12} px={2}>
          <Autocomplete
            value={category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.slug === value.slug}
            renderInput={(params) => (
              <TextField {...params} label="Categoria" color="info" fullWidth />
            )}
          />
        </Grid>

        {/* Campo de Estilos (múltiplos) */}
        <Grid size={12} px={2}>
          <Autocomplete
            multiple
            limitTags={1}
            value={styles}
            onChange={handleStylesChange}
            options={styleOptions}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.slug === value.slug}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.slug}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Estilos" color="info" fullWidth />
            )}
          />
        </Grid>

        {/* Campo de Tags (múltiplos) */}
        <Grid size={12} px={2}>
          <Autocomplete
            multiple
            limitTags={1}
            value={tags}
            onChange={handleTagsChange}
            options={tagOptions}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.slug === value.slug}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.slug}
                  onDelete={handleDeleteTag(option)}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags/Etiquetas"
                color="info"
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid size={12} px={2}>
          <Button
            variant="contained"
            color="error"
            size="xsmall"
            fullWidth
            onClick={() => setIdIconDelete(iconData.id)}
          >
            Excluir ícone
          </Button>
        </Grid>
        <Grid size={12} px={2}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleSave}
              disabled={isSaving}
              color="success"
            >
              {isSaving ? 'Salvando...' : 'Salvar modificações'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <EditAssetDeleteIcon
        idIcon={idIconDelete}
        idAsset={idAsset}
        setIdIcon={setIdIconDelete}
        iconData={iconData}
        setIcons={setIcons}
        setIconSelected={setIconSelected}
      />
    </Box>
  );
};

export default EditAssetDetailsIcons;
