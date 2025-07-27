/**
 * Componente de Ícone SVG
 *
 * @package MiraUP
 * @subpackage Icons Component
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.3.0
 *
 * @param {string} icon - Nome do ícone (sem extensão)
 * @param {number} size - Tamanho do ícone (em pixels)
 * @param {string} className - Classes adicionais para o ícone
 * @param {number} stroke - Espessura do traço do ícone
 * @param {string} color - Cor do ícone
 * @param {object} props - Props adicionais
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './_icon.module.scss';
import { Skeleton } from '@mui/material';

const FALLBACK_ICON = 'close-circle';

const IconComponent = ({
  icon,
  size = 25,
  className = '',
  stroke = 2,
  color = 'currentColor',
  style,
  ...props
}) => {
  // Componente para ícones SVG
  const ImportedIcon = React.useMemo(() => {
    try {
      const iconComponent = React.lazy(() =>
        import(`../../assets/img/icons/${icon}.svg?react`).catch(() =>
          import(`../../assets/img/icons/${FALLBACK_ICON}.svg?react`),
        ),
      );

      return React.forwardRef(({ id, ...rest }, ref) => {
        const svgRef = React.useRef();

        React.useLayoutEffect(() => {
          if (svgRef.current) {
            // Remove atributos desnecessários
            svgRef.current.removeAttribute('id');

            // Remove elementos defs que podem causar conflitos
            const defsElements = svgRef.current.querySelectorAll('defs');
            defsElements.forEach((def) => def.remove());

            // Aplica classes CSS para controle de cores
            const elements = svgRef.current.querySelectorAll(
              'path, line, g, polygon, circle, polyline, rect, ellipse',
            );

            elements.forEach((el) => {
              // Remove classes específicas do Adobe Illustrator
              if (el.classList.contains('cls-1')) {
                el.classList.remove('cls-1');
                el.classList.add('stroke-path');
              }
              if (el.classList.contains('cls-2')) {
                el.classList.remove('cls-2');
                el.classList.add('filled-path');
              }

              // Aplica cor diretamente se não for currentColor
              if (color !== 'currentColor') {
                // Se o elemento tem stroke, aplica a cor
                if (
                  el.getAttribute('stroke') &&
                  el.getAttribute('stroke') !== 'none'
                ) {
                  el.setAttribute('stroke', color);
                }
                // Se o elemento tem fill, aplica a cor
                if (
                  el.getAttribute('fill') &&
                  el.getAttribute('fill') !== 'none'
                ) {
                  el.setAttribute('fill', color);
                }
                // Se não tem nem stroke nem fill definidos, aplica fill
                if (!el.getAttribute('stroke') && !el.getAttribute('fill')) {
                  el.setAttribute('fill', color);
                }
              }
            });
          }
        }, [color]);

        return React.createElement(iconComponent, {
          ...rest,
          ref: (node) => {
            svgRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          },
          id: undefined,
        });
      });
    } catch (error) {
      console.error(`Ícone SVG "${icon}" e fallback não encontrados:`, error);
      return null;
    }
  }, [icon, color]);

  return (
    <React.Suspense fallback={<LoadingSkeleton size={size} />}>
      {ImportedIcon ? (
        <ImportedIcon
          className={`${styles.icon} ${className}`}
          {...props}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            strokeWidth: `${stroke}px`,
            stroke: color,
            fill: color,
            display: 'inline-block',
            verticalAlign: 'middle',
            ...style,
          }}
        />
      ) : (
        <FallbackIcon
          size={size}
          color={color}
          stroke={stroke}
          className={className}
          style={style}
        />
      )}
    </React.Suspense>
  );
};

const FallbackIcon = ({ size, color, stroke, className, style }) => {
  try {
    const Icon = React.lazy(() =>
      import(`../../assets/img/icons/${FALLBACK_ICON}.svg?react`),
    );

    return (
      <React.Suspense fallback={<LoadingSkeleton size={size} />}>
        <Icon
          className={`${styles.icon} ${className}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            strokeWidth: `${stroke}px`,
            stroke: color,
            fill: color,
            display: 'inline-block',
            verticalAlign: 'middle',
            ...style,
          }}
        />
      </React.Suspense>
    );
  } catch (error) {
    console.error(
      `Ícone de fallback "${FALLBACK_ICON}" não encontrado:`,
      error,
    );
    return <LoadingSkeleton size={size} />;
  }
};

// Componente auxiliar para Skeleton
const LoadingSkeleton = ({ size }) => (
  <Skeleton
    variant="circular"
    animation="wave"
    width={size}
    height={size}
    sx={{ display: 'inline-block', verticalAlign: 'middle' }}
  />
);

IconComponent.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
  stroke: PropTypes.number,
  color: PropTypes.string,
};

IconComponent.defaultProps = {
  size: 25,
  className: '',
  stroke: 1.5,
  color: 'currentColor',
};

export default React.memo(IconComponent);
