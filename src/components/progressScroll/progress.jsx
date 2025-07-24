import React from 'react';
import {
  LinearProgress,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { BaseColors } from '../../theme/theme';
import './_progress.scss';

export const ProgressScroll = () => {
  const [scrollPercent, setScrollPercent] = React.useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      const windowScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent = (windowScroll / windowHeight) * 100;
      setScrollPercent(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);

    // Limpar o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <LinearProgress variant="determinate" value={scrollPercent} />;
};

export const ProgressCircular = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <svg width={0} height={0}>
        <defs>
          <linearGradient
            id="CircularGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={BaseColors.Cyan.main} />
            <stop offset="100%" stopColor={BaseColors.Blue.main} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ 'svg circle': { stroke: 'url(#CircularGradient)' } }}
      />
      <Typography textAlign="center" sx={{ marginTop: '20px' }}>
        Carregando...
      </Typography>
    </Box>
  );
};
