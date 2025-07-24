/**
 * Componente de Cabeçalho Dinâmico
 *
 * @package MiraUP
 * @subpackage Head Config Component
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} title - Título da página
 * @param {string} description - Descrição da página
 */
import React from 'react';
import PropTypes from 'prop-types';

const HeadConfig = (props) => {
  React.useEffect(() => {
    if (props.title != undefined) {
      document.title = props.title + ' - MiraUP Ativos Digitais';
      props.page && document.body.removeAttribute('class');
      props.page &&
        document.body.classList.add('page' + props.page.replace(/\s/g, '-'));
    }
    if (props.description != undefined) {
      document
        .querySelector('meta[name="description"]')
        .setAttribute('content', props.description);
    }
  }, [props]);
  return <></>;
};

HeadConfig.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default HeadConfig;
