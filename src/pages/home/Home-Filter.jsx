import React, { useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Icon from '../../components/icon/icon';

const HomeFilter = ({ onFilterChange, currentFilters }) => {
  const [selectedFilters, setSelectedFilters] = React.useState({
    all: true,
    news: false,
    favorites: false,
    dateOrder: currentFilters.dateOrder,
  });

  // Sincroniza estado com os props
  useEffect(() => {
    setSelectedFilters({
      all: !currentFilters.new && !currentFilters.favorite,
      news: currentFilters.new,
      favorites: currentFilters.favorite,
      dateOrder: currentFilters.dateOrder,
    });
  }, [currentFilters]);

  const handleFilterChange = (filterName) => {
    if (filterName === 'all') {
      onFilterChange({ new: false, favorite: false });
    } else if (filterName === 'news') {
      onFilterChange({ new: !currentFilters.new, favorite: false });
    } else if (filterName === 'favorites') {
      onFilterChange({ new: false, favorite: !currentFilters.favorite });
    } else if (filterName === 'dateOrder') {
      const newOrder = currentFilters.dateOrder === 'DESC' ? 'ASC' : 'DESC';
      onFilterChange({ dateOrder: newOrder });
    }
  };

  return (
    <Container className="page-anima">
      <Grid container spacing={0} sx={{ margin: '50px 0 40px 0' }}>
        <Grid size={{ sm: 'grow', xs: '12' }}>
          <ToggleButtonGroup
            value={Object.keys(selectedFilters).filter(
              (key) => selectedFilters[key] && key !== 'dateOrder',
            )}
            size="medium"
            aria-label="Filtros de conteúdo"
          >
            <ToggleButton
              value="all"
              aria-label="Mostrar tudo"
              selected={selectedFilters.all}
              onClick={() => handleFilterChange('all')}
              sx={{ borderRadius: '5px !important' }}
            >
              Mostrar tudo
            </ToggleButton>
            <ToggleButton
              value="news"
              aria-label="Novidade"
              selected={selectedFilters.news}
              onClick={() => handleFilterChange('news')}
              sx={{ borderRadius: '5px 0 0 5px !important' }}
            >
              Novidade
            </ToggleButton>
            <ToggleButton
              value="favorites"
              aria-label="Favoritos"
              selected={selectedFilters.favorites}
              onClick={() => handleFilterChange('favorites')}
            >
              Favoritos
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid size="auto">
          <Button
            variant={selectedFilters.dateOrder ? 'contained' : 'text'}
            color="neutral"
            size="small"
            sx={{ gap: 2, borderRadius: '5px' }}
            onClick={() => handleFilterChange('dateOrder')}
          >
            Data{' '}
            <span>
              <Icon icon="calendar" />{' '}
              <Icon
                icon={
                  selectedFilters.dateOrder === 'ASC'
                    ? 'arrow-up'
                    : 'arrow-down'
                }
                style={{ marginLeft: '-10px' }}
              />
            </span>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(HomeFilter);
