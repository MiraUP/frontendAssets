import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import Icon from '../../components/icon/icon';
import { FAVORITE_PUT, STATISTICS_POST } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';
import { ScrollEndMessage, ScrollLoader } from '../loading/messageScroll';
import { UserContext } from '../../hooks/userContext';
import SkeletonMUP from '../../components/skeleton/skeleton';
import Footer from '../../layout/footer';
import { useSearch } from '../../hooks/searchContext';

const SearchResult = ({
  open,
  searchData = [],
  loadMore,
  hasMore,
  isLoading,
  searchQuery,
  message,
}) => {
  const token = window.localStorage.getItem('token');
  const { closeSearch } = useSearch();
  const { data } = React.useContext(UserContext);
  const showAlert = useAlert();
  const [favorites, setFavorites] = React.useState(() => {
    const initialFavorites = {};
    searchData.forEach((item) => {
      initialFavorites[item.id] = item.favorite || false;
    });
    return initialFavorites;
  });
  const [statistics, setStatistics] = React.useState({
    idPost: 0,
    statistics: '',
  });

  // Atualiza os favoritos quando os dados mudam
  React.useEffect(() => {
    const newFavorites = {};
    searchData.forEach((item) => {
      newFavorites[item.id] = item.favorite || false;
    });
    setFavorites(newFavorites);
  }, [searchData]);

  // Função para lidar com o clique no botão de favoritos
  const handleFavorite = async (id) => {
    try {
      const currentFavorite = favorites[id] || false;
      const newFavorite = !currentFavorite;

      // Otimista: atualiza o estado local primeiro
      setFavorites((prev) => ({
        ...prev,
        [id]: newFavorite,
      }));

      const userId = data.id;

      const { url, options } = FAVORITE_PUT(token, userId, {
        post_id: id,
        favorite: newFavorite,
      });

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Falha ao atualizar favorito');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Erro ao salvar favorito');
      }

      showAlert('Favorito atualizado com sucesso!', 'success');
    } catch (err) {
      // Reverte em caso de erro
      setFavorites((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      showAlert(err.message || 'Erro ao atualizar favorito', 'error');
    }
  };

  //Estatísticas
  React.useEffect(() => {
    if (statistics.idPost > 0) {
      async function postStatisticsAssets() {
        try {
          const { url, options } = STATISTICS_POST(token);
          const response = await fetch(
            `${url}?post_id=${statistics.idPost}&&action_type=${statistics.statistics}`,
            options,
          );
          const json = await response.json();
        } catch (err) {
          showAlert(err.message || err, 'error');
        }
      }
      postStatisticsAssets();
    }
  }, [statistics]);

  // Estilo para o container de resultados
  const scrollContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    height: { sm: 'calc(100vh - 105px)' },
  };

  // Item de resultado individual (substitua pelo seu componente)
  const ResultItem = ({ item }) => (
    <Grid
      item
      size={{
        xs: 12,
        sm: open ? 12 : 6,
        md: open ? 6 : 4,
        lg: open ? 6 : 4,
        xl: open ? 4 : 3,
      }}
    >
      <Card elevation={0} className="assets-card">
        <Box className="btns-actions">
          <ButtonGroup size="small" variant="contained">
            <Link
              to={item.download}
              target="_blank"
              onClick={() =>
                setStatistics({
                  idPost: item.id,
                  statistics: 'download',
                })
              }
            >
              <Button color="success">
                <Icon icon="download" color="white" size={30} />
              </Button>
            </Link>

            <Button color="red" onClick={() => handleFavorite(item.id)}>
              <Icon
                icon={favorites[item.id] ? 'heart-filled' : 'heart'} // Alterado para usar o estado favorites
                color="white"
                size={30}
              />
            </Button>
          </ButtonGroup>
        </Box>
        <div
          onClick={() =>
            setStatistics({
              idPost: item.id,
              statistics: 'view',
            })
          }
        >
          <Link to={`/ativo/${item.slug}`} onClick={closeSearch}>
            <CardActionArea>
              <CardMedia
                component="img"
                image={item.thumbnail}
                alt={`Miniatura do Ativo ${item.title}`}
              />
              <CardContent>
                <Typography variant="body2">
                  {item.category && item.category}
                </Typography>
                <Typography variant="h6">{item.title}</Typography>
              </CardContent>
            </CardActionArea>
          </Link>
        </div>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={scrollContainerStyle}
      className={open ? 'search-results filter-open' : 'search-results'}
      id="scrollable"
    >
      <InfiniteScroll
        dataLength={searchData.length}
        next={loadMore}
        hasMore={hasMore && !isLoading} // Adicione esta verificação
        loader={searchQuery.length > 0 && <ScrollLoader />}
        endMessage={
          searchData.length > 0 ? (
            <ScrollEndMessage />
          ) : (
            searchQuery.length > 0 &&
            (message === 'Nenhum ativo encontrado.' ? (
              <Box
                sx={{
                  textAlign: 'center',
                  padding: 4,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6">{message}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Sua busca por "{searchQuery}" não retornou resultados
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: '40px' }}>
                <SkeletonMUP num={3} width="33%" height="285px" />
              </Box>
            ))
          )
        }
        scrollThreshold="100px"
        scrollableTarget="scrollable"
      >
        <Grid container spacing={5}>
          {searchQuery.length > 0
            ? searchData.map((item, index) => (
                <ResultItem key={`${item.id}-${index}`} item={item} />
              ))
            : 'Digite algo na pesquisa'}
        </Grid>
      </InfiniteScroll>
      <Footer />
    </Box>
  );
};

export default React.memo(SearchResult);
