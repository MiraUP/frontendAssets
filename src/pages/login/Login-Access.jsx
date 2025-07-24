import React from 'react';
import {
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
  useColorScheme,
} from '@mui/material';
import useForm from '../../hooks/useForm';
import HeadConfig from '../../components/headConfig';
import Icon from '../../components/icon/icon';
import InputField from '../../components/inputField/inputField';
import { Link } from 'react-router-dom';
import { UserContext } from '../../hooks/userContext';
import useScreenSize from '../../utils/windowSize';

const PageLoginAccessAccount = () => {
  const { mode } = useColorScheme();
  const username = useForm();
  const password = useForm();
  const { userLogin, data, userLogout, error, loading } =
    React.useContext(UserContext);
  const { height } = useScreenSize();

  async function handleSubmit(event) {
    event.preventDefault();

    if (username.validate() && password.validate()) {
      userLogin(username.value, password.value);
      username.setValue('');
      password.setValue('');
    }
  }

  if (height < 588) {
    document.body.classList.add('auto-scroll');
    document.body.style.overflowY = 'auto';
  } else {
    document.body.classList.remove('auto-scroll');
    document.body.style.removeProperty('overflow-y');
  }

  return (
    <form onSubmit={handleSubmit} className="page-anima">
      <HeadConfig title="Login" description="Página de Login" page="login" />
      {data && data.data.name ? (
        <>
          <Box
            sx={{
              padding: '40px 60px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ textAlign: 'center', paddingTop: '20px' }}
            >
              Bem vindo(a) {data.data.name}!
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ textAlign: 'center', padding: '0 40px' }}
            >
              Pretende mudar de conta?
            </Typography>
          </Box>
          <footer>
            <Button
              variant="contained"
              component="span"
              color="blue"
              size="medium"
              fullWidth
              sx={{
                borderRadius: '0 0 5px 5px',
                color: 'var(--mui-palette-white-main)',
                backgroundColor: 'var(--mui-palette-blue-c600)',
              }}
              onClick={userLogout}
            >
              Sair da sessão
            </Button>
          </footer>
        </>
      ) : (
        <>
          <Box
            sx={{
              padding: '40px 60px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <InputField
              label="Usuário ou e-mail"
              color={mode === 'dark' ? 'cyan' : 'blue'}
              fullWidth
              required
              id="user"
              adornmentStart={<Icon icon="user" size={25} />}
              {...username}
              error={error && ' '}
            />
            <InputField
              label="Senha"
              fullWidth
              required
              color={mode === 'dark' ? 'cyan' : 'blue'}
              id="password"
              type="password"
              adornmentStart={<Icon icon="lock" size={25} />}
              {...password}
              snackbar
              error={
                error &&
                error === 'Error: Forbidden' &&
                'Usuário ou senha inválido.'
              }
            />
            <FormGroup>
              <FormControlLabel
                control={<Checkbox color="success" />}
                label="Lembrar de mim"
              />
            </FormGroup>
          </Box>
          <footer sx={{ position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              color="blue"
              size="medium"
              fullWidth
              sx={{
                borderRadius: '0 0 5px 5px',
                color: 'var(--mui-palette-white-main)',
                backgroundColor: 'var(--mui-palette-blue-c600)',
              }}
              disabled={loading}
              loading={loading}
              loadingIndicator={
                <CircularProgress
                  sx={{ color: 'var(--mui-palette-root-white-a900)' }}
                />
              }
            >
              Entrar
            </Button>
            <Link className="link lost-password" to="/recuperar-senha">
              <Icon icon="question" size={25} /> Esqueci minha senha
            </Link>
          </footer>
        </>
      )}
    </form>
  );
};

export default PageLoginAccessAccount;
