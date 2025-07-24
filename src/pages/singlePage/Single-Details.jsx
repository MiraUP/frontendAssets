import React from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Icon from '../../components/icon/icon';
import Theme from '../../theme/theme';
import { Link, useParams } from 'react-router-dom';

const SingleDetails = ({ loading, dataAsset, setDivDetails }) => {
  const matchDownSm = useMediaQuery(Theme.breakpoints.down('sm'));
  const { slug } = useParams();
  const refDivDetails = React.useRef(null);

  React.useEffect(() => {
    if (refDivDetails.current) {
      setDivDetails(refDivDetails.current.getBoundingClientRect().height);
    }
  }, [dataAsset, window.scrollY]);

  if (dataAsset) {
    return (
      <Container className="details" ref={refDivDetails}>
        <Grid container flexDirection="column">
          {dataAsset.post_content && (
            <Grid className="description zebra-striping">
              <Typography variant="h2">Descrição</Typography>
              <Typography>{dataAsset && dataAsset.post_content}</Typography>
            </Grid>
          )}
          {dataAsset.emphasis.length > 0 && (
            <Grid className="emphasis zebra-striping">
              <Typography variant="h2">Destaques</Typography>
              <List dense>
                {dataAsset &&
                  dataAsset.emphasis.length > 0 &&
                  dataAsset.emphasis.map(({ id, value }) => (
                    <ListItem key={id}>
                      <Icon
                        icon="check"
                        size={35}
                        color="var(--mui-palette-green-main)"
                      />
                      {value}
                    </ListItem>
                  ))}
              </List>
            </Grid>
          )}

          {dataAsset.font || dataAsset.size_file ? (
            <Grid
              container
              className="fonts-files zebra-striping"
              gap={{ sm: 5, xs: 2 }}
              sx={{ flexDirection: { sm: 'row', xs: 'column' } }}
            >
              {dataAsset.font && (
                <Grid size="grow">
                  <Typography variant="h2">Fontes</Typography>
                  {dataAsset.font}
                </Grid>
              )}
              {!dataAsset.font || !dataAsset.size_file ? (
                ''
              ) : !matchDownSm ? (
                <Divider orientation="vertical" variant="middle" flexItem />
              ) : (
                <Divider
                  orientation="horizontal"
                  flexItem
                  sx={{ marginTop: '13px' }}
                />
              )}
              {dataAsset.size_file && (
                <Grid size="grow">
                  <Typography variant="h2">Arquivos</Typography>
                  {dataAsset.size_file}
                </Grid>
              )}
            </Grid>
          ) : (
            ''
          )}

          {dataAsset.compatibility.length > 0 && (
            <Grid className="compatibility zebra-striping">
              <Typography variant="h2">Compatibilidades</Typography>
              <Stack direction="row" spacing={2}>
                {dataAsset.compatibility.length > 0 &&
                  dataAsset.compatibility.map(({ term_id, slug, name }) => (
                    <Tooltip key={term_id} title={name}>
                      <Icon icon={slug} size={35} />
                    </Tooltip>
                  ))}
              </Stack>
            </Grid>
          )}
        </Grid>
        <Link to={`/ativo/contribuir/${slug}`}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<Icon icon="heart-rate" size={35} />}
            fullWidth
          >
            Contribua com esse material
          </Button>
        </Link>
      </Container>
    );
  }
};

export default SingleDetails;
