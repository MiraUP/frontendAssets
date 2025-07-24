/**
 * Componente de snack de mensagens de feedback
 *
 * @package MiraUP
 * @subpackage Alert Component
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {boolean} open - Estado de abertura do alerta
 * @param {string} message - Mensagem do alerta
 * @param {string} type - Tipo do alerta (success, error, warning, info)
 * @param {function} showAlert - Função para exibir o alerta
 * @param {function} closeAlert - Função para fechar o alerta
 * @param {string} icon - Ícone do alerta
 * @param {ReactNode} children - Elementos filhos do provedor de contexto
 */

import { createContext, useState, useContext } from 'react';
export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    type: 'success',
    icon: null,
  });

  const showAlert = (message, type = 'success', icon = null) => {
    setAlertState({
      open: true,
      message,
      type,
      icon,
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ ...alertState, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context.showAlert;
};
