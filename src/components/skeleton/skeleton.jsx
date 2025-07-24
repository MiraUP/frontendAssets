/**
 * Componente de Skeleton para carregamento de dados
 *
 * @package MiraUP
 * @subpackage Skeleton Component
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.3.0
 *
 * @param {number} num - Quantidade de itens a serem renderizados
 * @param {string} variant - Tipo de variante do Skeleton (ex: 'text', 'rectangular', 'circular', 'rounded')
 * @param {string} animation -  Animação do Skeleton (ex: 'wave', 'pulse', false)
 * @param {string} width - Largura do Skeleton (pode ser em pixels ou porcentagem)
 * @param {string} height - Altura do Skeleton (pode ser em pixels ou porcentagem)
 */

import PropTypes from 'prop-types';
import { Skeleton } from '@mui/material';

function SkeletonMUP({ num = 1, variant, animation, width, height, ...props }) {
  // Cria um array com o número de itens especificado
  const skeletons = Array.from({ length: num }).map((_, index) => (
    <Skeleton
      key={`skeleton-${index}`} // Adiciona uma key única
      sx={{ transform: 'none' }}
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      {...props}
    />
  ));

  return <>{skeletons}</>;
}

SkeletonMUP.propTypes = {
  num: PropTypes.number,
  variant: PropTypes.string,
  animation: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

SkeletonMUP.defaultProps = {
  num: 1,
  variant: 'rounded',
  animation: 'wave',
  width: '50px',
  height: '200px',
};

export default SkeletonMUP;
