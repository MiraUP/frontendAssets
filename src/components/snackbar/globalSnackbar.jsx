// src/components/GlobalSnackbar.js
import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { AlertContext } from '../../hooks/alertContext';

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const GlobalSnackbar = () => {
  const { open, message, type, icon, closeAlert } =
    React.useContext(AlertContext);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeAlert();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ maxWidth: '600px' }}
    >
      <Alert
        severity={type}
        variant="filled"
        onClose={handleClose}
        icon={icon}
        sx={{ width: '100%', alignItems: 'center' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
