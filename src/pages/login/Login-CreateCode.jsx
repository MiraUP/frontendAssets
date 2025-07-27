import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import HeadConfig from '../../components/headConfig';
import { BaseColors } from '../../theme/theme';
import Icon from '../../components/icon/icon';
import { useAlert } from '../../hooks/alertContext';
import { USER_CODE_PUT } from '../../hooks/useFetch';
import { USER_NEW_CODE } from '../../hooks/useFetch';
import useScreenSize from '../../utils/windowSize';

const PageLoginCreateCode = () => {
  const [codes, setCodes] = React.useState(Array(9).fill(''));
  const inputRefs = React.useRef(Array(9).fill(null));
  const fullCode = codes.join('');
  const token = window.localStorage.getItem('token');
  const userCreate = window.localStorage.getItem('create-user');
  const currentTime = window.localStorage.getItem('code-time');
  const [remainingTime, setRemainingTime] = React.useState(300); // 5 minutos em segundos
  const [timeEnd, setTimeEnd] = React.useState(null);
  const showAlert = useAlert();
  const navigate = useNavigate();
  const { height } = useScreenSize();

  React.useEffect(() => {
    if (!currentTime) return;

    const startTime = parseInt(currentTime, 10);
    setTimeEnd(new Date(startTime + 300000));

    // Cálculo inicial
    const now = new Date().getTime();
    const initialElapsed = Math.floor((now - startTime) / 1000);
    const initialRemaining = Math.max(300 - initialElapsed, 0);
    setRemainingTime(initialRemaining);

    // Usando setInterval para atualizações mais consistentes
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(300 - elapsed, 0);

      setRemainingTime(remaining);

      if (remaining <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentTime]);

  // Formatação do tempo permanece a mesma
  const timeFormat = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const formattedTime = React.useMemo(
    () => timeFormat(remainingTime),
    [remainingTime],
  );

  async function handleNewCode() {
    const { url, options } = USER_NEW_CODE(token);
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      if (data.code && data.message) {
        showAlert(data.message, 'error');
      }
    } else {
      const newCurrentTime = new Date().getTime(); // timestamp em milissegundos
      localStorage.setItem('code-time', newCurrentTime.toString());
      showAlert(data.message, 'success');
    }
  }

  // Função para lidar com colagem de código
  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();

    if (pasteData.length === 9) {
      // Removida a validação de números
      const newCodes = pasteData.split('').slice(0, 9); // Garante apenas 9 caracteres
      setCodes(newCodes);

      // Focar no último campo após colar
      setTimeout(() => {
        if (inputRefs.current[8]) {
          inputRefs.current[8].focus();
        }
      }, 0);
    }
  };

  // Função para lidar com mudanças individuais
  const handleChange = (index, value) => {
    if (value.length <= 1) {
      // Removida a validação de números
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Mover para o próximo campo se digitou um caractere
      if (value.length === 1 && index < 8) {
        inputRefs.current[index + 1].focus();
      }

      // Voltar para o campo anterior se apagou
      if (value.length === 0 && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Função para lidar com teclas de navegação
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Navegação com setas
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    }

    if (e.key === 'ArrowRight' && index < 8) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (fullCode.length === 9) {
      const { url, options } = USER_CODE_PUT(token, {
        code_email: fullCode,
      });
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        if (data.code && data.message) {
          showAlert(data.message, 'error');
        }
      } else {
        window.localStorage.removeItem('create-user');
        navigate('/');
      }
    } else if (fullCode.length === 0) {
      showAlert('Informe o código para ativar sua conta', 'error');
    } else {
      showAlert(
        'O Código está incorreto. Confira novamente o código no e-mail.',
        'error',
      );
    }
  }

  if (height < 598) {
    document.body.classList.add('auto-scroll');
    document.body.style.overflowY = 'auto';
  } else {
    document.body.classList.remove('auto-scroll');
    document.body.style.removeProperty('overflow-y');
  }

  return (
    <>
      {remainingTime > 0 && (
        <form className="page-anima" onSubmit={handleSubmit}>
          <HeadConfig
            title="Código de confirmação"
            description="Página de confirmação de email para nova conta."
            page="code"
          />
          <Box
            sx={{
              padding: '40px 20px',
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
              Bem vindo {userCreate},
            </Typography>

            <div style={{ textAlign: 'center', margin: '20px 0 0 0' }}>
              <Icon icon="ia" size={100} />
            </div>

            <Typography
              variant="body1"
              gutterBottom
              sx={{ textAlign: 'center', padding: '0 40px' }}
            >
              Você recebeu um código de confirmação por email. Informe o código
              em <b>{formattedTime}</b> para <b>Ativar sua conta.</b>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {codes.map((code, index) => (
                <TextField
                  key={`code-${index}`}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  placeholder="#"
                  value={code}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onPaste={(e) => handlePaste(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center' },
                  }}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{
                    width: '40px',
                    '& input': {
                      padding: '8px',
                      textAlign: 'center',
                    },
                  }}
                />
              ))}
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
                Ative sua conta
              </Button>
            </div>
          </Box>
        </form>
      )}
      {remainingTime <= 0 && (
        <form className="page-anima">
          <HeadConfig
            title="Novo código de confirmação"
            description="Página de confirmação de email para nova conta."
            page="code"
          />
          <Box
            sx={{
              padding: '50px 30px',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ textAlign: 'center' }}
            >
              Código expirado!
            </Typography>

            <div style={{ textAlign: 'center', margin: '20px 0 0 0' }}>
              <Icon icon="stopwatch-info" size={100} />
            </div>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ textAlign: 'center', padding: '20px 40px' }}
            >
              O prazo de ativação do código expirou.
              <br />
              Você deve solicitar um novo código.
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color="violet"
                size="small"
                variant="contained"
                style={{
                  width: 'auto',
                  backgroundColor: BaseColors.Violet.c600,
                  color: BaseColors.White.main,
                }}
                onClick={handleNewCode}
              >
                Gerar um novo código
              </Button>
            </div>
          </Box>
        </form>
      )}
    </>
  );
};

export default PageLoginCreateCode;
