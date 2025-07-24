/**
 * Componente controle de pesquisa
 *
 * @package MiraUP
 * @subpackage Search Component
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
import React from 'react';

const SearchContext = React.createContext();

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    category: [],
    compatibility: [],
    origin: [],
    developer: [],
    favoritesOnly: false,
  });
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false) + setSearchQuery('');
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  const updateFilter = React.useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        searchQuery,
        openSearch,
        closeSearch,
        toggleSearch,
        setSearchQuery,
        filters,
        updateFilter,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch deve ser usado dentro de um SearchProvider');
  }
  return context;
};
