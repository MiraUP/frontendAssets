import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import React from 'react';
import Icon from '../../components/icon/icon';
import { useAlert } from '../../hooks/alertContext';
import { NOTIFICATION_ERROR } from '../../hooks/useFetch';

const SingleErrorNotification = ({ dataAsset }) => {
  const token = window.localStorage.getItem('token');
  const [errorTypeValue, setErrorTypeValue] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [errorCodeValue, setErrorCodeValue] = React.useState('');
  const [titleValue, setTitleValue] = React.useState('');
  const [detailValue, setDetailValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const showAlert = useAlert();

  // Crie refs apenas para os campos que precisam de foco
  const errorTypeInputRef = React.useRef(null);
  const titleInputRef = React.useRef(null);
  const detailInputRef = React.useRef(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (!errorTypeValue && !inputValue) {
      showAlert('Informe o tipo de erro que identificou.', 'error');
      errorTypeInputRef.current?.focus();
      return;
    }

    if (!titleValue) {
      showAlert('De um título à mensagem que está escrevendo.', 'error');
      titleInputRef.current?.focus();
      return;
    }

    if (!detailValue) {
      showAlert('Descreva o erro que identificou.', 'error');
      detailInputRef.current?.focus();
      return;
    }

    async function postNotificationError() {
      setLoading(true);
      try {
        const { url, options } = NOTIFICATION_ERROR(token, {
          error_type: errorTypeValue || inputValue,
          title: titleValue,
          page: dataAsset.id,
          message: detailValue,
          details: errorCodeValue,
        });
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
          showAlert('Mensagem enviada com sucesso!', 'success');
          setErrorTypeValue('');
          setInputValue('');
          setErrorCodeValue('');
          setTitleValue('');
          setDetailValue('');
        } else {
          showAlert(data.message, 'error');
        }
      } catch (err) {
        showAlert(err.message || err, 'error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    postNotificationError();
  }

  const errorType = [
    { title: 'Link de download inativo' },
    { title: 'Ativo diferente do cadastrado' },
    { title: 'Dados do Ativo incorreto' },
    { title: 'Problema para carregar Ativo' },
    { title: 'Arquivos pendente' },
    { title: 'Erro nos comentários' },
    { title: 'Problemas com a pesquisa' },
    { title: 'Falha ao favoritar um Ativo' },
    { title: 'Problema com os meus dados' },
    { title: 'Erro com as notificações' },
    { title: 'Problemas com funcionalidade do sistema' },
    { title: 'Digite outro problema...' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Grid container gap={3} className="form">
        <Grid size={{ sm: 'grow', xs: 12 }}>
          <Autocomplete
            freeSolo
            disableClearable
            options={errorType.map((option) => option.title)}
            value={errorTypeValue}
            onChange={(event, newValue) => {
              setErrorTypeValue(newValue || '');
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                color="info"
                className="typeError"
                inputRef={errorTypeInputRef}
                {...params}
                label="Informe um tipo de erro *"
              />
            )}
          />
        </Grid>
        <Grid size={{ sm: 'auto', xs: 12 }}>
          <TextField
            fullWidth
            color="info"
            label="Código do erro"
            value={errorCodeValue}
            onChange={(e) => setErrorCodeValue(e.target.value)}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            color="info"
            label="Título para a mensagem de notificação *"
            inputRef={titleInputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="De mais detalhes sobre o erro *"
            multiline
            rows={6}
            fullWidth
            inputRef={detailInputRef}
            value={detailValue}
            onChange={(e) => setDetailValue(e.target.value)}
            color="info"
          />
        </Grid>
      </Grid>

      <footer>
        <Button
          color="error"
          size="small"
          variant="contained"
          type="submit"
          fullWidth
          startIcon={<Icon icon="email" />}
          loading={loading}
        >
          Enviar notificação de erro
        </Button>
      </footer>
    </form>
  );
};

export default SingleErrorNotification;
