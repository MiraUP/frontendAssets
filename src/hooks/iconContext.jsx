/**
 * Componente controle de customização de ícones
 *
 * @package MiraUP
 * @subpackage Icon Component
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {number} idIcon - ID de identificação do ícone
 * @param {string} codeIcon - Código SVG, JSON, etc, do ícone
 * @param {string} strokeIcon - Espessura do ícone
 * @param {string} colorsIcon - Cor primária e secundária do ícone (Ex.: primary: '', secondary: '')
 * @param {string} fillIcon - Cor de preenchimento do ícone
 * @param {string} triggerIcon - Configura estado de play do ícone, quando animado (ex.: hover, click, loop, loop-on-hover, morph, morph-two-way, boomerang)
 * @param {string} sizeIcon - Tamanho do ícone
 * @param {string} stateIcon - Estado de animação do ícone, quando houver
 * @param {ReactNode} children - Elementos filhos do provedor de contexto
 */
import React from 'react';
import { BaseColors } from '../theme/theme';
import { useColorScheme } from '@mui/material';

const IconContext = React.createContext();

export const IconProvider = ({ children, initialIcon, initialStyleIcon }) => {
  const { mode } = useColorScheme();
  const [icon, setIcon] = React.useState(
    initialIcon || {
      assets: '',
      style: '',
      idIcon: 0,
      nameFile: '',
    },
  );
  const [codeIcon, setCodeIcon] = React.useState('');
  const [styleIcon, setStyleIcon] = React.useState(
    initialStyleIcon || {
      width: 100,
      height: 100,
      opacity: 1,
      rotate: 0,
      viewBox: 32,
      horizontalFlip: false,
      verticalFlip: false,
      strokeWidth: 2,
      linecap: 'round',
      linejoin: 'round',
      classStrokePrimary: 'cls-1',
      classStrokeSecondary: 'cls-3',
      classFillPrimary: 'cls-2',
      classFillSecondary: 'cls-4',
      colorStrokePrimary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
      colorStrokeSecondary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
      colorFillPrimary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
      colorFillSecondary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
    },
  );
  const [triggerIcon, setTriggerIcon] = React.useState(false);
  const [stateIcon, setStateIcon] = React.useState(false);

  return (
    <IconContext.Provider
      value={{
        icon,
        setIcon,
        codeIcon,
        setCodeIcon,
        triggerIcon,
        setTriggerIcon,
        stateIcon,
        setStateIcon,
        styleIcon,
        setStyleIcon,
      }}
    >
      {children}
    </IconContext.Provider>
  );
};

export const useIcon = () => {
  const context = React.useContext(IconContext);
  if (!context) {
    throw new Error('useIcon deve ser usado dentro de um IconProvider');
  }
  return context;
};
