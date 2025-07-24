import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useColorScheme,
  useMediaQuery,
  useScrollTrigger,
} from '@mui/material';
import React from 'react';
import Icon from '../../../components/icon/icon';
import { Link } from 'react-router-dom';
import { useAlert } from '../../../hooks/alertContext';
import Theme from '../../../theme/theme';
import { FAVORITE_PUT } from '../../../hooks/useFetch';

const btnToggle = {
  padding: '10px !important',
  minWidth: '50px !important',
  borderRadius: '50px',
};

const SingleIconHeader = ({
  loadingAsset,
  dataAsset,
  toggleFilter,
  setToggleFilter,
  toggleCustomizer,
  setToggleCustomizer,
  userID,
  onSearch,
}) => {
  const token = window.localStorage.getItem('token');
  const [favorite, setFavorite] = React.useState(null);
  const { mode } = useColorScheme();
  const showAlert = useAlert();
  const matchDownMd = useMediaQuery(Theme.breakpoints.down('md'));
  const matchDownSm = useMediaQuery(Theme.breakpoints.down('sm'));
  const [localSearchTerm, setLocalSearchTerm] = React.useState('');
  const scroll = useScrollTrigger({
    disableHysteresis: true,
    threshold: 145,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearchTerm);
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearch]);

  React.useEffect(() => {
    dataAsset && setFavorite(dataAsset.favorite);
  }, [dataAsset]);

  const handleFavorite = () => {
    async function updateFavorite() {
      try {
        const { url, options } = FAVORITE_PUT(token, userID, {
          post_id: dataAsset.id,
          favorite: !favorite,
        });
        const response = await fetch(`${url}`, options);
        const json = await response.json();
        console.log(json.favorite);
      } catch (err) {
        showAlert(err.message || err, 'error');
      } finally {
        setFavorite(!favorite);
      }
    }
    updateFavorite();
  };

  if (loadingAsset) {
    return 'Carregando...';
  } else {
    if (dataAsset) {
      return (
        <>
          <Grid container className={`header scroll${scroll ? ' show' : ''}`}>
            <Grid size="auto">
              <IconButton
                size="small"
                color="neutral"
                sx={btnToggle}
                onClick={() => setToggleFilter(!toggleFilter)}
              >
                <Icon
                  icon={
                    toggleFilter
                      ? 'offcanvas-left-arrow-left'
                      : 'offcanvas-left-arrow-right'
                  }
                  size={30}
                />
              </IconButton>
            </Grid>
            <Grid
              size="grow"
              className="header-title"
              container
              gap={3}
              alignItems="center"
            >
              <Grid size="grow">
                <TextField
                  label="Pesquisar por ícone"
                  sx={{
                    width: '100%',
                    input: { padding: '13.1px 14px 13.1px 0' },
                  }}
                  type="search"
                  color={mode === 'dark' ? 'info' : 'primary'}
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon icon="search" size={25} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size="auto">
                <ButtonGroup
                  variant="contained"
                  aria-label="Botões de favoritos e download"
                  size="small"
                  disableElevation
                  orientation="horizontal"
                >
                  <Button color="secondary" onClick={handleFavorite}>
                    <Icon icon={favorite ? 'heart-filled' : 'heart'} />
                  </Button>
                  <Link to={dataAsset.download} target="_blank">
                    <Button color="success">
                      <Icon icon="download" />
                    </Button>
                  </Link>
                </ButtonGroup>
              </Grid>
            </Grid>
            <Grid size="auto">
              <IconButton
                size="xsmall"
                color="neutral"
                sx={btnToggle}
                onClick={() => setToggleCustomizer(!toggleCustomizer)}
              >
                <Icon
                  icon={
                    toggleCustomizer
                      ? 'offcanvas-right-arrow-right'
                      : 'offcanvas-right-arrow-left'
                  }
                  size={30}
                />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container className="header">
            <Grid size="auto">
              <IconButton
                size="small"
                color="neutral"
                sx={btnToggle}
                onClick={() => setToggleFilter(!toggleFilter)}
              >
                <Icon
                  icon={
                    toggleFilter
                      ? 'offcanvas-left-arrow-left'
                      : 'offcanvas-left-arrow-right'
                  }
                  size={30}
                />
              </IconButton>
            </Grid>
            <Grid size="grow" className="header-title">
              <Typography
                component="h1"
                variant="h2"
                sx={{ margin: '0 !important' }}
              >
                {dataAsset.title}
              </Typography>
            </Grid>
            <Grid size="auto">
              <IconButton
                size="xsmall"
                color="neutral"
                sx={btnToggle}
                onClick={() => setToggleCustomizer(!toggleCustomizer)}
              >
                <Icon
                  icon={
                    toggleCustomizer
                      ? 'offcanvas-right-arrow-right'
                      : 'offcanvas-right-arrow-left'
                  }
                  size={30}
                />
              </IconButton>
            </Grid>
            <Grid
              size={12}
              container
              gap={3}
              alignItems="center"
              marginBottom={5}
            >
              <Grid size="grow">
                <TextField
                  label="Pesquisar por ícone"
                  sx={{
                    width: '100%',
                    input: { padding: '13.1px 14px 13.1px 0' },
                  }}
                  type="search"
                  color={mode === 'dark' ? 'info' : 'primary'}
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon icon="search" size={25} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size="auto">
                <ButtonGroup
                  variant="contained"
                  aria-label="Botões de favoritos e download"
                  size="small"
                  disableElevation
                  orientation="horizontal"
                >
                  <Button
                    color="secondary"
                    startIcon={
                      <Icon icon={favorite ? 'heart-filled' : 'heart'} />
                    }
                    onClick={handleFavorite}
                  >
                    Favoritos
                  </Button>
                  <Link to={dataAsset.download} target="_blank">
                    <Button
                      color="success"
                      startIcon={<Icon icon="download" />}
                    >
                      Download
                    </Button>
                  </Link>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </>
      );
    }
  }
};

export default SingleIconHeader;
