import React from 'react';
import { IconProvider, useIcon } from './iconContext';

const LOCAL_STORAGE_KEY = 'iconCustomizerSettings';

const IconLocalStorageManager = ({ children }) => {
  // Função para carregar do LocalStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Erro ao ler do LocalStorage:', error);
    }
    return null;
  };

  // Função para salvar no LocalStorage
  const saveToLocalStorage = (icon, styleIcon) => {
    try {
      const dataToSave = { icon, styleIcon };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erro ao salvar no LocalStorage:', error);
    }
  };

  const savedData = React.useMemo(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao ler do LocalStorage:', error);
      return null;
    }
  }, []);

  return (
    <IconProvider
      initialIcon={savedData?.icon}
      initialStyleIcon={savedData?.styleIcon}
    >
      <IconContextUpdater>{children}</IconContextUpdater>
    </IconProvider>
  );
};

// Componente auxiliar para atualizar o LocalStorage quando o contexto muda
const IconContextUpdater = ({ children }) => {
  const { icon, styleIcon } = useIcon();

  React.useEffect(() => {
    const saveToLocalStorage = () => {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ icon, styleIcon }),
        );
      } catch (error) {
        console.error('Erro ao salvar no LocalStorage:', error);
      }
    };

    saveToLocalStorage();
  }, [icon, styleIcon]);

  return children;
};

export default IconLocalStorageManager;
