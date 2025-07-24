import React from 'react';
import { Box, Slider, Stack, Typography } from '@mui/material';
import { useIcon } from '../../hooks/iconContext';

const OpacityCustom = () => {
  const { styleIcon, setStyleIcon } = useIcon();

  const handleParamChange = (param, value) => {
    setStyleIcon((prev) => ({ ...prev, [param]: value }));
  };

  return (
    <Box className="custom-group">
      <Typography component="p" variant="caption">
        Opacidade ({styleIcon.opacity * 100}%)
      </Typography>
      <Stack
        direction="row"
        spacing={0}
        alignItems="center"
        sx={{ width: '100% !important' }}
      >
        <Slider
          color="info"
          aria-label="Opacidade"
          defaultValue={styleIcon.opacity}
          valueLabelDisplay="auto"
          shiftStep={30}
          step={0.1}
          marks
          min={0}
          max={1}
          value={styleIcon.opacity}
          onChange={(e, val) => handleParamChange('opacity', val)}
          sx={{ margin: '0 5px !important', width: 'calc(100% - 10px)' }}
        />
      </Stack>
    </Box>
  );
};

export default OpacityCustom;
