/**
 * Componente avatar da identidade da MiraUP
 *
 * @package MiraUP
 * @subpackage Avatar
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} as - Tag de elemento pai
 * @param {string} emotion - Smille no estado padrão
 * @param {string} emoHover - Variação no estado hover
 * @param {string} className - Class adicional ao elemento
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Avatar } from '@mui/material';
import { UserContext } from '../../hooks/userContext';
import { USER_GET, USERS_GET } from '../../hooks/useFetch';
import './_avatar.scss';

const AvatarMUP = ({
  user,
  size = 48,
  className = '',
  emotion = 'Happy',
  ...props
}) => {
  const { data } = React.useContext(UserContext);
  const token = window.localStorage.getItem('token');
  const [dataUsers, setDataUsers] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function getUser() {
      if (user && token) {
        try {
          const { url, options } =
            data.data.roles[0] === 'administrator'
              ? USERS_GET(token)
              : USER_GET(token);

          const response = await fetch(
            data.data.roles[0] === 'administrator'
              ? `${url}/?id-user=${user}`
              : url,
            options,
          );
          if (!response.ok) {
            throw new Error('Erro na requisição');
          }
          const json = await response.json();
          data.data.roles[0] === 'administrator'
            ? setDataUsers(json.data[0])
            : setDataUsers(json.data);
          setLoading(true);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    }

    getUser();
  }, [user, token]);

  const ImportedAvatar = React.useMemo(() => {
    try {
      const AvatarComponent = React.lazy(() =>
        import(`../../assets/img/smilles/Smille-${emotion}.svg?react`),
      );

      return React.forwardRef(({ id, ...rest }, ref) => {
        const svgRef = React.useRef();

        React.useLayoutEffect(() => {
          if (svgRef.current) {
            svgRef.current.removeAttribute('id');
            const defsElements = svgRef.current.querySelectorAll('defs');
            defsElements.forEach((def) => def.remove());

            const elements = svgRef.current.querySelectorAll(
              'path, line, g, polygon, circle, polyline',
            );
            elements.forEach((el) => {
              if (el.classList.contains('cls-1')) {
                el.classList.remove('cls-1');
                el.classList.add('stroke-path');
              }
              if (el.classList.contains('cls-2')) {
                el.classList.remove('cls-2');
                el.classList.add('filled-path');
              }
            });
          }
        }, []);

        return React.createElement(AvatarComponent, {
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
      console.error(`Ícone SVG "${emotion}" não encontrado:`, error);
      return () => <div>Ícone SVG não encontrado</div>;
    }
  }, []);

  if (error) {
    throw new Error('Erro ao buscar o avatar.');
  }
  if (!dataUsers) {
    return (
      <Skeleton
        variant="circular"
        width={size}
        height={size}
        animation="wave"
      />
    );
  } else {
    return loading ? (
      <Skeleton
        variant="circular"
        width={size}
        height={size}
        animation="wave"
      />
    ) : dataUsers.photo ? (
      <Avatar
        alt={
          dataUsers.name ? `Avatar de ${dataUsers.name}` : 'Avatar do usuário'
        }
        src={dataUsers.photo}
        className={className}
        sx={{ width: size + 'px', height: size + 'px' }}
      />
    ) : (
      <div
        className={`avatar ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <ImportedAvatar
          {...props}
          style={{
            width: `75%`,
            height: `75%`,
            display: 'inline-block',
            verticalAlign: 'middle',
            ...props.style,
          }}
        />
      </div>
    );
  }
};

AvatarMUP.propTypes = {
  user: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
  emotion: PropTypes.string,
};

export default AvatarMUP;
