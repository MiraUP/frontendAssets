import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Divider,
  Grid,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Switch,
  ToggleButton,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import React from 'react';
import Icon from '../../components/icon/icon';
import { TAXONOMY_GET } from '../../hooks/useFetch';
import SkeletonMUP from '../../components/skeleton/skeleton';
import { useSearch } from '../../hooks/searchContext';
import useScreenSize from '../../utils/windowSize';

const SearchFilter = ({ open, setOpen }) => {
  const token = window.localStorage.getItem('token');
  const { updateFilter } = useSearch();
  const { mode } = useColorScheme();
  const [taxonomyName, setTaxonomyName] = React.useState('');
  const [dataTaxonomys, setDataTaxonomys] = React.useState();
  const [loadingTaxonomys, setLoadingTaxonomys] = React.useState(true);
  const [checkedFavorite, setCheckedFavorite] = React.useState(false);
  const [checkedCategory, setCheckedCategory] = React.useState([]);
  const [checkedCompatibility, setCheckedCompatibility] = React.useState([]);
  const [checkedOrigin, setCheckedOrigin] = React.useState([]);
  const [checkedDeveloper, setCheckedDeveloper] = React.useState([]);
  const { width } = useScreenSize();
  const [openMenuFilterXS, setMenuFilterXS] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setMenuFilterXS((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setMenuFilterXS(false);
  };

  // Buscar taxonomias
  React.useEffect(() => {
    setLoadingTaxonomys(true);
    async function getTaxonomy() {
      try {
        const { url, options } = TAXONOMY_GET(token);
        const response = await fetch(
          `${url}?taxonomy=${taxonomyName}`,
          options,
        );
        const json = await response.json();
        setDataTaxonomys(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTaxonomys(false);
      }
    }
    getTaxonomy();
  }, []);

  //Atualização dos filtros
  React.useEffect(() => {
    updateFilter('favoritesOnly', checkedFavorite);
  }, [checkedFavorite, updateFilter]);

  React.useEffect(() => {
    updateFilter('category', checkedCategory);
  }, [checkedCategory, updateFilter]);

  React.useEffect(() => {
    updateFilter('compatibility', checkedCompatibility);
  }, [checkedCompatibility, updateFilter]);

  React.useEffect(() => {
    updateFilter('origin', checkedOrigin);
  }, [checkedOrigin, updateFilter]);

  React.useEffect(() => {
    updateFilter('developer', checkedDeveloper);
  }, [checkedDeveloper, updateFilter]);

  React.useEffect(() => {
    if (dataTaxonomys) {
      setCheckedCategory([]);
      setCheckedCompatibility([]);
      setCheckedDeveloper([]);
      setCheckedOrigin([]);
    }
  }, [dataTaxonomys]);

  const handleChangeFavorite = (event) => {
    const isChecked = event.target.checked;
    setCheckedFavorite(isChecked);
  };

  const handleToggleCategory = (term_id) => {
    setCheckedCategory((prev) => {
      const newValue = prev.includes(term_id)
        ? prev.filter((id) => id !== term_id)
        : [...prev, term_id];
      return newValue;
    });
  };

  const handleToggleCompatibility = (term_id) => {
    setCheckedCompatibility((prev) => {
      const newValue = prev.includes(term_id)
        ? prev.filter((id) => id !== term_id)
        : [...prev, term_id];
      return newValue;
    });
  };

  const handleToggleOrigin = (term_id) => {
    setCheckedOrigin((prev) => {
      const newValue = prev.includes(term_id)
        ? prev.filter((id) => id !== term_id)
        : [...prev, term_id];
      return newValue;
    });
  };

  const handleToggleDeveloper = (term_id) => {
    setCheckedDeveloper((prev) => {
      const newValue = prev.includes(term_id)
        ? prev.filter((id) => id !== term_id)
        : [...prev, term_id];
      return newValue;
    });
  };

  const toggleAllCategory = () => {
    if (dataTaxonomys) {
      if (checkedCategory.length === 0) {
        const allIds = dataTaxonomys
          .filter(({ taxonomy }) => taxonomy === 'category')
          .map(({ term_id }) => term_id);

        setCheckedCategory(allIds);
      } else {
        setCheckedCategory([]);
      }
    }
  };

  const toggleAllCompatibility = () => {
    if (dataTaxonomys) {
      if (checkedCompatibility.length === 0) {
        const allIds = dataTaxonomys
          .filter(({ taxonomy }) => taxonomy === 'compatibility')
          .map(({ term_id }) => term_id);

        setCheckedCompatibility(allIds);
      } else {
        setCheckedCompatibility([]);
      }
    }
  };

  const toggleAllOrigin = () => {
    if (dataTaxonomys) {
      if (checkedOrigin.length === 0) {
        const allIds = dataTaxonomys
          .filter(({ taxonomy }) => taxonomy === 'origin')
          .map(({ term_id }) => term_id);

        setCheckedOrigin(allIds);
      } else {
        setCheckedOrigin([]);
      }
    }
  };

  const toggleAllDeveloper = () => {
    if (dataTaxonomys) {
      if (checkedDeveloper.length === 0) {
        const allIds = dataTaxonomys
          .filter(({ taxonomy }) => taxonomy === 'developer')
          .map(({ term_id }) => term_id);

        setCheckedDeveloper(allIds);
      } else {
        setCheckedDeveloper([]);
      }
    }
  };

  const ItemsFilter = () => {
    return (
      <Box className="filters scrollbar-simple">
        <label style={{ cursor: 'pointer' }}>
          <Typography variant="h4">
            <span>
              <Icon icon="heart" stroke={3} />
              Apenas favoritos
            </span>
            <Switch
              color="success"
              size="small"
              checked={checkedFavorite}
              onChange={handleChangeFavorite}
            />
          </Typography>
        </label>
        <Divider
          style={{
            borderColor:
              mode === 'dark'
                ? 'var(--mui-palette-black-c500)'
                : 'var(--mui-palette-white-c300)',
          }}
        />

        <Box>
          <Typography
            variant="h4"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <span style={{ flex: 1 }}>
              <Icon icon="grid-horizontal" stroke={2} />
              Categorias
            </span>
            <Button
              size="xsmall"
              variant="contained"
              onClick={toggleAllCategory}
              sx={{ ml: 1 }}
            >
              {checkedCategory.length === 0 ? 'Todas' : 'Nenhuma'}
            </Button>
          </Typography>
          <List>
            {loadingTaxonomys ? (
              <SkeletonMUP num={4} width="100%" height="48.8px" />
            ) : (
              dataTaxonomys &&
              dataTaxonomys.length > 0 &&
              dataTaxonomys
                .filter(({ taxonomy }) => taxonomy === 'category')
                .map(({ term_id, name }) => (
                  <ListItem key={term_id} disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={() => handleToggleCategory(term_id)}
                      dense
                    >
                      <Checkbox
                        edge="start"
                        checked={checkedCategory.includes(term_id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': term_id }}
                        icon={<Icon icon="square" />}
                        checkedIcon={<Icon icon="combobox-check" />}
                      />
                      <ListItemText id={term_id} primary={name} />
                    </ListItemButton>
                  </ListItem>
                ))
            )}
          </List>
        </Box>

        <Divider
          style={{
            borderColor:
              mode === 'dark'
                ? 'var(--mui-palette-black-c500)'
                : 'var(--mui-palette-white-c300)',
          }}
        />

        <Box>
          <Typography
            variant="h4"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <span style={{ flex: 1 }}>
              <Icon icon="file-star" stroke={2} />
              Compatibilidades
            </span>
            <Button
              size="xsmall"
              variant="contained"
              onClick={toggleAllCompatibility}
              sx={{ ml: 1 }}
            >
              {checkedCompatibility.length === 0 ? 'Todas' : 'Nenhuma'}
            </Button>
          </Typography>
          {loadingTaxonomys ? (
            <SkeletonMUP num={1} width="100%" height="200px" />
          ) : (
            <Grid
              container
              direction="row"
              sx={{
                marginTop: '20px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {dataTaxonomys &&
                dataTaxonomys.length > 0 &&
                dataTaxonomys
                  .filter(({ taxonomy }) => taxonomy === 'compatibility')
                  .map(({ term_id, slug, name }) => (
                    <Grid item size="grow" key={term_id}>
                      <Tooltip title={name}>
                        <ToggleButton
                          className="btn-compatibility"
                          value={term_id}
                          aria-label={`Filtrar por ${name}`}
                          selected={checkedCompatibility.includes(term_id)}
                          onChange={() => handleToggleCompatibility(term_id)}
                          size="small"
                          sx={{
                            minWidth: 100,
                            '&.Mui-selected': {
                              backgroundColor:
                                mode === 'dark'
                                  ? 'primary.dark'
                                  : 'primary.light',
                              color: mode === 'dark' ? 'white' : 'text.primary',
                            },
                          }}
                        >
                          <Icon icon={slug} />
                        </ToggleButton>
                      </Tooltip>
                    </Grid>
                  ))}
            </Grid>
          )}
        </Box>

        <Divider
          style={{
            borderColor:
              mode === 'dark'
                ? 'var(--mui-palette-black-c500)'
                : 'var(--mui-palette-white-c300)',
          }}
        />

        <Box>
          <Typography
            variant="h4"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <span style={{ flex: 1 }}>
              <Icon icon="globe" stroke={2} />
              Origem
            </span>
            <Button
              size="xsmall"
              variant="contained"
              onClick={toggleAllOrigin}
              sx={{ ml: 1 }}
            >
              {checkedOrigin.length === 0 ? 'Todas' : 'Nenhuma'}
            </Button>
          </Typography>
          <List>
            {loadingTaxonomys ? (
              <SkeletonMUP num={4} width="100%" height="48.8px" />
            ) : (
              dataTaxonomys &&
              dataTaxonomys.length > 0 &&
              dataTaxonomys
                .filter(({ taxonomy }) => taxonomy === 'origin')
                .map(({ term_id, name }) => (
                  <ListItem key={term_id} disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={() => handleToggleOrigin(term_id)}
                      dense
                    >
                      <Checkbox
                        edge="start"
                        checked={checkedOrigin.includes(term_id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': term_id }}
                        icon={<Icon icon="square" />}
                        checkedIcon={<Icon icon="combobox-check" />}
                      />
                      <ListItemText id={term_id} primary={name} />
                    </ListItemButton>
                  </ListItem>
                ))
            )}
          </List>
        </Box>

        <Divider
          style={{
            borderColor:
              mode === 'dark'
                ? 'var(--mui-palette-black-c500)'
                : 'var(--mui-palette-white-c300)',
          }}
        />

        <Box>
          <Typography
            variant="h4"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <span style={{ flex: 1 }}>
              <Icon icon="user" stroke={2} />
              Autores
            </span>
            <Button
              size="xsmall"
              variant="contained"
              onClick={toggleAllDeveloper}
              sx={{ ml: 1 }}
            >
              {checkedDeveloper.length === 0 ? 'Todas' : 'Nenhuma'}
            </Button>
          </Typography>
          <List>
            {loadingTaxonomys ? (
              <SkeletonMUP num={4} width="100%" height="48.8px" />
            ) : (
              dataTaxonomys &&
              dataTaxonomys.length > 0 &&
              dataTaxonomys
                .filter(({ taxonomy }) => taxonomy === 'developer')
                .map(({ term_id, name }) => (
                  <ListItem key={term_id} disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={() => handleToggleDeveloper(term_id)}
                      dense
                    >
                      <Checkbox
                        edge="start"
                        checked={checkedDeveloper.includes(term_id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': term_id }}
                        icon={<Icon icon="square" />}
                        checkedIcon={<Icon icon="combobox-check" />}
                      />
                      <ListItemText id={term_id} primary={name} />
                    </ListItemButton>
                  </ListItem>
                ))
            )}
          </List>
        </Box>
      </Box>
    );
  };

  const FilterXS = () => {
    return (
      <Box
        className={
          open
            ? 'search-filters search-filters-open'
            : 'search-filters search-filters-close'
        }
      >
        <Tooltip title="Abrir os filtros">
          <IconButton onClick={() => setOpen(!open)} className="btn-open">
            <Icon icon="offcanvas-left-arrow-right" size={30} />
          </IconButton>
        </Tooltip>
        <Box className="search-filters-content">
          <Typography variant="h3">
            Filtros{' '}
            <Tooltip title="Ocultar os filtros">
              <IconButton onClick={() => setOpen(!open)}>
                <Icon icon="offcanvas-left-arrow-left" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Divider
            style={{
              borderColor:
                mode === 'dark'
                  ? 'var(--mui-palette-black-c500)'
                  : 'var(--mui-palette-white-c300)',
            }}
          />

          <ItemsFilter />
        </Box>
      </Box>
    );
  };

  const FilterSM = () => {
    return (
      <>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Button
            variant="contained"
            color={mode === 'dark' ? 'black' : 'white'}
            size="small"
            fullWidth
            ref={anchorRef}
            aria-controls={openMenuFilterXS ? 'composition-menu' : undefined}
            aria-expanded={openMenuFilterXS ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: openMenuFilterXS
                ? 'var(--mui-shape-borderRadius) var(--mui-shape-borderRadius) 0 0 !important'
                : 'var(--mui-shape-borderRadius)',
            }}
            endIcon={
              <Icon icon={openMenuFilterXS ? 'settings-01' : 'settings-01'} />
            }
          >
            Filtrar
          </Button>
          <Popper
            open={openMenuFilterXS}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            sx={{
              transform: 'translateY(47px) !important',
              zIndex: '10',
              width: '100%',
            }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
              >
                <Paper elevation={0}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <Box className="search-filters">
                      <ItemsFilter />
                    </Box>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Box>
      </>
    );
  };

  if (width <= 600) {
    return <FilterSM />;
  } else {
    return <FilterXS />;
  }
};

export default React.memo(SearchFilter);
