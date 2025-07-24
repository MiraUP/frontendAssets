import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import InputField from '../../components/inputField/inputField';
import Icon from '../../components/icon/icon';
import HeadConfig from '../../components/headConfig';
import useForm from '../../hooks/useForm';
import { RESET_PASS } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';
import useScreenSize from '../../utils/windowSize';

const LoginResetPass = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = React.useState('');
  const [key, setKey] = React.useState('');
  const password = useForm('password');
  const passwordRepeat = useForm('password');
  const [error, setError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const showAlert = useAlert();
  const { height } = useScreenSize();

  // Recupera o login e a chave da URL
  React.useEffect(() => {
    const loginParam = searchParams.get('login');
    const keyParam = searchParams.get('key');

    if (loginParam && keyParam) {
      setUser(loginParam);
      setKey(keyParam);
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPasswordError('');
    if (password.value !== passwordRepeat.value) {
      setPasswordError(true);
      showAlert('As senhas não coincidem.', 'error');
      return false;
    }

    const { url, options } = RESET_PASS({
      login: user,
      key,
      password: password.value,
      password_repeat: passwordRepeat.value,
    });
    const response = await fetch(url, options);
    console.log(response);
    const data = await response.json();
    if (!response.ok) {
      if (data.code && data.message) {
        setError(data.message);
        showAlert(data.message, 'error');
      } else {
        setError('Erro ao recuperar senha');
      }
    } else {
      showAlert('Senha alterada com sucesso!', 'success');
    }
  };

  const handleKeyDown = (e) => {
    // Bloqueia Ctrl+C, Ctrl+A, etc.
    if (e.ctrlKey && ['c', 'a', 'x', 'v'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };

  if (height < 728) {
    document.body.classList.add('auto-scroll');
    document.body.style.overflowY = 'auto';
  } else {
    document.body.classList.remove('auto-scroll');
    document.body.style.removeProperty('overflow-y');
  }

  return (
    <>
      <Link
        to="/login"
        style={{
          textDecoration: 'none',
          position: 'absolute',
          zIndex: 10000,
          top: '-20px',
          left: '-20px',
          display: 'block',
        }}
      >
        <Button
          variant="contained"
          color="success"
          size="small"
          sx={{
            padding: '10px',
            margin: '0',
            minWidth: '0',
          }}
        >
          <Icon icon="arrow-left" size={40} />
        </Button>
      </Link>
      <form className="page-anima" onSubmit={handleSubmit}>
        <HeadConfig
          title="Recuperar Senha"
          description="Página para recuperar a senha da conta"
          page="lost-pass"
        />
        <Box
          sx={{
            padding: '60px 60px 30px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ textAlign: 'center' }}
          >
            Resetar Senha
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ textAlign: 'center' }}
          >
            Sua nova senha deve conter pelo menos 8 dígitos incluindo números,
            símbolos, letras minúsculas e maiúsculas.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <InputField
              label="Nome de usuário"
              fullWidth
              required
              disabled={true}
              id="user"
              adornmentStart={<Icon icon="user" size={25} />}
              value={user}
              readOnly
              aria-readonly="true"
              onKeyDown={handleKeyDown}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onChange={(e) => setUser(e.target.value)}
            />
            <InputField
              fullWidth
              required
              disabled={true}
              id="code"
              adornmentStart={<Icon icon="barcode" size={25} />}
              value={key}
              readOnly
              aria-readonly="true"
              onKeyDown={handleKeyDown}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onChange={(e) => setKey(e.target.value)}
            />
            <InputField
              label="Nova Senha"
              type="password"
              fullWidth
              required
              id="password"
              adornmentStart={<Icon icon="lock" size={25} />}
              snackbar
              errorHandler={passwordError}
              {...password}
            />
            <InputField
              label="Repita a senha"
              type="password"
              fullWidth
              required
              id="passwordRepeat"
              adornmentStart={<Icon icon="lock" size={25} />}
              snackbar={true}
              errorHandler={passwordError}
              {...passwordRepeat}
            />
          </Box>
        </Box>
        <footer>
          <Button
            variant="contained"
            color="blue"
            size="medium"
            type="submit"
            fullWidth
            sx={{
              borderRadius: '0 0 5px 5px',
              color: 'var(--mui-palette-white-main)',
              backgroundColor: 'var(--mui-palette-violet-c600)',
            }}
          >
            Salvar nova senha
          </Button>
        </footer>
      </form>
    </>
  );
};

export default LoginResetPass;
