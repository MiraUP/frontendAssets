/**
 * Componente da Marca
 * @param {string} version - Versão do logo (extended ou signature)
 * @param {boolean} gradient - Modo gradiente ou cor sólida
 * @param {string} className - Class adicional para o logo
 * @param {object} props - Props adicionais para o logo
 */
import React from 'react';
import BrandExtended from './../../assets/img/logo-extended.svg?react';
import BrandSignature from './../../assets/img/logo-signature.svg?react';
import styles from './_brand.module.scss';
import PropTypes from 'prop-types';

const Brand = ({ version, gradient, className = '', ...props }) => {
  let Logo;

  if (version === 'extended') {
    Logo = (
      <BrandExtended
        className={
          gradient
            ? styles.brand + ' ' + className
            : styles.brand + ' ' + styles.colorSolid + ' ' + className
        }
        {...props}
      />
    );
  } else {
    Logo = (
      <BrandSignature
        className={
          gradient
            ? styles.brand + ' ' + className
            : styles.brand + ' ' + styles.colorSolid + ' ' + className
        }
        {...props}
      />
    );
  }

  return <>{Logo}</>;
};

Brand.propTypes = {
  version: PropTypes.string.isRequired,
  gradient: PropTypes.bool,
  className: PropTypes.string,
};

export default Brand;
