import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  useColorScheme,
  IconButton,
  Popover,
  MenuItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import Icon from '../../components/icon/icon';
import Theme, { BaseColors } from '../../theme/theme';
import SkeletonMUP from '../../components/skeleton/skeleton';
import { useSearch } from '../../hooks/searchContext';

const HomeSearch = ({ data, loading, onCategoryChange, currentCategory }) => {
  const { openSearch } = useSearch();
  const inputRef = React.useRef(null);
  const categoriesContainerRef = React.useRef(null);
  const matchDownMd = useMediaQuery(Theme.breakpoints.down('md'));
  const { mode } = useColorScheme();
  const [showMoreButton, setShowMoreButton] = React.useState(false);
  const [hiddenCategories, setHiddenCategories] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [category, setCategory] = React.useState(currentCategory || 'all');
  const OS = navigator.platform;

  let systemOS = 'Atalho';

  if (OS.indexOf('Win') > -1) {
    systemOS = 'CTRL';
  } else if (OS.indexOf('Mac') > -1) {
    systemOS = <Icon icon="command" size={20} />;
  } else if (OS.indexOf('Linux') > -1) {
    systemOS = 'CTRL';
  }

  // Verificar overflow das categorias
  const checkOverflow = () => {
    if (categoriesContainerRef.current) {
      const container = categoriesContainerRef.current;
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setShowMoreButton(isOverflowing);

      if (isOverflowing) {
        const buttons = container.querySelectorAll('.MuiToggleButton-root');
        const hidden = [];
        let containerRight = container.getBoundingClientRect().right;

        buttons.forEach((button) => {
          const buttonRight = button.getBoundingClientRect().right;
          if (buttonRight > containerRight) {
            const value = button.getAttribute('value');
            const name = button.textContent;
            if (value && name) {
              hidden.push({ value, name });
            }
          }
        });

        setHiddenCategories(hidden);
      } else {
        setHiddenCategories([]);
      }
    }
  };

  // Efeitos para verificar overflow e atalho de teclado
  React.useEffect(() => {
    checkOverflow();
    const handleResize = () => checkOverflow();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setCategory(newCategory);
      onCategoryChange(newCategory === 'all' ? '' : newCategory);
    }
  };

  const handleMoreClick = (event) => setAnchorEl(event.currentTarget);
  const handleMoreClose = () => setAnchorEl(null);

  const handleSelectHiddenCategory = (value) => {
    setCategory(value);
    handleMoreClose();
  };

  return (
    <Container className="home-search page-anima">
      <Grid container spacing={0}>
        <Grid
          size={12}
          className="home-search-input"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 3,
          }}
          onClick={openSearch}
        >
          {!matchDownMd && (
            <Button
              size="small"
              variant="contained"
              sx={{ minWidth: '111px' }}
              disabled
              onClick={openSearch}
            >
              {systemOS} + K
            </Button>
          )}

          <input
            type="text"
            placeholder="Procurar"
            ref={inputRef}
            readOnly
            style={{ cursor: 'pointer' }}
          />

          <IconButton onClick={openSearch} aria-label="Abrir pesquisa">
            <Icon icon="search" size={60} className="btn-search" />
          </IconButton>
        </Grid>

        <Grid
          size={12}
          className="home-search-categorys"
          sx={{ position: 'relative' }}
        >
          <Box
            ref={categoriesContainerRef}
            sx={{
              display: 'flex',
              overflow: 'hidden',
              width: 'calc(100% - 48px)',
              gap: 1,
            }}
          >
            {loading ? (
              <Box
                sx={{
                  width: '100%',
                  height: '66px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <SkeletonMUP
                  num={4}
                  width="20%"
                  variant="text"
                  style={{ fontSize: '1rem', width: '100%' }}
                />
              </Box>
            ) : (
              <ToggleButtonGroup
                value={category}
                exclusive
                onChange={handleCategoryChange}
                sx={{ flexWrap: 'nowrap' }}
                size="small"
              >
                <ToggleButton value="all" aria-label="Todas categorias">
                  Todas
                </ToggleButton>
                {data && data.length > 0 ? (
                  data.map(({ term_id, slug, name }) => (
                    <ToggleButton
                      key={term_id}
                      value={slug}
                      aria-label={`Categoria ${name}`}
                    >
                      {name}
                    </ToggleButton>
                  ))
                ) : (
                  <ToggleButton disabled sx={{ border: 'none !important' }}>
                    Não encontrei nada por aqui...
                  </ToggleButton>
                )}
              </ToggleButtonGroup>
            )}
          </Box>

          {showMoreButton && (
            <IconButton
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              onClick={handleMoreClick}
            >
              <Icon icon="more" />
            </IconButton>
          )}

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleMoreClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {hiddenCategories.map(({ value, name }) => (
              <MenuItem
                key={value}
                onClick={() => handleSelectHiddenCategory(value)}
                selected={category === value}
              >
                <ListItemText>{name}</ListItemText>
              </MenuItem>
            ))}
          </Popover>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(HomeSearch);
