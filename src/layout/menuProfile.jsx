import React from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import { UserContext } from '../hooks/userContext';
import AvatarMUP from '../components/avatar/avatar';
import Icon from '../components/icon/icon';
import { Link } from 'react-router-dom';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import { STATISTICS_GET } from '../hooks/useFetch';
import { useAlert } from '../hooks/alertContext';
import SkeletonMUP from '../components/skeleton/skeleton';

const MenuProfile = () => {
  const { mode } = useColorScheme();
  const token = window.localStorage.getItem('token');
  const { data, loading, userLogout } = React.useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const [statistics, setStatistics] = React.useState();
  const [statisticsLoading, setStatisticsLoading] = React.useState();
  const showAlert = useAlert();

  React.useEffect(() => {
    setStatisticsLoading(true);
    async function getStatistics() {
      try {
        const { url, options } = STATISTICS_GET(token);
        const response = await fetch(`${url}?user_id=${data.data.id}`, options);
        const json = await response.json();
        setStatistics(json.data);
      } catch (err) {
        showAlert(err.message, 'error');
        setStatisticsLoading(false);
      } finally {
        setStatisticsLoading(false);
      }
    }
    getStatistics();
  }, [data]);

  const percentageStatistc = statistics
    ? (statistics.stats.posts_count / data.data.goal) * 100
    : 0;

  if (data) {
    return (
      <>
        <Tooltip title="Seu perfil">
          <IconButton
            aria-label="Perfil"
            onClick={toggleDrawer(true)}
            sx={{ margin: '0', padding: '0' }}
          >
            <AvatarMUP size={56} emotion="Happy" user={data.data.id} />
          </IconButton>
        </Tooltip>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: 30,
            }}
            className="menu-profile"
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              Perfil
              <IconButton
                onClick={toggleDrawer(false)}
                className="anima-rotate-zoom"
              >
                <Icon icon="close" size={30} stroke={2.5} />
              </IconButton>
            </Typography>

            {statisticsLoading || loading ? (
              <div style={{ overflowY: 'auto', height: 'calc(100vh - 213px)' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <SkeletonMUP
                    variant="circular"
                    width="120px"
                    height="120px"
                  />
                  <SkeletonMUP
                    variant="text"
                    width="200px"
                    style={{ fontSize: '24px', marginTop: '25px' }}
                  />
                  <SkeletonMUP
                    variant="text"
                    width="300px"
                    style={{ fontSize: '16px' }}
                  />
                  <SkeletonMUP
                    width="100%"
                    height="77px"
                    style={{ margin: '25px 0' }}
                  />
                  <SkeletonMUP
                    variant="text"
                    width="200px"
                    style={{ fontSize: '24px' }}
                  />
                  <SkeletonMUP
                    variant="text"
                    width="80px"
                    style={{ fontSize: '16px' }}
                  />
                  <SkeletonMUP
                    variant="circular"
                    width="120px"
                    height="120px"
                    style={{ margin: '10px 0' }}
                  />
                  <SkeletonMUP
                    width="100%"
                    height="77px"
                    style={{ marginTop: '15px' }}
                  />
                </Box>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', height: 'calc(100vh - 213px)' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <AvatarMUP size={120} emotion="Happy" user={data.data.id} />
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ marginTop: '25px', textTransform: 'capitalize' }}
                  >
                    {data.data.name}
                  </Typography>
                  <Link to={`mailto:${data.data.email}`} className="link">
                    {data.data.email}
                  </Link>
                </Box>

                <List className="menu-profile-panel">
                  <ListItem>
                    <ListItemText
                      primary={statistics && statistics.stats.posts_count}
                      secondary="Itens enviados"
                    />
                  </ListItem>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <ListItem>
                    <ListItemText
                      primary={statistics && statistics.stats.favorites_count}
                      secondary="Favoritos"
                    />
                  </ListItem>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <ListItem>
                    <ListItemText
                      primary={statistics && statistics.stats.downloads_count}
                      secondary="Downloads"
                    />
                  </ListItem>
                </List>

                <Box>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      margin: 0,
                    }}
                  >
                    <span style={{ display: 'inline-block', width: 41 }}></span>
                    Itens enviados
                    <Tooltip title="Ver estatísticas">
                      <IconButton>
                        <Icon icon="blank" size={25} stroke={2.3} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Typography
                    variant="small"
                    gutterBottom
                    sx={{
                      textAlign: 'center',
                      display: 'block',
                      width: '100%',
                    }}
                  >
                    {statistics && statistics.stats.posts_count} /{' '}
                    {data.data.goal}
                  </Typography>

                  <Gauge
                    width={150}
                    height={150}
                    value={percentageStatistc.toFixed(0)}
                    cornerRadius="50%"
                    sx={{
                      marginLeft: 'calc(50% - 75px)',
                      [`& .${gaugeClasses.valueText} tspan`]:
                        mode === 'dark'
                          ? {
                              fontSize: 24,
                              fontWeight: '700',
                              fill: 'var(--mui-palette-cyan-main)',
                            }
                          : {
                              fontSize: 24,
                              fontWeight: '700',
                              fill: 'var(--mui-palette-blue-main)',
                            },
                      [`& .${gaugeClasses.valueArc}`]: mode === 'dark' && {
                        fill: 'var(--mui-palette-cyan-main)',
                      },
                      [`& .${gaugeClasses.referenceArc}`]:
                        mode === 'dark'
                          ? {
                              fill: 'var(--mui-palette-black-c300)',
                              stroke: 'var(--mui-palette-background-default)',
                              strokeWidth: '8px',
                            }
                          : {
                              fill: 'var(--mui-palette-white-c200)',
                              stroke: 'var(--mui-palette-background-default)',
                              strokeWidth: '8px',
                            },
                    }}
                    text={({ value }) => `${value}%`}
                  />
                </Box>

                <List className="sent-category">
                  {statistics &&
                    statistics.stats.categories.length > 0 &&
                    statistics.stats.categories.map(
                      ({ category_id, name, post_count, slug }) => (
                        <ListItem
                          key={category_id}
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '15px',
                            alignContent: 'center',
                          }}
                        >
                          <Icon
                            icon={
                              slug === 'ilustracao'
                                ? 'pen'
                                : slug === 'codigo'
                                ? 'code'
                                : slug === 'icone' && 'image'
                            }
                            size={40}
                          />
                          <Typography
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: 'calc(100% - 134px)',
                            }}
                          >
                            <b>{name}</b>
                            <small>{post_count} enviados</small>
                          </Typography>
                          <Link to={`/${slug}`}>
                            <Button size="xsmall" variant="contained">
                              Ver lista
                            </Button>
                          </Link>
                        </ListItem>
                      ),
                    )}
                </List>
              </div>
            )}

            <footer
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '15px',
              }}
            >
              <Button
                size="small"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  padding: '15px',
                  minWidth: '20px',
                  width: '100%',
                  color: 'var(--mui-palette-white-main)',
                }}
                variant="contained"
                color="blue"
              >
                <Icon icon="edit" size={25} stroke={2.5} />
                Editar perfil
              </Button>

              <Button
                size="small"
                variant="contained"
                color="secondary"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  padding: '15px',
                  minWidth: '20px',
                  width: '100%',
                  color: 'var(--mui-palette-white-main)',
                }}
                onClick={userLogout}
              >
                <Icon icon="out" size={25} stroke={2.5} />
                Fazer logout
              </Button>
            </footer>
          </Box>
        </SwipeableDrawer>
      </>
    );
  } else {
    return null;
  }
};

export default MenuProfile;
