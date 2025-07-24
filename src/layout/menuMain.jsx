import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import Icon from '../components/icon/icon';
import Brand from '../components/brand/brand';
import { Link, useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../hooks/userContext';
import { useAlert } from '../hooks/alertContext';

const MenuMain = () => {
  const { data } = React.useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [openSubmenu, setOpenSubmenu] = React.useState(null);
  const { mode, setMode } = useColorScheme();
  const location = useLocation();
  const firstPathname = location.pathname.split('/')[1];
  const { slug } = useParams();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleClickSubmenu = (menuKey) => (e) => {
    // Previne a navegação se houver submenu
    if (menuKey) {
      e.preventDefault();
    }

    setOpenSubmenu(openSubmenu === menuKey ? null : menuKey);
  };

  const menuItens = [
    { text: 'Início', icon: 'home', link: '/', key: '1' },
    { text: 'Favoritos', icon: 'heart', link: '/favoritos', key: '2' },
    {
      text: 'Notificações',
      icon: 'bell',
      link: '/Notificacoes',
      key: '3',
      submenu: [
        {
          text: 'Todas',
          icon: 'email-notification',
          link: '/Notificacoes/todos',
          key: '3-1',
        },
        {
          text: 'Ativos Digitais',
          icon: 'image',
          link: '/Notificacoes/ativos',
          key: '4',
        },
        {
          text: 'Sinalizadas',
          icon: 'bookmark',
          link: '/notificacoes/sinalizadas',
          key: '5',
        },
        {
          text: 'Curadoria',
          icon: 'file-search',
          link: '/notificacoes/curadoria',
          key: '5-1',
        },
        {
          text: 'Pessoais',
          icon: 'smile',
          link: '/notificacoes/pessoais',
          key: '6',
        },
        {
          text: 'Sistema',
          icon: 'monitor',
          link: '/notificacoes/sistema',
          key: '7',
        },
      ],
    },
    { text: 'Perfil', icon: 'user', link: '/perfil', key: '8' },
    { text: 'Tutoriais', icon: 'subtitles', link: '/tutoriais', key: '9' },
    {
      text: 'Configurações',
      icon: 'settings',
      link: '/configuracoes',
      key: '10',
      submenu: [
        {
          text: 'Categorias',
          icon: 'grid-horizontal',
          link: '/configuracoes/categorias',
          key: '11',
        },
        {
          text: 'Etiquetas',
          icon: 'shopping-tag',
          link: '/configuracoes/etiquetas',
          key: '12',
        },
        {
          text: 'Usuários',
          icon: 'group-user',
          link: '/configuracoes/usuarios',
          key: '13',
        },
        {
          text: 'Sistema',
          icon: 'gear',
          link: '/configuracoes/sistema',
          key: '14',
        },
      ],
    },
  ];

  const ItensList = () => {
    return menuItens.map(({ text, icon, link, submenu, key }) => (
      <React.Fragment key={key}>
        <ListItemButton
          selected={location.pathname === link}
          onClick={submenu ? handleClickSubmenu(key) : toggleDrawer(false)}
          component={submenu ? 'div' : Link}
          to={submenu ? undefined : link}
        >
          <ListItemIcon>{icon && <Icon icon={icon} />}</ListItemIcon>
          <ListItemText primary={text} />
          {submenu &&
            (openSubmenu === key ? (
              <Icon icon="arrow-up-simple" />
            ) : (
              <Icon icon="arrow-down-simple" />
            ))}
        </ListItemButton>

        {link === 'configuracoes' ? null : (
          <Divider
            sx={{
              borderColor:
                mode === 'dark'
                  ? 'var(--mui-palette-black-c700)'
                  : 'var(--mui-palette-white-c300)',
            }}
          />
        )}

        {submenu && (
          <Collapse in={openSubmenu === key} timeout={300} unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                marginLeft: '30px',
                borderLeft:
                  mode === 'dark'
                    ? 'solid 1px var(--mui-palette-black-c700)'
                    : 'solid 1px var(--mui-palette-white-c300)',
              }}
            >
              {submenu.map(({ text, icon, link: subLink, key: subKey }) => (
                <React.Fragment key={subKey}>
                  {text !== 'Curadoria' ? (
                    <ListItemButton
                      component={Link}
                      to={subLink}
                      selected={location.pathname === subLink}
                      onClick={toggleDrawer(false)}
                    >
                      <ListItemIcon>
                        {icon && <Icon icon={icon} />}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  ) : (
                    (data.data.roles[0] === 'administrator' ||
                      data.data.roles[0] === 'editor' ||
                      data.data.roles[0] === 'author' ||
                      data.data.roles[0] === 'contributor') && (
                      <ListItemButton
                        component={Link}
                        to={subLink}
                        selected={location.pathname === subLink}
                        onClick={toggleDrawer(false)}
                      >
                        <ListItemIcon>
                          {icon && <Icon icon={icon} />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    )
                  )}
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  return (
    <>
      <Tooltip title="Menu principal">
        <IconButton
          aria-label="Menu principal"
          sx={{ marginLeft: '-15px' }}
          onClick={toggleDrawer(true)}
        >
          <Icon icon="burger-menu" size={45} />
        </IconButton>
      </Tooltip>
      <SwipeableDrawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: 30,
          }}
          className="menu-main"
        >
          <header
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Brand version="extended" style={{ width: '150px' }} />
            <IconButton
              onClick={toggleDrawer(false)}
              className="anima-rotate-zoom"
            >
              <Icon icon="close" size={30} stroke={2.5} />
            </IconButton>
          </header>

          <List
            component="nav"
            sx={{
              height:
                data.data.roles[0] !== 'subscriber'
                  ? 'calc(100vh - 280px)'
                  : 'calc(100vh - 205px)',
              minHeight: '51px',
              overflowY: 'auto',
            }}
          >
            <ItensList />
          </List>

          <footer
            style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}
          >
            {data.data.roles[0] !== 'subscriber' && (
              <ButtonGroup disableElevation>
                <Button
                  size="small"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    padding: '15px',
                  }}
                  variant="contained"
                  fullWidth
                >
                  <Icon
                    icon="plus-square"
                    size={25}
                    stroke={2.5}
                    color="var(--mui-palette-white-main)"
                  />
                  <Typography
                    as="span"
                    sx={{
                      display: 'inline',
                      color: 'var(--mui-palette-white-main)',
                    }}
                  >
                    Novo Ativo
                  </Typography>
                </Button>
                {firstPathname === 'ativo' && (
                  <Link to={`/editar/${slug}`}>
                    <Button
                      size="small"
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        padding: '15px',
                      }}
                      variant="contained"
                      color="blue"
                      fullWidth
                    >
                      <Icon
                        icon="edit"
                        size={25}
                        color="var(--mui-palette-white-main)"
                      />
                      <Typography
                        as="span"
                        sx={{
                          display: 'inline',
                          color: 'var(--mui-palette-white-main)',
                        }}
                      >
                        Editar Ativo
                      </Typography>
                    </Button>
                  </Link>
                )}
              </ButtonGroup>
            )}

            <ButtonGroup
              variant="contained"
              fullWidth
              aria-label="Tema do sistema"
              disableElevation
            >
              <Tooltip
                title={
                  mode === 'dark'
                    ? 'Modo Escuro ativado'
                    : 'Mudar para Modo Escuro'
                }
              >
                <Button
                  size="xsmall"
                  color="blue"
                  onClick={() => setMode('dark')}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    padding: '10px',
                  }}
                >
                  <Icon
                    icon="moon"
                    size={25}
                    stroke={2.5}
                    color="var(--mui-palette-white-main)"
                  />
                  <Typography
                    as="span"
                    sx={{
                      display: 'inline',
                      color: 'var(--mui-palette-white-main)',
                    }}
                  >
                    Escuro
                  </Typography>
                </Button>
              </Tooltip>
              <Tooltip
                title={
                  mode === 'light'
                    ? 'Modo Claro ativado'
                    : 'Mudar para Modo Claro'
                }
              >
                <Button
                  color="cyan"
                  onClick={() => setMode('light')}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    padding: '10px',
                  }}
                >
                  <Icon
                    icon="brightness-up"
                    size={25}
                    stroke={2.5}
                    color="var(--mui-palette-black-main)"
                  />
                  <Typography
                    as="span"
                    sx={{
                      display: 'inline',
                      color: 'var(--mui-palette-black-main)',
                    }}
                  >
                    Claro
                  </Typography>
                </Button>
              </Tooltip>
            </ButtonGroup>
          </footer>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default MenuMain;
