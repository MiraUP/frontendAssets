import React from 'react';
import HeadConfig from '../../components/headConfig';
import { ProgressScroll } from '../../components/progressScroll/progress';
import PageSearch from '../search/pageSearch';
import { UserContext } from '../../hooks/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../hooks/alertContext';
import Header from '../../layout/header';
import { ASSETS_GET } from '../../hooks/useFetch';
import EditAssetBanner from './editAsset-Banner';
import EditAssetDataMain from './EditAsset-DataMain';
import ScrollSpy from '../../components/scrollSpy/scrollSpy';
import { Box, Container, Typography } from '@mui/material';

const EditAsset = () => {
  const token = window.localStorage.getItem('token');
  const { data } = React.useContext(UserContext);
  const { slug } = useParams();
  const showAlert = useAlert();
  const [dataAsset, setDataAsset] = React.useState();
  const [loadingAsset, setLoadingAsset] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoadingAsset(true);
    async function getSingleAssets() {
      try {
        const { url, options } = ASSETS_GET(token);
        const response = await fetch(`${url}/${slug}`, options);
        const json = await response.json();

        if (json.code === 'post_not_found') {
          showAlert(json.message, 'error');
          setDataAsset();
        } else {
          setDataAsset(json.data);
        }
      } catch (err) {
        showAlert(err.message || err, 'error');
      } finally {
        setLoadingAsset(false);
      }
    }
    getSingleAssets();
  }, [slug]);

  const sectionsScrollSpy = [
    {
      id: 'section1',
      label: 'Seção 1',
      content: 'Texto personalizado aqui...',
    },
    { id: 'section2', label: 'Seção 2', content: 'Outro conteúdo...' },
  ];

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
  console.log(data);
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
          <ScrollSpy
            sections={[
              { id: 'section1', label: 'Seção 1' },
              { id: 'section2', label: 'Seção 2' },
              { id: 'section3', label: 'Seção 3' },
            ]}
          />

          <Box id="section1" sx={{ minHeight: '100vh', p: 3 }}>
            <Typography variant="h4">Conteúdo da Seção 1</Typography>
          </Box>

          <Box id="section2" sx={{ minHeight: '100vh', p: 3 }}>
            <Typography variant="h4">Conteúdo da Seção 2</Typography>
          </Box>

          <Box id="section3" sx={{ minHeight: '100vh', p: 3 }}>
            <Typography variant="h4">Conteúdo da Seção 3</Typography>
          </Box>
          <EditAssetDataMain asset={dataAsset} loading={loadingAsset} />
        </Container>
      </>
    );
  }
};

export default EditAsset;
