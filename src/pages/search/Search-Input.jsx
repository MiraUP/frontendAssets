import {
  Container,
  Divider,
  IconButton,
  InputBase,
  Tooltip,
  useColorScheme,
} from '@mui/material';
import React from 'react';
import Icon from '../../components/icon/icon';
import { useSearch } from '../../hooks/searchContext';

const SearchInput = () => {
  const { mode } = useColorScheme();
  const { closeSearch, searchQuery, setSearchQuery } = useSearch();

  // Efeito para lidar com a tecla ESC
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSearch]);

  return (
    <div
      className="header-gradient"
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        background: 'var(--mui-palette-background-default)',
      }}
    >
      <Container component="header" className="search-input">
        <Icon icon="search" size={60} />
        <InputBase
          placeholder="Pesquise por um título..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />

        <Tooltip title="ESC">
          <IconButton onClick={closeSearch} aria-label="Fechar pesquisa">
            <Icon icon="close" size={50} />
          </IconButton>
        </Tooltip>
      </Container>
      <Divider
        style={{
          borderColor:
            mode === 'dark'
              ? 'var(--mui-palette-black-c700)'
              : 'var(--mui-palette-white-c300)',
        }}
      />
    </div>
  );
};

export default SearchInput;
