import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import Icon from '../../../components/icon/icon';
import { Link } from 'react-router-dom';
import { useAlert } from '../../../hooks/alertContext';
import Theme from '../../../theme/theme';
import { FAVORITE_PUT } from '../../../hooks/useFetch';

const SingleHeader = ({
  dataAsset,
  loading,
  userID,
  setToggleInfo,
  toggleInfo,
}) => {
  const token = window.localStorage.getItem('token');
  const [favorite, setFavorite] = React.useState(null);
  const showAlert = useAlert();
  const matchDownMd = useMediaQuery(Theme.breakpoints.down('md'));
  const matchDownSm = useMediaQuery(Theme.breakpoints.down('sm'));

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

  return (
    <Grid container gap={5}>
      <Grid size="grow" className="header-title">
        <Typography variant="h2" component="h1">
          {!matchDownMd && (
            <IconButton
              variant="text"
              color="neutral"
              size="small"
              onClick={() => setToggleInfo(!toggleInfo)}
              sx={{ marginRight: '15px' }}
            >
              <Icon
                icon={
                  toggleInfo
                    ? 'offcanvas-left-arrow-left'
                    : 'offcanvas-left-arrow-right'
                }
                size={30}
              />
            </IconButton>
          )}
          {dataAsset.title}
        </Typography>
        <Typography variant="subtitle1">{dataAsset.subtitle}</Typography>
        {matchDownSm && (
          <ButtonGroup
            variant="contained"
            aria-label="Botões de favoritos e download"
            size="xsmall"
            fullWidth
            disableElevation
          >
            {matchDownMd && (
              <Button
                variant="text"
                color="neutral"
                onClick={() => setToggleInfo(!toggleInfo)}
                startIcon={<Icon icon="info" />}
              >
                Detalhes
              </Button>
            )}
            <Button
              color="secondary"
              startIcon={<Icon icon={favorite ? 'heart-filled' : 'heart'} />}
              onClick={handleFavorite}
            >
              Favoritos
            </Button>
            <Link
              to={dataAsset.download}
              target="_blank"
              style={{ width: '100%', display: 'inline-flex' }}
            >
              <Button color="success" startIcon={<Icon icon="download" />}>
                Download
              </Button>
            </Link>
          </ButtonGroup>
        )}
      </Grid>
      {!matchDownSm && (
        <Grid size="auto" className="header-btns">
          <ButtonGroup
            variant="contained"
            aria-label="Botões de favoritos e download"
            size="small"
            disableElevation
            orientation={!matchDownMd ? 'horizontal' : 'vertical'}
          >
            <Button
              color="secondary"
              startIcon={<Icon icon={favorite ? 'heart-filled' : 'heart'} />}
              onClick={handleFavorite}
            >
              Favoritos
            </Button>
            <Link to={dataAsset.download} target="_blank">
              <Button color="success" startIcon={<Icon icon="download" />}>
                Download
              </Button>
            </Link>
            {!matchDownMd ? (
              ''
            ) : (
              <Button
                variant="text"
                color="neutral"
                size="small"
                onClick={() => setToggleInfo(!toggleInfo)}
                startIcon={
                  <Icon
                    icon={
                      toggleInfo
                        ? 'offcanvas-right-arrow-right'
                        : 'offcanvas-right-arrow-left'
                    }
                  />
                }
              >
                Detalhes
              </Button>
            )}
          </ButtonGroup>
        </Grid>
      )}
    </Grid>
  );
};

export default React.memo(SingleHeader);
