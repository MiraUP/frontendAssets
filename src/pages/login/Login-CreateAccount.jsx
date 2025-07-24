import React from 'react';
import { Box, Button, useColorScheme } from '@mui/material';
import HeadConfig from '../../components/headConfig';
import Icon from '../../components/icon/icon';
import InputField from '../../components/inputField/inputField';
import useForm from '../../hooks/useForm';
import { USER_POST } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';
import { UserContext } from '../../hooks/userContext';
import useScreenSize from '../../utils/windowSize';

const PageLoginCreateAccount = () => {
  const name = useForm('');
  const username = useForm('user');
  const email = useForm('email');
  const password = useForm('password');
  const passwordRepeat = useForm('');
  const [passwordSame, setPasswordSame] = React.useState(true);
  const [error, setError] = React.useState('');
  const showAlert = useAlert();
  const { userLogin } = React.useContext(UserContext);
  const { height } = useScreenSize();
  const { mode } = useColorScheme();

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.value !== passwordRepeat.value) {
      setPasswordSame(false);
    } else {
      setPasswordSame(true);
      const { url, options } = USER_POST({
        displayname: name.value,
        username: username.value,
        email: email.value,
        password: password.value,
        role: 'subscriber',
        statusaccount: 'pending',
      });
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        if (data.code && data.message) {
          data.code === 'conflict' && setError(data.message);
          data.code === 'rate_limit_exceeded' &&
            showAlert(data.message, 'error');
          data.code === 'invalid_data' && showAlert(data.message, 'error');
          data.code === 'invalid_file_type' && showAlert(data.message, 'error');
          data.code === 'status_account' &&
            showAlert(
              'Verifique o status da sua conta antes de criar uma nova.',
              'error',
            );
        }
        setError('Erro ao cadastrar usuário');
      }
      if (response.ok) {
        window.localStorage.setItem('create-user', name.value);
        const currentTime = new Date().getTime(); // timestamp em milissegundos
        localStorage.setItem('code-time', currentTime.toString());
        userLogin(username.value, password.value, '/criar-conta/codigo');
      }
    }
  }

  if (height < 632) {
    document.body.classList.add('auto-scroll');
    document.body.style.overflowY = 'auto';
  } else {
    document.body.classList.remove('auto-scroll');
    document.body.style.removeProperty('overflow-y');
  }

  return (
    <div className="page-anima">
      <HeadConfig
        title="Criar conta"
        description="Página para criar uma nova conta"
        page="create"
      />
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            padding: '20px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
          }}
        >
          <InputField
            label="Nome ou apelido"
            color={mode === 'dark' ? 'info' : 'primary'}
            fullWidth
            required
            id="name"
            adornmentStart={<Icon icon="smile" size={25} />}
            {...name}
          />
          <InputField
            label="Usuário"
            color={mode === 'dark' ? 'info' : 'primary'}
            fullWidth
            required
            id="user"
            adornmentStart={<Icon icon="user" size={25} />}
            error={error && 'Usuário ou email já cadastrado.'}
            {...username}
          />
          <InputField
            label="E-mail"
            color={mode === 'dark' ? 'info' : 'primary'}
            fullWidth
            required
            id="email"
            type="email"
            adornmentStart={<Icon icon="user" size={25} />}
            error={error && 'Usuário ou email já cadastrado.'}
            {...email}
          />
          <InputField
            label="Senha"
            color={mode === 'dark' ? 'info' : 'primary'}
            fullWidth
            required
            id="password"
            type="password"
            adornmentStart={<Icon icon="lock" size={25} />}
            {...password}
          />
          <InputField
            label="Repita a Senhas"
            color={mode === 'dark' ? 'info' : 'primary'}
            fullWidth
            required
            id="password-repeat"
            type="password"
            adornmentStart={<Icon icon="lock" size={25} />}
            error={passwordSame === false && 'As senhas não coincidem.'}
            {...passwordRepeat}
          />
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
            Cadastrar
          </Button>
        </footer>
      </form>
    </div>
  );
};

export default PageLoginCreateAccount;
