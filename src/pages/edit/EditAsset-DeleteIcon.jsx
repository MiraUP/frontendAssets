import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Slide,
} from '@mui/material';
import React from 'react';
import ImageMUP from '../../components/image/image';
import { MEDIA_DELETE } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditAssetDeleteIcon = ({
  idAsset,
  idIcon,
  setIdIcon,
  iconData,
  setIcons,
  setIconSelected,
}) => {
  const token = window.localStorage.getItem('token');
  const [open, setOpen] = React.useState(false);
  const showAlert = useAlert();

  React.useEffect(() => {
    if (idIcon > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [idIcon]);

  const handleClose = () => {
    setOpen(false);
    setIdIcon(0);
  };

  // Remove um ícone existente
  const handleRemoveExistingIcon = async (iconId) => {
    try {
      setIcons((prev) => prev.filter((icon) => icon.id !== iconId));

      const { url, options } = MEDIA_DELETE(token);
      const response = await fetch(
        `${url}?media_type=preview&asset_id=${idAsset}&media_id=${iconId}`,
        options,
      );
      const json = await response.json();

      if (json.success) {
        setIcons((prev) => prev.filter((icon) => icon.id !== iconId));
        showAlert('Ícone removido com sucesso!', 'success');
        setOpen(false);
        setIconSelected(0);
        setIdIcon(0);
      } else {
        console.log(json);
        setOpen(false);
        setIdIcon(0);
        throw new Error('Falha ao remover ícone');
      }
    } catch (err) {
      showAlert(err.message || 'Erro ao remover ícone', 'error');
      setOpen(false);
      setIdIcon(0);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-delete-icon"
      >
        <DialogTitle>Você está excluindo um ícone?</DialogTitle>
        <DialogContent>
          <Grid
            container
            size={12}
            gap={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Grid size="auto">
              <ImageMUP src={iconData?.url} width={80} height={80} />
            </Grid>
            <Grid size="grow">
              <DialogContentText id="alert-dialog-slide-description">
                Você está prestes a excluir o ícone "
                <b>{iconData?.title || 'sem nome'}</b>".
                <br />
                Você confirma essa exclusão?
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="neutral"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleRemoveExistingIcon(idIcon)}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditAssetDeleteIcon;
