/**
 * Componente de Imagem MiraUP
 *
 * @package MiraUP
 * @subpackage Image Component
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.3.0
 *
 * @param {string} component - Componente pai da imagem
 * @param {string} src - URL da imagem
 * @param {boolean} loading - Estado de carregamento da imagem
 * @param {string} styleComponent - Estilo do componente pai da imagem
 * @param {string} colorProgress - Cor do progresso circular da imagem
 * @param {object} props - Props adicionais
 */

import styles from './_image.module.scss';
import { CircularProgress } from '@mui/material';

const ImageMUP = ({
  component,
  src = '',
  loading = false,
  styleComponent = '',
  colorProgress,
  ...props
}) => {
  let ComponentName;
  component === undefined
    ? (ComponentName = 'div')
    : (ComponentName = component);

  return (
    <ComponentName className={styles.imageMUP} style={{ styleComponent }}>
      <div
        className={
          loading
            ? 'loadingImageMUP imageMUP-show'
            : 'loadingImageMUP imageMUP-hidden'
        }
      >
        <CircularProgress color="colorProgress" />
      </div>
      <img src={src} {...props} />
    </ComponentName>
  );
};

export default ImageMUP;
