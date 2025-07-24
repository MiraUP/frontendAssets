import {
  Box,
  Container,
  Drawer,
  Grid,
  Stack,
  useColorScheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import Theme from '../../theme/theme';
import SingleIconFilters from './LayoutIcons/SingleIcon-Filters';
import SingleIconPreview from './LayoutIcons/SingleIcon-Preview';
import SingleIconCustomizer from './LayoutIcons/SingleIcon-Customizer';
import SingleDetails from './Single-Details';
import SingleComments from './Single-Comments';
import Footer from '../../layout/footer';
import SingleIconHeader from './LayoutIcons/SingleIcon-Header';
import { PREVIEWS_GET } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';
import SvgEditor from '../../components/icon/svgEditor';

const SingleLayoutIcon = ({
  loadingAsset,
  dataAsset,
  dataUser,
  toggleFilter,
  setToggleFilter,
  toggleCustomizer,
  setToggleCustomizer,
}) => {
  const token = window.localStorage.getItem('token');
  const contentMainRef = React.useRef(null);
  const [elementHeight, setElementHeight] = React.useState(0);
  const matchDownLg = useMediaQuery(Theme.breakpoints.down('lg'));
  const matchDownMd = useMediaQuery(Theme.breakpoints.down('md'));
  const { mode } = useColorScheme();
  const [previews, setPreviews] = React.useState([]);
  const [dataFilters, setDataFilters] = React.useState([]);
  const [loadingPreviews, setLoadingPreviews] = React.useState(false);
  const showAlert = useAlert();
  const [heightMissing, setHeightMissing] = React.useState(0);
  const [divComments, setDivComments] = React.useState(0);
  const [divDetails, setDivDetails] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    perPage: 60,
    totalItems: 0,
    totalPages: 1,
    hasMore: true,
  });
  const [filters, setFilters] = React.useState({
    categories: [], // Array de slugs de categorias
    styles: [], // Array de slugs de estilos
  });

  // Atualiza a altura disponível para o scroll
  React.useEffect(() => {
    setHeightMissing(divComments + divDetails + 75 + 47);
  }, [divComments, divDetails]);

  // Busca os previews (com paginação e filtros)
  const fetchPreviews = async (page = 1, reset = false) => {
    try {
      const { url, options } = PREVIEWS_GET(token);
      let query = `page=${page}`;

      // Adiciona filtros à query
      if (filters.categories.length > 0) {
        query += `&categories=${filters.categories.join(',')}`;
      }
      if (filters.styles.length > 0) {
        query += `&styles=${filters.styles.join(',')}`;
      }
      if (searchTerm) {
        query += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(`${url}/${dataAsset.id}?${query}`, options);
      const json = await response.json();

      if (json.success) {
        const newPreviews = json.data.previews || [];
        const newFilters = json.data.filters || [];

        setPagination({
          currentPage: json.data.pagination.current_page,
          perPage: json.data.pagination.per_page,
          totalItems: json.data.pagination.total_items,
          totalPages: json.data.pagination.total_pages,
          hasMore:
            json.data.pagination.current_page <
            json.data.pagination.total_pages,
        });

        if (reset || page === 1) {
          setPreviews(newPreviews);
          setDataFilters(newFilters);
        } else {
          setPreviews((prev) => [...prev, ...newPreviews]);
        }
      }
    } catch (error) {
      console.error('Error fetching previews:', error);
      showAlert('Erro ao carregar ícones', 'error');
    }
  };

  // Carrega mais dados para scroll infinito
  const handleFetchMore = () => {
    if (pagination.hasMore) {
      fetchPreviews(pagination.currentPage + 1);
    }
  };

  // Atualiza os filtros e recarrega os dados
  const handleFilterChange = (type, slug) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      // Adiciona ou remove o filtro
      if (type === 'category') {
        newFilters.categories = prev.categories.includes(slug)
          ? prev.categories.filter((c) => c !== slug)
          : [...prev.categories, slug];
      } else if (type === 'style') {
        newFilters.styles = prev.styles.includes(slug)
          ? prev.styles.filter((s) => s !== slug)
          : [...prev.styles, slug];
      }

      return newFilters;
    });
  };

  // Limpa todos os filtros
  const clearFilters = () => {
    setFilters({
      categories: [],
      styles: [],
    });
  };

  // Carrega os dados iniciais e quando os filtros mudam
  React.useEffect(() => {
    setLoadingPreviews(true);
    fetchPreviews(1, true).finally(() => setLoadingPreviews(false));
  }, [dataAsset, filters, searchTerm]); // Recarrega quando asset ou filtros mudam

  // Função para lidar com a busca
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Observador de altura do container
  React.useEffect(() => {
    const updateHeight = () => {
      if (contentMainRef.current) {
        setElementHeight(contentMainRef.current.clientHeight);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentMainRef.current) resizeObserver.observe(contentMainRef.current);
    return () => resizeObserver.disconnect();
  }, [dataAsset, loadingAsset]);

  const BackgroundPreview = {
    width: '100%',
    backgroundColor:
      mode === 'dark'
        ? 'var(--mui-palette-black-c400)'
        : 'var(--mui-palette-white-c700)',
    position: 'absolute',
    height: elementHeight + 300,
    zIndex: -10,
    boxShadow:
      mode === 'dark'
        ? '0 -100px 0 var(--mui-palette-black-c400)'
        : '0 -100px 0 var(--mui-palette-white-c700)',
  };

  return (
    <>
      <div className="bg-preview" style={BackgroundPreview} />
      <Stack
        direction="row"
        spacing={0}
        className="asset-content-main category-icon page-anima"
        ref={contentMainRef}
      >
        {matchDownLg ? (
          <Drawer
            open={toggleFilter}
            onClose={() => setToggleFilter(false)}
            anchor="left"
          >
            <Grid size="auto" minWidth="100%" className="info filters">
              <SingleIconFilters
                toggleFilter={toggleFilter}
                setToggleFilter={setToggleFilter}
                loadingAsset={loadingAsset}
                dataAsset={dataAsset}
                dataFilters={{ filters: dataFilters }}
                loadingPreviews={loadingPreviews}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                activeFilters={filters}
              />
            </Grid>
          </Drawer>
        ) : (
          <Grid
            size="auto"
            className={toggleFilter ? 'info filters' : 'info filters close'}
          >
            <div className="sticky">
              <div
                className="overflow-auto scrollbar-simple"
                style={{ height: `calc(100vh - 100px)` }}
              >
                <div className="scroll-config">
                  <Container>
                    <SingleIconFilters
                      toggleFilter={toggleFilter}
                      setToggleFilter={setToggleFilter}
                      loadingAsset={loadingAsset}
                      dataAsset={dataAsset}
                      dataFilters={{ filters: dataFilters }}
                      loadingPreviews={loadingPreviews}
                      onFilterChange={handleFilterChange}
                      onClearFilters={clearFilters}
                      activeFilters={filters}
                    />
                  </Container>
                </div>
              </div>
            </div>
          </Grid>
        )}
        <Grid size="grow" className="previews">
          <Container gap={5} maxWidth="full">
            <SingleIconHeader
              loading={loadingAsset}
              dataAsset={dataAsset}
              userID={dataUser.id}
              toggleFilter={toggleFilter}
              setToggleFilter={setToggleFilter}
              toggleCustomizer={toggleCustomizer}
              setToggleCustomizer={setToggleCustomizer}
              onSearch={handleSearch}
            />
            <SingleIconPreview
              loading={loadingPreviews}
              previews={previews}
              pagination={pagination}
              fetchMoreData={handleFetchMore}
              heightMissing={heightMissing}
              toggleFilter={toggleFilter}
              toggleCustomizer={toggleCustomizer}
              setToggleCustomizer={setToggleCustomizer}
            />
          </Container>
        </Grid>
        {matchDownMd ? (
          <Drawer
            open={toggleCustomizer}
            onClose={() => setToggleCustomizer(false)}
            anchor="right"
          >
            <Grid
              size="auto"
              minWidth="100%"
              className={
                toggleCustomizer ? 'info customizer' : 'info customizer close'
              }
            >
              <Container>
                <SingleIconCustomizer
                  toggleCustomizer={toggleCustomizer}
                  setToggleCustomizer={setToggleCustomizer}
                  loadingAsset={loadingAsset}
                />
              </Container>
            </Grid>
          </Drawer>
        ) : (
          <Grid
            size="auto"
            className={
              toggleCustomizer ? 'info customizer' : 'info customizer close'
            }
          >
            <SingleIconCustomizer previews={previews} />
          </Grid>
        )}
      </Stack>
      <SingleDetails
        loading={loadingAsset}
        dataAsset={dataAsset}
        setDivDetails={setDivDetails}
      />
      <SingleComments
        loading={loadingAsset}
        dataAsset={dataAsset}
        dataUser={dataUser}
        setDivComments={setDivComments}
      />
      <Footer />
    </>
  );
};

export default SingleLayoutIcon;
