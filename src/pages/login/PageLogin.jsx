import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useColorScheme } from '@mui/material/styles';
import { Grid, Container, Box, Paper, Button, Divider } from '@mui/material';
import PageLoginBrand from './Login-Brand';
import Footer from '../../layout/footer';
import PageLoginAccessAccount from './Login-Access';
import PageLoginCreateCode from './Login-CreateCode';
import Icon from '../../components/icon/icon';
import PageLoginCreateAccount from './Login-CreateAccount';
import LoginLostPass from './Login-LostPass';
import LoginResetPass from './Login_ResetPass';

const PageLogin = () => {
  const location = useLocation();
  const { mode } = useColorScheme();

  const ContentLogin = () => {
    if (
      location.pathname === '/login' ||
      location.pathname === '/criar-conta' ||
      location.pathname === '/criar-conta/codigo'
    ) {
      return (
        <>
          <nav>
            <Link to="/login">
              <Button
                variant={'contained'}
                color="blue"
                size="large"
                sx={{
                  borderRadius: '0px',
                  backgroundColor:
                    mode === 'light'
                      ? location.pathname === '/login'
                        ? 'var(--mui-palette-white-900)'
                        : 'var(--mui-palette-blue-main)'
                      : 'var(--mui-palette-blue-main)',
                  color:
                    mode === 'light'
                      ? location.pathname === '/login'
                        ? 'var(--mui-palette-black-c900)'
                        : 'var(--mui-palette-white-main)'
                      : 'var(--mui-palette-white-main)',
                }}
              >
                <Icon icon="within" stroke={2.5} />
                Login
              </Button>
            </Link>
            <Link to="/criar-conta">
              <Button
                variant="contained"
                color="violet"
                size="large"
                sx={{
                  borderRadius: '0px 5px 0 0',
                  backgroundColor:
                    mode === 'light'
                      ? location.pathname === '/criar-conta'
                        ? 'var(--mui-palette-white-900)'
                        : 'var(--mui-palette-violet-main)'
                      : 'var(--mui-palette-violet-main)',
                  color:
                    mode === 'light'
                      ? location.pathname === '/criar-conta'
                        ? 'var(--mui-palette-black-c900)'
                        : 'var(--mui-palette-white-main)'
                      : 'var(--mui-palette-white-main)',
                }}
              >
                <Icon icon="at" stroke={2.5} />
                Criar Conta
              </Button>
            </Link>
          </nav>
          <Divider
            sx={{
              width: 'calc(100% + 30px)',
              marginLeft: '-15px',
              color:
                mode === 'light'
                  ? 'var(--mui-palette-white-c300)'
                  : 'var(--mui-palette-cyan-main)',
            }}
          >
            <span className="center"></span>
          </Divider>
          <div className="content">
            {location.pathname === '/login' && <PageLoginAccessAccount />}
            {location.pathname === '/criar-conta' && <PageLoginCreateAccount />}
            {location.pathname === '/criar-conta/codigo' && (
              <PageLoginCreateCode />
            )}
          </div>
        </>
      );
    } else if (location.pathname === '/recuperar-senha') {
      return <LoginLostPass />;
    } else if (location.pathname === '/resetar-senha') {
      return <LoginResetPass />;
    } else {
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <Container
      maxWidth="fullWidth"
      className="gradient gradient-top gradient-background"
    >
      <Grid
        container
        size={12}
        spacing={2}
        className="page-anima"
        sx={{
          minHeight: { xs: 'auto', md: 'calc(100vh - 53px)' },
          boxSizing: 'border-box',
          alignItems: 'center',
          marginBottom: { xs: '50px', md: '0' },
        }}
      >
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            padding: '30px 0',
          }}
        >
          <PageLoginBrand />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            height: '100%',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Box
            sx={{ width: '100%', maxWidth: 500, position: 'relative' }}
            className="page-anima"
          >
            <Paper
              elevation={24}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  mode !== 'light'
                    ? location.pathname === '/login'
                      ? 'var(--mui-palette-blue-main)'
                      : 'var(--mui-palette-secondary-main)'
                    : '',
                border: '2px solid',
                borderColor:
                  mode === 'light'
                    ? location.pathname === '/login'
                      ? 'var(--mui-palette-blue-main)'
                      : 'var(--mui-palette-secondary-main)'
                    : 'transparent',
              }}
              className="login-form"
            >
              <ContentLogin />
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </Container>
  );
};

export default PageLogin;
