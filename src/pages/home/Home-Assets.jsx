import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Icon from '../../components/icon/icon';
import { FAVORITE_PUT, STATISTICS_POST } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';

const HomeAssets = ({ data, idUser }) => {
  const token = window.localStorage.getItem('token');
  const showAlert = useAlert();
  const [favorites, setFavorites] = React.useState({});
  const [statistics, setStatistics] = React.useState({
    idPost: 0,
    statistics: '',
  });

  // Inicializa os favoritos quando os dados chegam
  React.useEffect(() => {
    if (data && Array.isArray(data)) {
      const initialFavorites = {};
      data.forEach((asset) => {
        initialFavorites[asset.id] = asset.favorite === true;
      });
      setFavorites(initialFavorites);
    }
  }, [data]);

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

      // Chama a API para atualizar no servidor
      const { url, options } = FAVORITE_PUT(token, idUser, {
        post_id: id,
        favorite: newFavorite,
      });

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Falha ao atualizar favorito');
      }

      // Confirmação opcional (pode remover se quiser manter apenas a abordagem otimista)
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Erro ao salvar favorito');
      }
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

  return (
    <Container className="page-anima">
      <Grid container spacing={5} style={{ margin: '10px 0' }}>
        {data &&
          data.length > 0 &&
          data
            .filter((item) => item.status === 'publish')
            .map((asset, index) => (
              <Grid
                item
                key={`${index}-${asset.id}`}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <Card elevation={0} className="assets-card">
                  <Box className="btns-actions">
                    <ButtonGroup size="small" variant="contained">
                      <Link
                        to={asset.download}
                        target="_blank"
                        onClick={() =>
                          setStatistics({
                            idPost: asset.id,
                            statistics: 'download',
                          })
                        }
                      >
                        <Button color="success">
                          <Icon icon="download" color="white" size={30} />
                        </Button>
                      </Link>

                      <Button
                        color="red"
                        onClick={() => handleFavorite(asset.id)}
                      >
                        <Icon
                          icon={favorites[asset.id] ? 'heart-filled' : 'heart'}
                          color="white"
                          size={30}
                        />
                      </Button>
                    </ButtonGroup>
                  </Box>

                  <List className="compability">
                    <ListItem>
                      <Tooltip title="Compatibilidades" placement="left">
                        <Icon icon="info" />
                      </Tooltip>
                    </ListItem>
                    {asset.compatibility &&
                      asset.compatibility.length > 0 &&
                      asset.compatibility.length < 6 &&
                      asset.compatibility.map(({ term_id, slug, name }) => (
                        <ListItem key={term_id}>
                          <Tooltip title={name} placement="left">
                            <Icon icon={slug} />
                          </Tooltip>
                        </ListItem>
                      ))}
                    {asset.compatibility && asset.compatibility.length > 1 && (
                      <ListItem>
                        <Tooltip
                          title="Outras compatibilidades"
                          placement="left"
                        >
                          <Icon icon="plus-square" />
                        </Tooltip>
                      </ListItem>
                    )}
                  </List>
                  <Link
                    to={`/ativo/${asset.slug}`}
                    onClick={() =>
                      setStatistics({
                        idPost: asset.id,
                        statistics: 'view',
                      })
                    }
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={asset.thumbnail}
                        alt={`Miniatura do Ativo ${asset.title}`}
                      />
                      <CardContent>
                        <Typography variant="body2">
                          {asset.category && asset.category[0]?.name}
                        </Typography>
                        <Typography variant="h6">
                          {asset.id} - {asset.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Link>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default React.memo(HomeAssets);
