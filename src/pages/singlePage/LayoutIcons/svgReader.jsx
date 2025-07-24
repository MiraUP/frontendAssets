import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useColorScheme,
} from '@mui/material';
import { useIcon } from '../../../hooks/iconContext';
import { BaseColors } from '../../../theme/theme';

const SvgReader = ({ svgUrl }) => {
  const { styleIcon } = useIcon();
  const [svgContent, setSvgContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { mode } = useColorScheme();

  // Função para limpar e preparar o SVG mantendo as classes
  const prepareSvg = (svgString) => {
    if (!svgString) return svgString;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (svgElement) {
      // Remove apenas a tag <defs> mas mantém as classes
      const defs = svgElement.querySelector('defs');
      if (defs) defs.remove();

      // Aplica estilos base
      svgElement.setAttribute('width', `40px`);
      svgElement.setAttribute('height', `40px`);
    }

    return svgElement ? svgElement.outerHTML : svgString;
  };

  // Carrega e prepara o SVG
  React.useEffect(() => {
    if (!svgUrl) return;

    const fetchSvg = async () => {
      setLoading(true);
      try {
        const response = await fetch(svgUrl);
        if (!response.ok) throw new Error('Falha ao carregar SVG');
        const svgText = await response.text();
        setSvgContent(prepareSvg(svgText));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSvg();
  }, [svgUrl]);

  // Aplica modificações ao SVG com classes personalizadas
  const applySvgModifications = (svgString) => {
    if (!svgString) return svgString;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (svgElement) {
      // Processa todos os elementos para aplicar estilos
      const elements = svgElement.querySelectorAll('*');

      elements.forEach((el) => {
        // Remove classes específicas do Adobe Illustrator
        if (el.classList.contains(styleIcon.classStrokePrimary)) {
          el.classList.remove(styleIcon.classStrokePrimary);
          el.classList.add('stroke-path-primary');
          el.setAttribute(
            'stroke',
            mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
          );
          el.setAttribute('fill', 'none');
        }
        if (el.classList.contains(styleIcon.classStrokeSecondary)) {
          el.classList.remove(styleIcon.classStrokeSecondary);
          el.classList.add('stroke-path-secondary');
          el.setAttribute(
            'stroke',
            mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
          );
          el.setAttribute('fill', 'none');
        }
        if (el.classList.contains(styleIcon.classFillPrimary)) {
          el.classList.remove(styleIcon.classFillPrimary);
          el.classList.add('filled-path-primary');
          el.setAttribute(
            'fill',
            mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
          );
          el.setAttribute('stroke', 'none');
        }
        if (el.classList.contains(styleIcon.classFillSecondary)) {
          el.classList.remove(styleIcon.classFillSecondary);
          el.classList.add('stroke-path-secondary');
          el.setAttribute(
            'fill',
            mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
          );
          el.setAttribute('stroke', 'none');
        }
      });
    }

    return svgElement ? svgElement.outerHTML : svgString;
  };

  if (loading)
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">Erro: {error}</Typography>;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
      dangerouslySetInnerHTML={{ __html: applySvgModifications(svgContent) }}
    />
  );
};

export default SvgReader;
