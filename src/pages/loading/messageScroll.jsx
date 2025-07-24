import React from 'react';
import {
  Alert,
  Button,
  Collapse,
  Grid,
  IconButton,
  useColorScheme,
} from '@mui/material';
import Icon from '../../components/icon/icon';

export const ScrollLoader = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <Grid container spacing={5} sx={{ mt: 5 }}>
      <Grid size={12}>
        <Button
          loading
          loadingPosition="start"
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            fontWeight: '400',
            fontSize: '1rem',
            cursor: 'wait !important',
            pointerEvents: 'auto !important',
            background:
              mode === 'dark'
                ? 'var(--mui-palette-black-c400) !important'
                : 'var(--mui-palette-white-c400) !important',
          }}
        >
          Carregando mais...
        </Button>
      </Grid>
    </Grid>
  );
};

export const ScrollEndMessage = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Grid container spacing={5} sx={{ mt: 5 }}>
      <Grid size={12}>
        <Collapse in={open}>
          <Alert
            icon={<Icon icon="check" />}
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Icon icon="close" />
              </IconButton>
            }
          >
            Esses são todos Ativos Digitais cadastrados.
          </Alert>
        </Collapse>
      </Grid>
    </Grid>
  );
};
