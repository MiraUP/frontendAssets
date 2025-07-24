import {
  Box,
  Button,
  ButtonGroup,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { useIcon } from '../../hooks/iconContext';
import Icon from '../icon/icon';

const StrokeWeight = () => {
  const { styleIcon, setStyleIcon } = useIcon();

  const handleParamChange = (param, value) => {
    setStyleIcon((prev) => ({ ...prev, [param]: value }));
  };

  return (
    <>
      <Box className="custom-group">
        <Typography component="p" variant="caption">
          Espessura do traço | {styleIcon.strokeWidth}px
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: '100% !important' }}
        >
          <Slider
            color="info"
            aria-label="Rotação"
            valueLabelDisplay="auto"
            step={0.5}
            marks
            min={0.1}
            max={6}
            value={Number(styleIcon.strokeWidth) || 0}
            onChange={(e, val) => handleParamChange('strokeWidth', val)}
            sx={{ margin: '0 5px !important', width: 'calc(100% - 10px)' }}
          />
        </Stack>
      </Box>

      <Box className="custom-group">
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="start"
          sx={{ width: '100% !important' }}
        >
          <Box>
            <Typography component="p" variant="caption">
              Junção
            </Typography>
            <ButtonGroup disableElevation sx={{ height: '39px' }}>
              <Button
                variant={
                  styleIcon.linejoin === 'round' ? 'contained' : 'outlined'
                }
                size="xsmall"
                color="neutral"
                onClick={() => handleParamChange('linejoin', 'round')}
              >
                <Icon icon="join-round" />
              </Button>
              <Button
                variant={
                  styleIcon.linejoin === 'bevel' ? 'contained' : 'outlined'
                }
                size="xsmall"
                color="neutral"
                onClick={() => handleParamChange('linejoin', 'bevel')}
              >
                <Icon icon="join-bevel" />
              </Button>
              <Button
                variant={
                  styleIcon.linejoin === 'miter' ? 'contained' : 'outlined'
                }
                size="xsmall"
                color="neutral"
                onClick={() => handleParamChange('linejoin', 'miter')}
              >
                <Icon icon="join-miter" />
              </Button>
            </ButtonGroup>
          </Box>
          <Box>
            <Typography component="p" variant="caption">
              Limite de linha
            </Typography>
            <ButtonGroup disableElevation sx={{ height: '39px' }}>
              <Button
                variant={
                  styleIcon.linecap === 'round' ? 'contained' : 'outlined'
                }
                size="xsmall"
                color="neutral"
                onClick={() => handleParamChange('linecap', 'round')}
              >
                <Icon icon="line-cap-round" />
              </Button>
              <Button
                variant={
                  styleIcon.linecap === 'none' ? 'contained' : 'outlined'
                }
                size="xsmall"
                color="neutral"
                onClick={() => handleParamChange('linecap', 'none')}
              >
                <Icon icon="line-cap-none" />
              </Button>
            </ButtonGroup>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default StrokeWeight;
