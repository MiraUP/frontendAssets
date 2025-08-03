import React from 'react';
import HeadConfig from '../../components/headConfig';
import { ProgressScroll } from '../../components/progressScroll/progress';
import PageSearch from '../search/pageSearch';
import { UserContext } from '../../hooks/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../hooks/alertContext';
import Header from '../../layout/header';
import {
  ASSETS_GET,
  ASSETS_PUT,
  MEDIA_POST,
  TAXONOMY_GET,
} from '../../hooks/useFetch';
import EditAssetBanner from './editAsset-Banner';
import EditAssetDataMain from './EditAsset-DataMain';
import ScrollSpy from '../../components/scrollSpy/scrollSpy';
import { Box, Container, Grid, Typography } from '@mui/material';
import EditAssetIcons from './EditAsset-icons';

const EditAsset = () => {
  const token = window.localStorage.getItem('token');
  const { data } = React.useContext(UserContext);
  const { slug } = useParams();
  const showAlert = useAlert();
  const [dataAsset, setDataAsset] = React.useState();
  const [loadingAsset, setLoadingAsset] = React.useState(true);
  const navigate = useNavigate();
  const [loadingTaxonomy, setLoadingTaxonomy] = React.useState(true);
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [loadingIconsUpload, setLoadingIconsUpload] = React.useState(false);
  const [taxonomy, setTaxonomy] = React.useState({
    name: 'category',
    data: [],
  });
  const [files, setFiles] = React.useState([]);
  const [filesIcons, setFilesIcons] = React.useState([]);
  const [formData, setFormData] = React.useState({
    title: '',
    subtitle: '',
    thumbnail: null,
    category: [],
    origin: [],
    developer: [],
    version: '',
    download: '',
    font: '',
    size_file: '',
    post_tag: [],
    compatibility: [],
    content: '',
    categoryIcon: null,
    styleIcon: null,
  });

  React.useEffect(() => {
    setLoadingAsset(true);
    async function getSingleAssets() {
      try {
        const { url, options } = ASSETS_GET(token);
        const response = await fetch(`${url}/${slug}`, options);
        const json = await response.json();

        if (!json.data) {
          showAlert(json.message, 'error');
          setDataAsset();
        } else {
          setDataAsset(json.data);
          setFormData({
            title: json.data.title || '',
            subtitle: json.data.subtitle || '',
            download: json.data.download || '',
            content: json.data.post_content || '',
            category: json.data.category?.[0] || null,
            compatibility: json.data.compatibility || [],
            post_tag: json.data.post_tag || [],
          });
        }
      } catch (err) {
        showAlert(err.message || err, 'error');
      } finally {
        setLoadingAsset(false);
      }
    }
    getSingleAssets();
  }, [slug]);

  //Atualiza o Ativo Digital
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingUpdate(true);

    try {
      const formDataToSend = new FormData();

      // Campos básicos
      formDataToSend.append('post_id', dataAsset.id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('version', formData.version || '');
      formDataToSend.append('font', formData.font || '');
      formDataToSend.append('size_file', formData.size_file || '');
      formDataToSend.append('download', formData.download || '');

      // Taxonomias
      if (formData.category) {
        formDataToSend.append(
          'category',
          formData.category.slug || formData.category.term_id,
        );
      }

      formData.compatibility.forEach((item) => {
        formDataToSend.append('compatibility[]', item.slug || item.term_id);
      });

      formData.post_tag.forEach((tag) => {
        formDataToSend.append('post_tag[]', tag.slug || tag.term_id);
      });

      // Upload de thumbnail (se houver novo arquivo)
      if (files.length > 0) {
        formDataToSend.append('thumbnail', files[0]);
      }
      console.log(formDataToSend.thumbnail);
      const { url, options } = ASSETS_PUT(token, formDataToSend);
      const response = await fetch(url, options);
      const json = await response.json();

      if (json.success) {
        showAlert('Ativo atualizado com sucesso!', 'success');

        if (files.length > 0) {
          setFiles([]); // Limpa o estado de files
          formDataToSend.delete('thumbnail'); // Remove o thumbnail do FormData
        }

        // Atualiza os dados locais se necessário
        if (files.length > 0) {
          const previewUrl = URL.createObjectURL(files[0]);
          setDataAsset((prev) => ({
            ...prev,
            thumbnail: previewUrl,
          }));
        }
      } else {
        showAlert(json.message || 'Erro ao atualizar o ativo', 'error');
      }
    } catch (err) {
      showAlert(err.message || 'Falha ao tentar atualizar o ativo.', 'error');
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Buscar taxonomias
  React.useEffect(() => {
    async function getTaxonomy() {
      try {
        setLoadingTaxonomy(true);
        const { url, options } = TAXONOMY_GET(token);
        const response = await fetch(url, options);
        const json = await response.json();
        setTaxonomy((prev) => ({
          ...prev,
          data: json.data,
        }));
      } catch (err) {
        showAlert(
          err.message || err || 'Falha ao buscar as taxonomias.',
          'error',
        );
      } finally {
        setLoadingTaxonomy(false);
      }
    }
    getTaxonomy();
  }, []);

  const BasicsComponents = () => {
    return (
      <>
        <HeadConfig
          title={`${dataAsset && dataAsset.title}`}
          description={`Edição do ${dataAsset && dataAsset.title}`}
          page="editAsset"
        />
        <ProgressScroll />
        <PageSearch />
      </>
    );
  };

  if (data.data.roles[0] === 'subscriber') {
    navigate('/');
    return null;
  } else {
    return (
      <>
        <BasicsComponents />
        <Header />
        <EditAssetBanner asset={dataAsset} loading={loadingAsset} />
        <Container>
          <Grid container>
            <Grid item size="grow" component="form" onSubmit={handleSubmit}>
              <Box id="mainData">
                <EditAssetDataMain
                  asset={dataAsset}
                  setDataAsset={setDataAsset}
                  loading={loadingAsset || loadingTaxonomy}
                  loadingUpdate={loadingUpdate}
                  formData={formData}
                  setFormData={setFormData}
                  taxonomy={taxonomy}
                  setTaxonomy={setTaxonomy}
                  files={files}
                  setFiles={setFiles}
                />
              </Box>

              {formData?.category?.slug === 'icon' && (
                <Box id="iconsData">
                  <EditAssetIcons
                    asset={dataAsset}
                    setDataAsset={setDataAsset}
                    loading={loadingAsset || loadingTaxonomy}
                    loadingUpdate={loadingUpdate}
                    taxonomy={taxonomy}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </Box>
              )}

              <Box id="section3" sx={{ minHeight: '100vh', p: 3 }}>
                <Typography variant="h4">Conteúdo da Seção 3</Typography>
              </Box>
            </Grid>
            <Grid item size="auto">
              <ScrollSpy
                sections={[
                  { id: 'mainData', label: 'Dados Principais' },
                  formData?.category?.slug === 'icon' && {
                    id: 'iconsData',
                    label: 'Enviar ícones',
                  },
                  { id: 'section3', label: 'Seção 3' },
                ].filter(Boolean)}
              />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
};

export default EditAsset;
