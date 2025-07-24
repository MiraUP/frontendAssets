import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import Icon from '../icon/icon';
import { useIcon } from '../../hooks/iconContext';

const SizeCustom = () => {
  const { styleIcon, setStyleIcon } = useIcon();
  const [keepRatio, setKeepRatio] = React.useState(true);
  const [ratio, setRatio] = React.useState(1); // Armazena a proporção original

  // Inicializa a proporção quando o componente monta
  React.useEffect(() => {
    if (styleIcon.width && styleIcon.height) {
      setRatio(styleIcon.width / styleIcon.height);
    }
  }, [styleIcon.width, styleIcon.height]);

  const handleParamChange = (param, value) => {
    value = Number(value);
    if (isNaN(value)) return;

    setStyleIcon((prev) => {
      const newStyle = { ...prev, [param]: value };

      // Se a proporção estiver ativada, ajusta o outro valor
      if (keepRatio) {
        if (param === 'width') {
          newStyle.height = Math.round(value / ratio);
        } else if (param === 'height') {
          newStyle.width = Math.round(value * ratio);
        }
      }

      return newStyle;
    });
  };

  const handleWidthChange = (e) => {
    handleParamChange('width', e.target.value);
  };

  const handleHeightChange = (e) => {
    handleParamChange('height', e.target.value);
  };

  const toggleRatio = () => {
    // Quando ativamos a proporção, calculamos a nova razão com os valores atuais
    if (!keepRatio && styleIcon.width && styleIcon.height) {
      setRatio(styleIcon.width / styleIcon.height);
    }
    setKeepRatio(!keepRatio);
  };

  return (
    <Box className="custom-group">
      <Typography component="p" variant="caption">
        Tamanho ({styleIcon.width}px | {styleIcon.height}px)
      </Typography>
      <Stack
        direction="row"
        spacing={0}
        alignItems="center"
        sx={{ width: '100% !important' }}
      >
        <Tooltip title="Largura">
          <TextField
            variant="outlined"
            size="small"
            type="number"
            fullWidth
            inputProps={{
              min: 1,
              step: 1,
            }}
            value={styleIcon.width || ''}
            onChange={handleWidthChange}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <Icon icon="stretch-width" size={20} />
                </Box>
              ),
            }}
          />
        </Tooltip>
        <Tooltip
          title={keepRatio ? 'Não manter proporção' : 'Manter proporção'}
        >
          <IconButton onClick={toggleRatio}>
            <Icon icon={keepRatio ? 'current' : 'current-broken'} size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Altura">
          <TextField
            variant="outlined"
            size="small"
            type="number"
            fullWidth
            inputProps={{
              min: 1,
              step: 1,
            }}
            value={styleIcon.height || ''}
            onChange={handleHeightChange}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <Icon icon="stretch-height" size={20} />
                </Box>
              ),
            }}
          />
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default SizeCustom;
