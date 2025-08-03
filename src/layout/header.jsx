import React from 'react';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useColorScheme,
  useScrollTrigger,
} from '@mui/material';
import Brand from '../components/brand/brand';
import Icon from '../components/icon/icon';
import { Link, useLocation, useParams } from 'react-router-dom';
import MenuNotification from './menuNotification';
import MenuProfile from './menuProfile';
import MenuMain from './menuMain';
import { useSearch } from '../hooks/searchContext';
import { UserContext } from '../hooks/userContext';

function Header() {
  const location = useLocation();
  const { slug } = useParams();
  const firstPathname = location.pathname.split('/')[1];
  const { mode } = useColorScheme();
  const { data } = React.useContext(UserContext);
  const { openSearch, isSearchOpen } = useSearch();
  const scroll = useScrollTrigger({
    disableHysteresis: true,
    threshold: 1,
  });
  const OS = navigator.platform;

  let systemOS = 'Desconhecido';

  if (OS.indexOf('Win') > -1) {
    systemOS = 'CTRL';
  } else if (OS.indexOf('Mac') > -1) {
    systemOS = <Icon icon="command" size={20} />;
  } else if (OS.indexOf('Linux') > -1) {
    systemOS = 'CTRL';
  }

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, isSearchOpen]);

  return (
    <>
      {location.pathname !== '/' && (
        <div
          className={
            scroll
              ? 'anima-basic header-gradient scroll'
              : 'anima-basic header-gradient'
          }
          style={{
            display: 'block',
            height: '100px',
            width: '100%',
          }}
        />
      )}
      <Container
        maxWidth="full"
        className={`HeaderMain page-anima ${
          scroll
            ? ' header-gradient menu-scroll'
            : location.pathname !== '/'
            ? ''
            : ' header-gradient'
        }`}
        sx={{
          overflow: scroll ? 'visible' : 'hiden',
          background: scroll
            ? 'var(--mui-palette-background-default)'
            : 'transparent',
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{ display: 'flex', flexDirection: 'row' }}
          className="container-header"
        >
          <Grid container spacing={0} sx={{ width: '100%' }}>
            <Grid
              size="auto"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
              }}
            >
              <Link to="/">
                <Box
                  sx={{ display: { xs: 'none', md: 'inline-block' } }}
                  className="brand"
                >
                  <Brand
                    version="signature"
                    className="signature"
                    height="55px"
                  />
                  <Brand
                    version="extended"
                    className="extended"
                    height="50px"
                  />
                </Box>
                <Box sx={{ display: { xs: 'inline-block', md: 'none' } }}>
                  <Brand
                    version="signature"
                    style={{ width: '50px' }}
                    height="55px"
                  />
                </Box>
              </Link>
              <Divider orientation="vertical" variant="middle" flexItem />
              {location.pathname !== '/' && (
                <Tooltip title="Voltar para o início">
                  <Link to="/">
                    <IconButton
                      aria-label="Página inicial"
                      sx={{ marginLeft: '-12px', marginRight: '-15px' }}
                      className="page-anima"
                    >
                      <span style={{ padding: '3px' }}>
                        <Icon icon="home" size={30} />
                      </span>
                    </IconButton>
                  </Link>
                </Tooltip>
              )}
              <MenuMain />
            </Grid>
            <Grid size="grow"></Grid>
            <Grid
              size="auto"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
              }}
            >
              {location.pathname !== '/' && (
                <>
                  <Tooltip title="Pesquisar">
                    <Button
                      size="xsmall"
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                        flexDirection: 'row',
                        gap: 1,
                        padding: '10px 15px 10px 12px',
                        backgroundColor:
                          mode === 'dark'
                            ? 'var(--mui-palette-black-c600)'
                            : 'var(--mui-palette-white-c400)',
                        color: 'var(--mui-palette-text-primary)',
                      }}
                      variant="contained"
                      color="violet"
                      className="btn-new-assets"
                      onClick={openSearch}
                    >
                      <Icon icon="search" size={25} stroke={2.5} />
                      <Typography
                        as="span"
                        sx={{
                          display: {
                            xs: 'none',
                            md: 'inline',
                          },
                          fontSize: '14px',
                        }}
                      >
                        {systemOS} + K
                      </Typography>
                    </Button>
                  </Tooltip>
                  {data.data.roles[0] === 'subscriber' && (
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ display: { xs: 'none', sm: 'flex' } }}
                    />
                  )}
                </>
              )}
              {data.data.roles[0] !== 'subscriber' && (
                <>
                  <ButtonGroup
                    disableElevation
                    variant="contained"
                    size="small"
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                    }}
                  >
                    <Tooltip title="Cadastre um Ativo Digital">
                      <Link to="/novo/ativo">
                        <Button
                          sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'row',
                            gap: 1,
                            padding: '15px',
                            minWidth: '20px',
                            height: '100%',
                          }}
                          className="btn-new-assets"
                        >
                          <Icon icon="plus-square" size={25} stroke={2.5} />
                          <Typography
                            as="span"
                            sx={{
                              display: {
                                xs: 'none',
                                lg: 'inline',
                              },
                            }}
                          >
                            Novo Ativo
                          </Typography>
                        </Button>
                      </Link>
                    </Tooltip>
                    {firstPathname === 'ativo' && (
                      <Tooltip title="Edite esse ativo">
                        <Link to={`/editar/${slug}`}>
                          <Button
                            sx={{
                              display: {
                                xs: 'none',
                                sm: 'flex',
                                padding: '15px',
                              },
                            }}
                          >
                            <Icon icon="edit" />
                          </Button>
                        </Link>
                      </Tooltip>
                    )}
                  </ButtonGroup>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  />
                </>
              )}
              <MenuNotification />
              <MenuProfile />
            </Grid>
          </Grid>
        </AppBar>
      </Container>
    </>
  );
}

export default React.memo(Header);
