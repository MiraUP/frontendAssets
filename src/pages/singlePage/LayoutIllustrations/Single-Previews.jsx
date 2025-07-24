import {
  Box,
  Backdrop,
  Grid,
  Grow,
  ImageList,
  ImageListItem,
  Modal,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import Theme from '../../../theme/theme';

const SinglePreviews = ({ loading, dataAsset, toggleInfo }) => {
  const [openModalId, setOpenModalId] = React.useState(null);
  const handleOpen = (id) => setOpenModalId(id);
  const handleClose = () => setOpenModalId(null);
  const matchDownSm = useMediaQuery(Theme.breakpoints.down('sm'));
  const matchDownMd = useMediaQuery(Theme.breakpoints.down('md'));
  const matchDownLg = useMediaQuery(Theme.breakpoints.down('lg'));
  const matchDownXl = useMediaQuery(Theme.breakpoints.down('xl'));

  const style = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100vh !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  };

  const imageStyle = {
    height: '90vh',
    maxWidth: '90%',
    objectFit: 'contain',
    cursor: 'pointer',
    borderRadius: '10px',
  };

  return (
    <Grid container>
      <ImageList
        variant="quilted"
        gap={10}
        cols={
          !matchDownXl
            ? toggleInfo
              ? 3
              : 4
            : !matchDownLg
            ? toggleInfo
              ? 2
              : 3
            : !matchDownMd
            ? toggleInfo
              ? 2
              : 2
            : !matchDownSm
            ? toggleInfo
              ? 1
              : 2
            : 1
        }
      >
        {loading
          ? 'Carregando...'
          : dataAsset && dataAsset.previews.length > 0
          ? dataAsset.previews.map(({ id, title, url }) => (
              <React.Fragment key={id}>
                <ImageListItem onClick={() => handleOpen(id)}>
                  <img
                    src={url}
                    alt={title}
                    loading="lazy"
                    style={{ cursor: 'pointer', borderRadius: '5px' }}
                  />
                </ImageListItem>

                <Modal
                  open={openModalId === id}
                  onClose={handleClose}
                  aria-labelledby={`modal-${id}-title`}
                  aria-describedby={`modal-${id}-description`}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                >
                  <Grow in={openModalId === id}>
                    <Box
                      sx={style}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                      }}
                    >
                      <img
                        src={url}
                        alt={title}
                        style={imageStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClose();
                        }}
                      />
                    </Box>
                  </Grow>
                </Modal>
              </React.Fragment>
            ))
          : 'Nenhuma imagem de pré-visualização foi cadastrada.'}
      </ImageList>
    </Grid>
  );
};

export default SinglePreviews;
