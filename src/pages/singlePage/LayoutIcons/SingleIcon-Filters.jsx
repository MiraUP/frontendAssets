import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import Icon from '../../../components/icon/icon';
import SingleErrorNotification from '../Single-ErrorNotification';
import Theme from '../../../theme/theme';

const SingleIconFilters = ({
  dataAsset,
  dataFilters,
  onFilterChange,
  onClearFilters,
  activeFilters,
}) => {
  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(Theme.breakpoints.down('sm'));
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Grid container className="content filter">
        {dataFilters?.filters?.styles?.length > 0 && (
          <Box className="content-group filter-styles">
            <Typography variant="h4">
              <Icon icon="palette" size={30} />
              Estilos
            </Typography>
            <List>
              {dataFilters.filters.styles.map(
                ({ count, name, term_id, slug }) => (
                  <ListItem key={term_id}>
                    <ListItemButton
                      selected={activeFilters.styles.includes(slug)}
                      onClick={() => onFilterChange('style', slug)}
                    >
                      {name}
                      <span className="count">{count}</span>
                    </ListItemButton>
                  </ListItem>
                ),
              )}
            </List>
          </Box>
        )}

        {/* Filtros de Categoria */}
        {dataFilters?.filters?.categories?.length > 0 && (
          <Box className="content-group filter-category">
            <Typography variant="h4">
              <Icon icon="grid-horizontal" size={30} />
              Categorias
            </Typography>
            <List>
              {dataFilters.filters.categories.map(
                ({ count, name, term_id, slug }) => (
                  <ListItem key={term_id}>
                    <ListItemButton
                      selected={activeFilters.categories.includes(slug)}
                      onClick={() => onFilterChange('category', slug)}
                    >
                      {name}
                      <span className="count">{count}</span>
                    </ListItemButton>
                  </ListItem>
                ),
              )}
            </List>
          </Box>
        )}

        {/* Filtros Ativos */}
        {(activeFilters.categories.length > 0 ||
          activeFilters.styles.length > 0) && (
          <Box className="content-group">
            <Typography variant="h4">
              <Icon icon="filter" size={30} />
              Filtros ativos
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {activeFilters.categories.map((slug) => {
                const category = dataFilters.filters.categories.find(
                  (c) => c.slug === slug,
                );
                return (
                  <Chip
                    key={`cat-${slug}`}
                    label={category?.name || slug}
                    onDelete={() => onFilterChange('category', slug)}
                    variant="outlined"
                    size="small"
                  />
                );
              })}
              {activeFilters.styles.map((slug) => {
                const style = dataFilters.filters.styles.find(
                  (s) => s.slug === slug,
                );
                return (
                  <Chip
                    key={`style-${slug}`}
                    label={style?.name || slug}
                    onDelete={() => onFilterChange('style', slug)}
                    variant="outlined"
                    color="info"
                    size="small"
                  />
                );
              })}
            </Box>
            <Button
              variant="contained"
              size="xsmall"
              fullWidth
              onClick={onClearFilters}
            >
              Limpar todos os filtros
            </Button>
          </Box>
        )}
        <Box className="content-group filter-statistics">
          <Button
            size="small"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<Icon icon="line-03-up" />}
          >
            Estatísticas desse Ativo
          </Button>
        </Box>
        <Box className="compatibility content-group">
          <Typography variant="h4">
            <Icon icon="info" size={30} />
            Notificar Erro
          </Typography>
          <Typography variant="body1">
            Esse é um canal que você pode informar qualquer falha nesse Ativo.
          </Typography>
          <Typography variant="body1">
            Ex: Link de download quebrado, informações erradas, solicitar de
            remoção, falha em funcionalidades do sistema, etc.
          </Typography>
          <Typography variant="body1">
            Você será notificado quando o problema for solucionado.
          </Typography>
          <Button
            color="error"
            variant="contained"
            fullWidth
            size="small"
            style={{ marginTop: '15px' }}
            onClick={handleClickOpen}
          >
            Solicitar correção
          </Button>
        </Box>
      </Grid>
      <Dialog
        className="notification-error"
        fullScreen={fullScreen}
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="error-notification"
        aria-describedby="error-notification-description"
      >
        <DialogTitle>
          <Grid container>
            <Grid size="grow" alignItems={'center'} display={'flex'}>
              <Typography variant="h3">Notificar erro</Typography>
            </Grid>
            <Grid size="auto">
              <IconButton className="anima-rotate-zoom" onClick={handleClose}>
                <Icon icon="close" size={30} />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent
          dividers={scroll === 'paper'}
          sx={{ paddingTop: '5px !important' }}
        >
          <SingleErrorNotification dataAsset={dataAsset} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SingleIconFilters;
