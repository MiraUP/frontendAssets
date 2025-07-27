import {
  Badge,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import React from 'react';
import Icon from '../components/icon/icon';
import { BaseColors } from '../theme/theme';
import { NOTIFICATIONS_GET } from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { useAlert } from '../hooks/alertContext';
import SkeletonMUP from '../components/skeleton/skeleton';

const MenuNotification = () => {
  const token = window.localStorage.getItem('token');
  const { mode } = useColorScheme();
  const [dataNotifications, setDataNotifications] = React.useState(null);
  const [loadingNotifications, setLoadingNotifications] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [arrowRef, setArrowRef] = React.useState(null);
  const showAlert = useAlert();

  React.useEffect(() => {
    async function getNotifications() {
      try {
        const { url, options } = NOTIFICATIONS_GET(token);
        const response = await fetch(`${url}`, options);
        const json = await response.json();
        setDataNotifications(json.data);
        setLoadingNotifications(true);
      } catch (err) {
        showAlert(err.message, 'error');
        setLoadingNotifications(false);
      } finally {
        setLoadingNotifications(false);
      }
    }
    getNotifications();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Tooltip title="Você tem novas notificações">
        <IconButton
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          aria-label="Menu de notificações"
          sx={{
            margin: '0 0 0 0px',
          }}
          className="btn-notifications"
        >
          <Badge
            color="success"
            badgeContent={
              dataNotifications && dataNotifications.totals
                ? dataNotifications.totals.unread
                : 0
            }
            invisible={false}
          >
            <Icon icon="bell" size={40} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        disablePortal
        modifiers={[
          {
            name: 'arrow',
            enabled: true,
            options: {
              element: arrowRef,
            },
          },
        ]}
        sx={{
          maxWidth: '400px',
          width: '100%',
        }}
        className="menu-notification"
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'top center',
            }}
          >
            <Paper
              elevation={24}
              sx={{
                bgcolor: 'var(--mui-palette-background-default)',
                backgroundImage: 'none',
                maxWidth: '400px',
                width: '100%',
                padding: '30px',
                maxHeight: 'calc(100vh - 100px)',
              }}
            >
              <div className="arrow" ref={setArrowRef}>
                <span
                  style={{
                    display: 'block',
                    transform:
                      'translateY(-38px) translateX(-11px) rotate(45deg) ',
                    position: 'absolute',
                    borderRadius: '5px 0 0 0',
                    backgroundColor: 'var(--mui-palette-background-default)',
                    width: '20px',
                    height: '20px',
                  }}
                />
              </div>
              <ClickAwayListener onClickAway={handleClose}>
                <Box
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: 0,
                  }}
                >
                  <Typography variant="h3" gutterBottom>
                    {loadingNotifications ? (
                      <SkeletonMUP num={1} width="150px" height="22px" />
                    ) : (
                      'Notificações'
                    )}
                  </Typography>
                  {loadingNotifications ? (
                    <SkeletonMUP num={1} width="100%" height="80px" />
                  ) : (
                    <List className="menu-notification-panel">
                      <ListItem>
                        <ListItemText
                          primary={
                            dataNotifications &&
                            dataNotifications.totals &&
                            dataNotifications.totals.unread
                          }
                          secondary="Não lidas"
                        />
                      </ListItem>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                      <ListItem>
                        <ListItemText
                          primary={
                            dataNotifications &&
                            dataNotifications.totals &&
                            dataNotifications.totals.read
                          }
                          secondary="Lidas"
                        />
                      </ListItem>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                      <ListItem>
                        <ListItemText
                          primary={
                            dataNotifications &&
                            dataNotifications.totals &&
                            dataNotifications.totals.markers.flagged.total
                          }
                          secondary="Sinalizadas"
                        />
                      </ListItem>
                    </List>
                  )}
                  <MenuList
                    onClick={handleClose}
                    className="menu-notification-news"
                    sx={{
                      maxHeight: '300px',
                      height: 'calc(100vh - 379px)',
                      overflowY: 'auto',
                      marginRight: '-25px',
                      paddingRight: '25px',
                    }}
                  >
                    {loadingNotifications ? (
                      <SkeletonMUP num={4} width="100%" height="25%" />
                    ) : dataNotifications && dataNotifications.notifications ? (
                      dataNotifications.notifications.length > 0 &&
                      dataNotifications.notifications.map(
                        ({ id, url_notification, category, title, read }) => (
                          <MenuItem
                            key={id}
                            id={`notifications-${id}`}
                            sx={{ opacity: read ? '.4' : '.8' }}
                          >
                            <Link to={url_notification}>
                              <Badge
                                color="success"
                                variant="dot"
                                invisible={read}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                className="wave"
                              >
                                <Icon
                                  icon={
                                    category.length > 0
                                      ? category[0].name === 'asset'
                                        ? 'brand'
                                        : category[0].name === 'curation'
                                        ? 'search'
                                        : category[0].name === 'error_report'
                                        ? 'alert-triangle'
                                        : category[0].name === 'system'
                                        ? 'bot'
                                        : category[0].name === 'persona'
                                        ? 'user'
                                        : 'monitor'
                                      : 'speak'
                                  }
                                  size={40}
                                  stroke="10px"
                                />
                              </Badge>
                              <Typography>
                                <span>{title}</span>
                                <small>
                                  {category.length > 0
                                    ? category[0].name === 'asset'
                                      ? 'Novidade nesse Ativo'
                                      : category[0].name === 'curation'
                                      ? 'Status da Curadoria'
                                      : category[0].name === 'error_report'
                                      ? 'Erro Reportado'
                                      : category[0].name === 'system'
                                      ? 'Aviso do sistema'
                                      : category[0].name === 'persona'
                                      ? 'user_18986440.json'
                                      : 'Notificação Pessoal'
                                    : 'computer_18996054.json'}
                                </small>
                              </Typography>
                              <Button size="xsmall" variant="contained">
                                Ler...
                              </Button>
                            </Link>
                          </MenuItem>
                        ),
                      )
                    ) : (
                      <>
                        <Typography
                          component="p"
                          variant="h3"
                          align="center"
                          height="100%"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          Tudo certo por aqui!
                          <Typography variant="body1">
                            Nenhum notificação por enquanto.
                          </Typography>
                          <Icon icon="hand-ok" size={100} />
                        </Typography>
                      </>
                    )}
                  </MenuList>
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    sx={{ fontWeight: '600' }}
                  >
                    Todas Notificações
                  </Button>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default MenuNotification;
