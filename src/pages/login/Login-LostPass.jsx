import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, useColorScheme } from '@mui/material';
import { BaseColors } from '../../theme/theme';
import InputField from '../../components/inputField/inputField';
import Icon from '../../components/icon/icon';
import HeadConfig from '../../components/headConfig';
import useForm from '../../hooks/useForm';
import { LOST_PASS } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';
import useScreenSize from '../../utils/windowSize';

const LoginLostPass = () => {
  const login = useForm('');
  const [error, setError] = React.useState('');
  const showAlert = useAlert();
  const { height } = useScreenSize();
  const { mode } = useColorScheme();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const { url, options } = LOST_PASS({
      login: login.value,
    });
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      if (data.code && data.message) {
        setError(data.message);
        showAlert(data.message, 'error');
      } else {
        setError('Erro ao recuperar senha');
      }
    } else {
      showAlert('E-mail enviado com sucesso!', 'success');
      login.setValue('');
    }
  };

  if (height < 544) {
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
            padding: '60px 60px 45px 60px',
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
            Recuperar Senha
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ textAlign: 'center' }}
          >
            Primeiro informe abaixo o usuário ou e-mail para iniciar o pedido de
            recuperação de senha.
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ textAlign: 'center' }}
          >
            Você receberá um link de recuperação por e-mail. <br />
            Verifique na caixa de entra, pasta de spam ou na lixeira do seu
            e-mails.
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
              label="Usuário ou e-mail"
              color={mode === 'dark' ? 'info' : 'primary'}
              fullWidth
              required
              id="lostPass"
              adornmentStart={<Icon icon="email" size={25} />}
              {...login}
              error={error && ' '}
            />
          </Box>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              color="violet"
              size="small"
              variant="contained"
              style={{
                width: 'auto',
                backgroundColor: BaseColors.Violet.c600,
                color: BaseColors.White.main,
              }}
            >
              Enviar pedido
            </Button>
          </div>
        </Box>
      </form>
    </>
  );
};

export default LoginLostPass;
