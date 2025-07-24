import React, { useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useIcon } from '../../hooks/iconContext';

const SvgEditor = ({ svgUrl }) => {
  const [svgContent, setSvgContent] = React.useState('');
  const { styleIcon, setCodeIcon } = useIcon();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Função para preparar o SVG inicial
  const prepareSvg = useCallback(
    (svgString) => {
      if (!svgString) return svgString;

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (svgElement) {
        // Remove apenas a tag <defs> mas mantém as classes
        const defs = svgElement.querySelector('defs');
        if (defs) defs.remove();

        // Aplica estilos base iniciais
        svgElement.setAttribute('width', `${styleIcon.width}px`);
        svgElement.setAttribute(
          'height',
          `${styleIcon.height > 0 ? styleIcon.height : styleIcon.width}px`,
        );
      }

      return svgElement ? svgElement.outerHTML : svgString;
    },
    [styleIcon.width, styleIcon.height],
  );

  // Função para modificar o SVG (agora memorizada e sem setState)
  const modifySvg = useCallback(
    (svgString) => {
      if (!svgString) return svgString;

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (svgElement) {
        const groupElement = doc.createElementNS(
          'http://www.w3.org/2000/svg',
          'g',
        );

        while (svgElement.firstChild) {
          groupElement.appendChild(svgElement.firstChild);
        }

        groupElement.setAttribute(
          'style',
          `opacity: ${styleIcon.opacity}; transform: rotate(${
            styleIcon.rotate
          }deg)${styleIcon.horizontalFlip ? ' rotateY(180deg)' : ''}${
            styleIcon.verticalFlip ? ' rotateX(180deg)' : ''
          }; transform-origin: center center;`,
        );

        svgElement.appendChild(groupElement);
        svgElement.setAttribute('width', `${styleIcon.width}px`);
        svgElement.setAttribute(
          'height',
          `${styleIcon.height > 0 ? styleIcon.height : styleIcon.width}px`,
        );
        /*svgElement.setAttribute(
        'style',
        `opacity: ${styleIcon.opacity}; transform: rotate(${styleIcon.rotate}deg);`,
      );*/
      }

      return svgElement ? svgElement.outerHTML : svgString;
    },
    [styleIcon],
  );

  // Efeito para atualizar codeIcon quando o SVG é modificado
  useEffect(() => {
    if (svgContent) {
      const modifiedSvg = modifySvg(svgContent);
      setCodeIcon(modifiedSvg);
    }
  }, [svgContent, modifySvg, setCodeIcon]);

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
      // Cria um novo elemento <g> para agrupar todos os filhos
      const groupElement = doc.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      );

      // Move todos os filhos do SVG para o grupo
      while (svgElement.firstChild) {
        groupElement.appendChild(svgElement.firstChild);
      }

      // Aplica transformações no grupo em vez do SVG raiz
      groupElement.setAttribute(
        'style',
        `opacity: ${styleIcon.opacity}; transform: rotate(${
          styleIcon.rotate
        }deg)${styleIcon.horizontalFlip ? ' rotateY(180deg)' : ''}${
          styleIcon.verticalFlip ? ' rotateX(180deg)' : ''
        }; transform-origin: center center;`,
      );

      // Adiciona o grupo de volta ao SVG
      svgElement.appendChild(groupElement);

      // Mantém apenas width/height no SVG raiz
      svgElement.setAttribute('width', `${styleIcon.width}px`);
      svgElement.setAttribute(
        'height',
        `${styleIcon.height > 0 ? styleIcon.height : styleIcon.width}px`,
      );

      // Processa todos os elementos para aplicar estilos (agora dentro do grupo)
      const elements = svgElement.querySelectorAll('*');
      elements.forEach((el) => {
        // Pula o próprio elemento grupo
        if (el === groupElement) return;

        // Aplica stroke-width global se não estiver definido
        if (!el.hasAttribute('stroke-width') && styleIcon.strokeWidth) {
          el.setAttribute('stroke-width', styleIcon.strokeWidth);
        }

        // Aplica linecap e linejoin se não estiverem definidos
        if (!el.hasAttribute('stroke-linecap') && styleIcon.linecap) {
          el.setAttribute('stroke-linecap', styleIcon.linecap);
        }
        if (!el.hasAttribute('stroke-linejoin') && styleIcon.linejoin) {
          el.setAttribute('stroke-linejoin', styleIcon.linejoin);
        }

        // Verifica classes personalizadas para stroke e fill
        if (el.hasAttribute('class')) {
          const classes = el.getAttribute('class').split(' ');

          // Aplica stroke por classe
          if (
            styleIcon.classStrokePrimary &&
            classes.includes(styleIcon.classStrokePrimary)
          ) {
            el.setAttribute('stroke', styleIcon.colorStrokePrimary);
          }
          if (
            styleIcon.classStrokeSecondary &&
            classes.includes(styleIcon.classStrokeSecondary)
          ) {
            el.setAttribute('stroke', styleIcon.colorStrokeSecondary);
          }

          // Aplica fill por classe
          if (
            styleIcon.classFillPrimary &&
            classes.includes(styleIcon.classFillPrimary)
          ) {
            el.setAttribute('fill', styleIcon.colorFillPrimary);
          }
          if (
            styleIcon.classFillSecondary &&
            classes.includes(styleIcon.classFillSecondary)
          ) {
            el.setAttribute('fill', styleIcon.colorFillSecondary);
          }
        }

        // Aplica valores padrão para elementos sem classe específica
        if (
          !el.hasAttribute('stroke') ||
          el.getAttribute('stroke') === 'none'
        ) {
          el.setAttribute('stroke', 'none');
        } else if (
          !el.hasAttribute('class') ||
          (styleIcon.classStrokePrimary &&
            !el.classList.contains(styleIcon.classStrokePrimary)) ||
          (styleIcon.classStrokeSecondary &&
            !el.classList.contains(styleIcon.classStrokeSecondary))
        ) {
          el.setAttribute('stroke', styleIcon.colorStrokePrimary);
        }

        if (!el.hasAttribute('fill') || el.getAttribute('fill') === 'none') {
          el.setAttribute('fill', 'none');
        } else if (
          !el.hasAttribute('class') ||
          (styleIcon.classFillPrimary &&
            !el.classList.contains(styleIcon.classFillPrimary)) ||
          (styleIcon.classFillSecondary &&
            !el.classList.contains(styleIcon.classFillSecondary))
        ) {
          el.setAttribute('fill', styleIcon.colorFillPrimary);
        }
      });
    }

    const finalSvg = svgElement ? svgElement.outerHTML : svgString;
    setCodeIcon(finalSvg);
    return finalSvg;
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

export default SvgEditor;
