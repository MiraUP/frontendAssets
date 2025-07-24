/**
 * Componente de Input TextField e Select
 *
 * @package MiraUP
 * @subpackage TextField Select Component
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} label - Descrição do campo
 * @param {string} color - Cor do campo (secondary, success, error, info, blue, cyan, black, white)
 * @param {string} id - ID do campo
 * @param {string} type - Tipo do campo (text, password, select, etc)
 * @param {boolean} required - Campo obrigatório
 * @param {string} defaultValue - Valor padrão do campo
 * @param {string} variant - Variante do campo (standard ou outlined)
 * @param {boolean} disabled - Campo desabilitado
 * @param {boolean} fullWidth - Campo ocupa toda a largura
 * @param {boolean} error - Campo com erro
 * @param {boolean} errorHandler - Marca o campo como erro manualmente
 * @param {string} helperText - Mensagem de ajuda ou erro
 * @param {number} margin - Margem do campo
 * @param {string} adornmentStart - Adorno no início do campo
 * @param {string} adornmentEnd - Adorno no final do campo
 * @param {array} options - Opções para o campo select ( [{label: 'Opção 1', value: '1'}] )
 * @param {number} limitTags - Limite de tags para o campo select
 * @param {boolean} multiple - Campo select com múltiplas seleções
 * @param {boolean} snackbar - Ativar função de SnackBar
 */

import React from 'react';
import {
  FormControl,
  InputAdornment,
  TextField,
  Autocomplete,
  FormHelperText,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import './_inputField.scss';
import Icon from '../icon/icon';
import PropTypes from 'prop-types';
import { useAlert } from '../../hooks/alertContext';

const InputField = ({
  label,
  color,
  id,
  type,
  required,
  defaultValue,
  variant,
  disabled,
  fullWidth,
  error,
  errorHandler,
  helperText,
  margin,
  adornmentStart,
  adornmentEnd,
  options,
  limitTags,
  multiple,
  value,
  onChange,
  onBlur,
  snackbar,
  ...props
}) => {
  const [passwordAction, setPasswordAction] = React.useState(true);
  const showAlert = useAlert();

  const handleError = () => {
    if (error && snackbar) {
      showAlert(error, 'error');
    }
  };

  React.useEffect(() => {
    handleError();
  }, [error]);

  let classError;
  let classDisabled;
  let fieldError;
  error || errorHandler ? (classError = ' error') : (classError = '');
  error || errorHandler ? (fieldError = true) : (fieldError = false);
  color ? (color = color) : (color = '');
  id = id || '';
  label = label || '';
  required = required || false;
  defaultValue = defaultValue || '';
  variant = variant || 'standard';
  disabled = disabled || false;
  disabled ? (classDisabled = ' disabled') : (classDisabled = '');
  fullWidth = fullWidth || false;
  helperText = helperText || '';
  margin = margin || 0;
  type = type || 'text';
  limitTags = limitTags || 2;
  multiple = multiple || false;
  adornmentStart
    ? (adornmentStart = (
        <InputAdornment position="start">{adornmentStart}</InputAdornment>
      ))
    : (adornmentStart = '');
  snackbar = snackbar || false;

  type === 'password'
    ? (adornmentEnd = (
        <InputAdornment position="end">
          <IconButton onClick={() => setPasswordAction(!passwordAction)}>
            <Icon icon={passwordAction ? 'eye' : 'eye-close'} size={35} />
          </IconButton>
        </InputAdornment>
      ))
    : (adornmentEnd = adornmentEnd);

  let styleStandard = {
    '&.MuiInputLabel-root': {
      transform: 'translate(35px, 20px) scale(1)',
    },
    '&.MuiInputLabel-root.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(0, -1.5px) scale(0.75)',
    },
  };

  variant === 'standard' && adornmentStart
    ? styleStandard
    : (styleStandard = {});

  const className = classError + classDisabled + color;

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        minHeight: '77px',
      }}
    >
      <FormControl
        fullWidth={fullWidth}
        className={className}
        sx={{ margin: margin + 'rem 0' }}
      >
        {type != 'select' ? (
          <>
            <TextField
              {...props}
              id={id}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              color={color}
              required={required}
              name={id}
              label={label}
              variant={variant}
              error={fieldError}
              type={
                type === 'password'
                  ? passwordAction
                    ? 'password'
                    : 'text'
                  : type
              }
              disabled={disabled}
              fullWidth={fullWidth}
              slotProps={{
                input: {
                  startAdornment: adornmentStart,
                  endAdornment: adornmentEnd,
                },
                inputLabel: {
                  sx: {
                    ...styleStandard,
                  },
                },
              }}
            />
          </>
        ) : (
          <>
            <Autocomplete
              {...props}
              disablePortal
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              options={options}
              disabled={disabled}
              multiple={multiple}
              limitTags={limitTags}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id={id}
                  name={id}
                  fullWidth={fullWidth}
                  error={fieldError}
                  label={label}
                  color={color}
                  required={required}
                />
              )}
            />
          </>
        )}
        <FormHelperText
          id={'-mensage-helper-text' + id}
          sx={{ minHeight: '19px' }}
        >
          {error ? snackbar === false && error : helperText ? helperText : ''}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  errorHandler: PropTypes.bool,
  error: PropTypes.bool,
  errorDefault: PropTypes.bool,
  helperText: PropTypes.string,
  margin: PropTypes.number,
  adornmentStart: PropTypes.string,
  adornmentEnd: PropTypes.string,
  options: PropTypes.array,
  limitTags: PropTypes.number,
  multiple: PropTypes.bool,
  snackbar: PropTypes.bool,
};

export default InputField;
