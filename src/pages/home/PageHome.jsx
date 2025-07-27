import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PreLoading from '../loading/preLoading';
import { ProgressScroll } from '../../components/progressScroll/progress';
import Header from '../../layout/header';
import HeadConfig from '../../components/headConfig';
import Footer from '../../layout/footer';
import HomeBanner from './Home-Banner';
import HomeSearch from './Home-Search';
import { ASSETS_GET, SYSTEM_GET, TAXONOMY_GET } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';
import HomeFilter from './Home-Filter';
import HomeAssets from './Home-Assets';
import { ScrollEndMessage, ScrollLoader } from '../loading/messageScroll';
import { UserContext } from '../../hooks/userContext';
import PageSearch from '../search/pageSearch';
import { Box, Container, Typography } from '@mui/material';
import DesertMUP from '../../assets/img/illustrations/desert.svg';

const PageHome = () => {
  const token = window.localStorage.getItem('token');
  const { data } = React.useContext(UserContext);
  const [dataAssets, setDataAssets] = React.useState([]);
  const [loadingAssets, setLoadingAssets] = React.useState(true);
  const [dataTaxonomys, setDataTaxonomys] = React.useState();
  const [loadingTaxonomys, setLoadingTaxonomys] = React.useState(true);
  const [dataSystem, setDataSystem] = React.useState();
  const [loadingSystem, setLoadingSystem] = React.useState(true);
  const showAlert = useAlert();
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [resetScroll, setResetScroll] = React.useState(false);
  const [filters, setFilters] = React.useState({
    category: '',
    new: false,
    favorite: false,
    dateOrder: 'DESC',
  });

  const styleNotFound = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'start',
    height: '700px',
    width: '100%',
    padding: 4,
    color: 'text.secondary',
    backgroundImage: `url(${DesertMUP})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    borderRadius: '10px',
    paddingTop: '200px',
  };

  // Função para construir a URL da API
  const buildApiUrl = React.useCallback(
    (pageNum) => {
      const { url } = ASSETS_GET(token);
      const params = new URLSearchParams();

      params.append('total', '10');
      params.append('page', pageNum);

      if (filters.category) params.append('category', filters.category);
      if (filters.new) params.append('new', 'true');
      if (filters.favorite) params.append('favorite', 'true');
      if (filters.dateOrder) params.append('date_created', filters.dateOrder);

      return `${url}/?${params.toString()}`;
    },
    [token, filters], // Dependência mudou para filters
  );

  // Função para carregar ativos
  const loadAssets = React.useCallback(
    async (pageNum, isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoadingAssets(true);
      }

      try {
        const { options } = ASSETS_GET(token);
        const apiUrl = buildApiUrl(pageNum);

        const response = await fetch(apiUrl, options);
        if (!response.ok) throw new Error('Erro na resposta da API');

        const json = await response.json();
        if (!json?.data) throw new Error('Estrutura de dados inválida');

        setDataAssets((prev) =>
          isInitialLoad ? json.data : [...prev, ...json.data],
        );
        setPage(pageNum);
        setTotalPages(json.total_pages || 1);
        setMessage(json.message);

        const hasMoreItems =
          json.data.length > 0 && pageNum < (json.total_pages || 1);
        setHasMore(hasMoreItems);

        if (isInitialLoad) {
          setResetScroll((prev) => !prev);
        }
      } catch (err) {
        console.error('Erro ao carregar ativos:', err);
        showAlert(err.message || 'Erro ao carregar dados', 'error');
        setHasMore(false);
      } finally {
        if (isInitialLoad) {
          setLoadingAssets(false);
        }
      }
    },
    [token, filters, showAlert, loadingAssets, buildApiUrl],
  );

  // Efeito para recarregar quando os parâmetros mudam
  React.useEffect(() => {
    setPage(1);
    setDataAssets([]);
    setLoadingAssets(true);
    setHasMore(true);
    loadAssets(1, true);
  }, [filters]); // Recarrega quando filters mudar

  // Buscar dados do sistema
  React.useEffect(() => {
    setLoadingSystem(true);
    async function getSystemData() {
      try {
        const { url, options } = SYSTEM_GET(token);
        const response = await fetch(`${url}`, options);
        const json = await response.json();
        setDataSystem(json.data);
      } catch (err) {
        showAlert(err.message || err, 'error');
      } finally {
        setLoadingSystem(false);
      }
    }
    getSystemData();
  }, []);

  // Buscar taxonomias
  React.useEffect(() => {
    setLoadingTaxonomys(true);
    async function getTaxonomy() {
      try {
        const { url, options } = TAXONOMY_GET(token);
        const response = await fetch(`${url}?taxonomy=category`, options);
        const json = await response.json();
        setDataTaxonomys(json.data);
      } catch (err) {
        showAlert(
          err.message || 'Ocorreu uma falha ao buscar as categorias.',
          'error',
        );
      } finally {
        setLoadingTaxonomys(false);
      }
    }
    getTaxonomy();
  }, []);

  return (
    <>
      <HeadConfig
        title="Home"
        description="Página inicial do Banco de Ativos Digitais"
        page="home"
      />
      <PreLoading />
      <ProgressScroll />
      <PageSearch />
      <Header />
      <HomeBanner data={dataSystem} loading={loadingSystem} />
      <HomeSearch
        data={dataTaxonomys}
        loading={loadingTaxonomys}
        onCategoryChange={(category) =>
          setFilters((prev) => ({ ...prev, category }))
        }
        currentCategory={filters.category}
      />
      <HomeFilter
        onFilterChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
        currentFilters={filters}
      />
      <InfiniteScroll
        key={`infinite-scroll-${resetScroll}`}
        dataLength={dataAssets.length}
        next={() => loadAssets(page + 1)}
        hasMore={hasMore}
        loader={
          hasMore && (
            <Container className="page-anima">
              <ScrollLoader />
            </Container>
          )
        }
        endMessage={
          dataAssets.length > 0 ? (
            <Container className="page-anima">
              <ScrollEndMessage />
            </Container>
          ) : (
            !loadingAssets && (
              <Box
                sx={{
                  padding: 0,
                  color: 'text.secondary',
                }}
              >
                <Container style={styleNotFound}>
                  <Typography variant="h3">
                    {message || 'Nenhum ativo digital encontrado'}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {filters.favorite &&
                      filters.category &&
                      `Nenhum ativo favorito encontrado na categoria selecionada`}
                    {filters.favorite &&
                      !filters.category &&
                      `Você ainda não tem ativos marcados como favoritos`}
                    {!filters.favorite &&
                      filters.category &&
                      `Nenhum ativo encontrado na categoria selecionada`}
                    {filters.new && `Nenhum ativo recente encontrado`}
                  </Typography>
                </Container>
              </Box>
            )
          )
        }
        scrollThreshold="100px"
      >
        <HomeAssets data={dataAssets} idUser={data && data.data.id} />
      </InfiniteScroll>
      <Footer />
    </>
  );
};

export default React.memo(PageHome);
