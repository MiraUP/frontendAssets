import {
  Box,
  Button,
  ButtonGroup,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import Icon from '../icon/icon';
import { useIcon } from '../../hooks/iconContext';

const RotationCustom = () => {
  const { styleIcon, setStyleIcon } = useIcon();

  const handleParamChange = (param, value) => {
    // Garante que o valor esteja entre 0 e 360
    let normalizedValue = value;
    if (param === 'rotate') {
      normalizedValue = Math.max(0, Math.min(360, Number(value)));
    }
    setStyleIcon((prev) => ({ ...prev, [param]: normalizedValue }));
  };

  const handleTextFieldChange = (e) => {
    const value = e.target.value;
    // Verifica se é um número válido antes de atualizar
    if (!isNaN(value)) {
      handleParamChange('rotate', value);
    }
  };

  const rotateRight90 = () => {
    const newRotation = (Number(styleIcon.rotate) + 90) % 360;
    handleParamChange('rotate', newRotation);
  };

  return (
    <Box className="custom-group">
      <Typography component="p" variant="caption">
        Rotação
      </Typography>
      <Stack direction="column" spacing={1}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: '100% !important' }}
        >
          <TextField
            variant="outlined"
            size="small"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              max: 360,
              step: 1,
            }}
            value={styleIcon.rotate || 0}
            onChange={handleTextFieldChange}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <Icon icon="angle" size={20} />
                </Box>
              ),
            }}
          />
          <ButtonGroup disableElevation sx={{ height: '39px' }}>
            <Tooltip title="Rotacionar 90° à direita">
              <Button
                variant="contained"
                size="xsmall"
                color="neutral"
                onClick={rotateRight90}
              >
                <Icon icon="rotate" size={20} />
              </Button>
            </Tooltip>
            <Tooltip title="Inverter na horizontal">
              <Button
                variant={styleIcon.horizontalFlip ? 'contained' : 'outlined'}
                size="xsmall"
                color="neutral"
                onClick={() =>
                  handleParamChange('horizontalFlip', !styleIcon.horizontalFlip)
                }
              >
                <Icon icon="flip-horizontal" size={20} />
              </Button>
            </Tooltip>
            <Tooltip title="Inverter na Vertical">
              <Button
                variant={styleIcon.verticalFlip ? 'contained' : 'outlined'}
                size="xsmall"
                color="neutral"
                onClick={() =>
                  handleParamChange('verticalFlip', !styleIcon.verticalFlip)
                }
              >
                <Icon icon="flip-vertical" size={20} />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Stack>
        <Slider
          color="info"
          aria-label="Rotação"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={360}
          value={Number(styleIcon.rotate) || 0}
          onChange={(e, val) => handleParamChange('rotate', val)}
          sx={{ margin: '0 5px !important', width: 'calc(100% - 10px)' }}
        />
      </Stack>
    </Box>
  );
};

export default RotationCustom;
