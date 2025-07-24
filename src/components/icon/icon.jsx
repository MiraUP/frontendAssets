/**
 * Componente de Ícone Dinâmico
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
 * @param {string} color - Cor padrão para SVG (fill/stroke) e fallback para LordIcon
 * @param {boolean} animate - Se deve animar o ícone
 * @param {string} trigger - Tipo de trigger de animação
 * @param {string} target - Seletor CSS para alvo do trigger
 * @param {string} state - Estado de animação (ex: 'hover-1', 'morph-1')
 * @param {object} colors - Cores específicas para LordIcon
 * @param {object} lottieColors - Cores específicas para Lottie genérico
 * @param {string} delay - Delay para animações (loop, morph, etc.)
 * @param {object} props - Props adicionais
 */

import React from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import styles from './_icon.module.scss';
import { Skeleton } from '@mui/material';

defineElement(lottie.loadAnimation);

// Função utilitária para modificar cores em animações Lottie
const modifyLottieColors = (
  animationData,
  colors,
  fallbackColor = 'currentColor',
) => {
  if (!colors || !animationData || !animationData.layers) return animationData;

  try {
    const modifiedData = JSON.parse(JSON.stringify(animationData));

    const hexToRgba = (hex) => {
      if (!hex || typeof hex !== 'string') return null;
      const hexColor = hex.startsWith('#') ? hex.slice(1) : hex;

      // Valida se é um hex válido (3 ou 6 caracteres)
      if (hexColor.length !== 3 && hexColor.length !== 6) return null;
      if (!/^[0-9A-Fa-f]+$/.test(hexColor)) return null;

      // Expande hex de 3 para 6 caracteres se necessário
      const expanded =
        hexColor.length === 3
          ? hexColor
              .split('')
              .map((c) => c + c)
              .join('')
          : hexColor;

      const r = parseInt(expanded.substring(0, 2), 16) / 255;
      const g = parseInt(expanded.substring(2, 4), 16) / 255;
      const b = parseInt(expanded.substring(4, 6), 16) / 255;
      return [r, g, b, 1];
    };

    // Função para processar efeitos de controle de cor
    const processEffects = (layer) => {
      if (!layer.ef) return;

      layer.ef.forEach((effect) => {
        // Processa Base Color (cor de preenchimento/fundo)
        if (effect.nm === 'Base Color' && effect.ef && effect.ef[0]) {
          const colorToUse = colors.primary || colors.fill || fallbackColor;
          if (colorToUse && colorToUse !== 'currentColor') {
            const rgba = hexToRgba(colorToUse);
            if (rgba) effect.ef[0].v.k = rgba;
          }
        }

        // Processa Highlight (cor de destaque/stroke)
        if (effect.nm === 'Highlight' && effect.ef && effect.ef[0]) {
          const colorToUse = colors.secondary || colors.stroke || fallbackColor;
          if (colorToUse && colorToUse !== 'currentColor') {
            const rgba = hexToRgba(colorToUse);
            if (rgba) effect.ef[0].v.k = rgba;
          }
        }
      });
    };

    const processLayer = (layer) => {
      // Processa efeitos de controle de cor
      processEffects(layer);

      if (!layer.shapes) return;

      layer.shapes.forEach((shape) => {
        if (!shape.it) return;

        shape.it.forEach((item) => {
          if (!item || typeof item !== 'object') return;

          // Modifica stroke - verifica se não tem expressão
          if (item.ty === 'st' && item.c?.k && !item.c.x) {
            const colorToUse =
              colors.secondary || colors.stroke || fallbackColor;
            if (colorToUse && colorToUse !== 'currentColor') {
              const rgba = hexToRgba(colorToUse);
              if (rgba) item.c.k = rgba;
            }
          }

          // Modifica fill - verifica se não tem expressão
          if (item.ty === 'fl' && item.c?.k && !item.c.x) {
            const colorToUse = colors.primary || colors.fill || fallbackColor;
            if (colorToUse && colorToUse !== 'currentColor') {
              const rgba = hexToRgba(colorToUse);
              if (rgba) item.c.k = rgba;
            }
          }

          // Processa grupos aninhados
          if (item.it) {
            item.it.forEach((nestedItem) => {
              if (
                nestedItem.ty === 'st' &&
                nestedItem.c?.k &&
                !nestedItem.c.x
              ) {
                const colorToUse =
                  colors.secondary || colors.stroke || fallbackColor;
                if (colorToUse && colorToUse !== 'currentColor') {
                  const rgba = hexToRgba(colorToUse);
                  if (rgba) nestedItem.c.k = rgba;
                }
              }
              if (
                nestedItem.ty === 'fl' &&
                nestedItem.c?.k &&
                !nestedItem.c.x
              ) {
                const colorToUse =
                  colors.primary || colors.fill || fallbackColor;
                if (colorToUse && colorToUse !== 'currentColor') {
                  const rgba = hexToRgba(colorToUse);
                  if (rgba) nestedItem.c.k = rgba;
                }
              }
            });
          }
        });
      });
    };

    // Processa todas as camadas, incluindo camadas aninhadas
    const processAllLayers = (layers) => {
      layers.forEach((layer) => {
        processLayer(layer);
        if (layer.layers) {
          processAllLayers(layer.layers);
        }
      });
    };

    // Processa assets (composições)
    if (modifiedData.assets) {
      modifiedData.assets.forEach((asset) => {
        if (asset.layers) {
          processAllLayers(asset.layers);
        }
      });
    }

    processAllLayers(modifiedData.layers);
    return modifiedData;
  } catch (error) {
    console.error('Error modifying Lottie colors:', error);
    return animationData;
  }
};

