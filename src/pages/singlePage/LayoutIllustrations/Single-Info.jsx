import {
  Grid,
  Box,
  Typography,
  Tooltip,
  List,
  ListItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import React from 'react';
import { UserContext } from '../../../hooks/userContext';
import Icon from '../../../components/icon/icon';
import SingleErrorNotification from '../Single-ErrorNotification';
import Theme from '../../../theme/theme';

const SingleInfo = ({ loading, dataAsset }) => {
  const originalDate = dataAsset.update;
  const { data } = React.useContext(UserContext);
  const [dateBreak] = originalDate.split(' ');
  const [year, month, day] = dateBreak.split('-');
  const formatDate = `${day}/${month}/${year}`;
  const fullScreen = useMediaQuery(Theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container className="content">
        <Box className="compatibility content-group">
          <Typography variant="h4">
            <Icon icon="file-star" size={30} />
            Compatibilidades
          </Typography>
          <Grid
            container
            direction="row"
            sx={{
              marginTop: '40px',
              justifyContent: 'start',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {loading
              ? 'Carregando...'
              : dataAsset && dataAsset.compatibility.length > 0
              ? dataAsset.compatibility.map(({ term_id, slug, name }) => (
                  <Grid key={term_id} item size="auto">
                    <Tooltip title={name}>
                      <Icon icon={slug} size={30} />
                    </Tooltip>
                  </Grid>
                ))
              : 'Não foi informada nenhuma compatibilidade'}
          </Grid>
        </Box>

        <Box className="details content-group">
          <Typography variant="h4">
            <Icon icon="subtitles" size={30} />
            Detalhes
          </Typography>
          <List>
            <ListItem sx={{ flexDirection: 'column', gap: '10px' }}>
              {loading
                ? 'Carregando...'
                : dataAsset && dataAsset.category.length > 0
                ? dataAsset.category.map(({ term_id, name }) => (
                    <Button
                      key={term_id}
                      sx={{
                        gap: '10px',
                        justifyContent: 'start',
                        paddingLeft: '20px',
                        width: 'calc(100% + 40px)',
                        cursor: 'auto',
                      }}
                      variant="contained"
                      color="primary"
                      size="xsmall"
                      disableRipple
                    >
                      <span>Categoria</span> <b>{name}</b>
                    </Button>
                  ))
                : 'Não foi informada nenhuma categoria'}
            </ListItem>

            {loading
              ? 'Carregando...'
              : dataAsset && dataAsset.developer.length > 0
              ? dataAsset.developer.map(({ term_id, name }) => (
                  <ListItem key={term_id} sx={{ gap: '10px' }}>
                    Desenvolvedor <b>{name}</b>
                  </ListItem>
                ))
              : 'Não foi informado nenhum desenvolvedor'}

            {loading
              ? 'Carregando...'
              : dataAsset && dataAsset.origin.length > 0
              ? dataAsset.origin.map(({ term_id, name }) => (
                  <ListItem key={term_id} sx={{ gap: '10px' }}>
                    Origem <b>{name}</b>
                  </ListItem>
                ))
              : 'Não foi informada nenhuma origem'}

            {loading ? (
              'Carregando...'
            ) : dataAsset && dataAsset.update ? (
              <ListItem sx={{ gap: '10px' }}>
                Última Atualização <b>{formatDate}</b>
              </ListItem>
            ) : (
              'Não foi informada nenhuma origem'
            )}

            {loading ? (
              'Carregando...'
            ) : dataAsset && dataAsset.version ? (
              <ListItem sx={{ gap: '10px' }}>
                Versão <b>{dataAsset.version}</b>
              </ListItem>
            ) : (
              'Não foi informada nenhuma origem'
            )}
          </List>
        </Box>

        <Box className="compatibility content-group">
          <Typography variant="h4">
            <Icon icon="info" size={30} />
            Notificar Erro
          </Typography>
          <Typography variant="body1">
            Esse é um canal que você pode informar qualquer falha nesse Ativo.
          </Typography>
          <Typography variant="body1">
            Ex: Link de download quebrado, informações erradas, solicitar de
            remoção, falha em funcionalidades do sistema, etc.
          </Typography>
          <Typography variant="body1">
            Você será notificado quando o problema for solucionado.
          </Typography>
          <Button
            color="error"
            variant="contained"
            fullWidth
            size="small"
            style={{ marginTop: '15px' }}
            onClick={handleClickOpen}
          >
            Solicitar correção
          </Button>
        </Box>
      </Grid>
      <Dialog
        className="notification-error"
        fullScreen={fullScreen}
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="error-notification"
        aria-describedby="error-notification-description"
      >
        <DialogTitle>
          <Grid container>
            <Grid size="grow" alignItems={'center'} display={'flex'}>
              <Typography variant="h3">Notificar erro</Typography>
            </Grid>
            <Grid size="auto">
              <IconButton className="anima-rotate-zoom" onClick={handleClose}>
                <Icon icon="close" size={30} />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent
          dividers={scroll === 'paper'}
          sx={{ paddingTop: '5px !important' }}
        >
          <SingleErrorNotification dataAsset={dataAsset} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SingleInfo;