// Função de comparação personalizada para o memo
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.icon === nextProps.icon &&
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    prevProps.stroke === nextProps.stroke &&
    prevProps.color === nextProps.color &&
    prevProps.trigger === nextProps.trigger &&
    prevProps.target === nextProps.target &&
    prevProps.state === nextProps.state &&
    JSON.stringify(prevProps.colors) === JSON.stringify(nextProps.colors) &&
    JSON.stringify(prevProps.lottieColors) ===
      JSON.stringify(nextProps.lottieColors) &&
    prevProps.delay === nextProps.delay
  );
};

const IconComponent = ({
  icon,
  size = 25,
  className = '',
  stroke = 2,
  color = 'currentColor',
  trigger = 'hover',
  target = '',
  state = '',
  colors,
  lottieColors,
  delay = 0,
  style,
  ...props
}) => {
  const iconRef = React.useRef(null);
  const lottieInstance = React.useRef(null);
  const isLottieIcon = typeof icon === 'string' && icon.endsWith('.json');
  const isLordIcon = isLottieIcon && icon.includes('lord-icon');
  const [animationData, setAnimationData] = React.useState(null);
  const [iconLoaded, setIconLoaded] = React.useState(!isLottieIcon);

  // Carrega o JSON do ícone
  React.useEffect(() => {
    if (isLottieIcon && icon) {
      setIconLoaded(false);
      const path = `/src/assets/img/icons/animation/${icon}`;

      const loadAnimation = async () => {
        try {
          const module = await import(/* @vite-ignore */ `${path}?url`);
          const response = await fetch(module.default);
          const data = await response.json();

          if (!data.v || !data.layers) {
            throw new Error('Invalid Lottie JSON');
          }

          if (isLordIcon) {
            setAnimationData(data);
          } else {
            const modifiedData = modifyLottieColors(data, lottieColors, color);
            setAnimationData(modifiedData);
          }
        } catch (error) {
          console.error(`Error loading icon (${icon}):`, error);
          // Fallback: tenta carregar diretamente sem modificar cores
          try {
            const module = await import(/* @vite-ignore */ path);
            setAnimationData(module.default);
          } catch (fallbackError) {
            console.error('Fallback load failed:', fallbackError);
            setIconLoaded(true);
          }
        }
      };

      loadAnimation();
    }
  }, [icon, isLottieIcon, isLordIcon, lottieColors, color]);

  // Configura o LordIcon ou Lottie genérico
  React.useEffect(() => {
    const element = iconRef.current;
    if (!element || !animationData) return;

    // Limpeza anterior
    if (lottieInstance.current) {
      lottieInstance.current.destroy();
      lottieInstance.current = null;
    }

    if (isLordIcon) {
      // Configuração do LordIcon
      const handleReady = () => {
        try {
          if (colors) {
            element.colors = `primary:${colors.primary || color},secondary:${
              colors.secondary || color
            }`;
          } else if (color !== 'currentColor') {
            element.colors = `primary:${color},secondary:${color}`;
          }

          if (state) element.state = state;
          if (delay) element.delay = delay;
          if (target) element.target = target;

          setIconLoaded(true);
        } catch (error) {
          console.error('Error configuring LordIcon:', error);
          setIconLoaded(true);
        }
      };

      element.addEventListener('ready', handleReady);
      element.src = animationData;

      return () => {
        element.removeEventListener('ready', handleReady);
      };
    } else {
      // Configuração do Lottie genérico
      try {
        lottieInstance.current = lottie.loadAnimation({
          container: element,
          renderer: 'svg',
          animationData: animationData,
          autoplay: trigger !== 'hover',
          loop: trigger.includes('loop'),
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
          },
        });

        // Configura triggers
        const handleMouseEnter = () => lottieInstance.current?.play();
        const handleMouseLeave = () => lottieInstance.current?.stop();
        const handleClick = () => lottieInstance.current?.play();

        if (trigger === 'hover') {
          element.addEventListener('mouseenter', handleMouseEnter);
          element.addEventListener('mouseleave', handleMouseLeave);
        } else if (trigger === 'click') {
          element.addEventListener('click', handleClick);
        }

        // Configura target se especificado
        if (target) {
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.addEventListener('mouseenter', handleMouseEnter);
            targetElement.addEventListener('mouseleave', handleMouseLeave);
          }
        }

        setIconLoaded(true);

        return () => {
          if (lottieInstance.current) {
            lottieInstance.current.destroy();
          }
          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);
          element.removeEventListener('click', handleClick);

          if (target) {
            const targetElement = document.querySelector(target);
            if (targetElement) {
              targetElement.removeEventListener('mouseenter', handleMouseEnter);
              targetElement.removeEventListener('mouseleave', handleMouseLeave);
            }
          }
        };
      } catch (error) {
        console.error(`Ícone Lottie não encontrado:`, error);
        setIconLoaded(true);
        return () => <div>Ícone SVG não encontrado</div>;
      }
    }
  }, [animationData, isLordIcon, trigger, target, colors, color, state, delay]);

  const FALLBACK_ICON = 'close-circle';

  // Componente para ícones SVG
  const ImportedIcon = React.useMemo(() => {
    if (isLottieIcon) return null;

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
      // Retorna null para usar o fallback no componente principal
      return null;
    }
  }, [icon, isLottieIcon, color]);

  return (
    <React.Suspense fallback={<LoadingSkeleton size={size} />}>
      {isLottieIcon ? (
        <>
          {!iconLoaded && <LoadingSkeleton size={size} />}
          {isLordIcon ? (
            <lord-icon
              ref={iconRef}
              trigger={trigger}
              target={target}
              class={`${styles.icon} ${className}`}
              stroke={stroke}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                display: iconLoaded ? 'inline-block' : 'none',
                verticalAlign: 'middle',
                ...props.style,
              }}
            />
          ) : (
            <div
              ref={iconRef}
              className={`${styles.icon} ${className}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                display: iconLoaded ? 'inline-block' : 'none',
                verticalAlign: 'middle',
                ...props.style,
              }}
            />
          )}
        </>
      ) : ImportedIcon ? (
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
            ...props.style,
          }}
        />
      ) : (
        // Fallback para quando nem o ícone solicitado nem o fallback são encontrados
        <FallbackIcon
          size={size}
          color={color}
          stroke={stroke}
          className={className}
          style={props.style}
        />
      )}
    </React.Suspense>
  );

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
  trigger: PropTypes.oneOf([
    'hover',
    'click',
    'loop',
    'loop-on-hover',
    'morph',
    'morph-two-way',
    'boomerang',
  ]),
  target: PropTypes.string,
  state: PropTypes.string,
  colors: PropTypes.shape({
    primary: PropTypes.string,
    secondary: PropTypes.string,
  }),
  lottieColors: PropTypes.shape({
    primary: PropTypes.string,
    secondary: PropTypes.string,
    stroke: PropTypes.string,
    fill: PropTypes.string,
  }),
  delay: PropTypes.number,
};

IconComponent.defaultProps = {
  size: 25,
  className: '',
  stroke: 1.5,
  color: 'currentColor',
  trigger: 'hover',
  target: '',
  state: '',
  colors: null,
  lottieColors: null,
  delay: 0,
};

export default React.memo(IconComponent, arePropsEqual);
