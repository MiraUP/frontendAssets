import React from 'react';
import {
  Container,
  Drawer,
  Grid,
  Stack,
  useColorScheme,
  useMediaQuery,
} from '@mui/material';
import Theme from '../../theme/theme';
import Footer from '../../layout/footer';
import SingleComments from './Single-Comments';
import SingleDetails from './Single-Details';
import SingleInfo from './LayoutIllustrations/Single-Info';
import SinglePreviews from './LayoutIllustrations/Single-Previews';
import SingleHeader from './LayoutIllustrations/Single-Header';

const SingleLayoutIllustration = ({
  loadingAsset,
  dataAsset,
  dataUser,
  toggleInfo,
  setToggleInfo,
}) => {
  const contentMainRef = React.useRef(null);
  const [elementHeight, setElementHeight] = React.useState(0);
  const matchDownSm = useMediaQuery(Theme.breakpoints.down('sm'));
  const { mode } = useColorScheme();
  const [divComments, setDivComments] = React.useState(0);
  const [divDetails, setDivDetails] = React.useState(0);

  React.useEffect(() => {
    const updateHeight = () => {
      if (contentMainRef.current) {
        const height = contentMainRef.current.clientHeight;
        setElementHeight(height);
      }
    };

    // Executa imediatamente
    updateHeight();

    // Configura um ResizeObserver para detectar mudanças dinâmicas
    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentMainRef.current) {
      resizeObserver.observe(contentMainRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [dataAsset, loadingAsset]);

  const BackgroundPreview = {
    width: '100%',
    backgroundColor:
      mode === 'dark'
        ? 'var(--mui-palette-black-c400)'
        : 'var(--mui-palette-white-c700)',
    position: 'absolute',
    height: elementHeight + 300,
    zIndex: -10,
    boxShadow:
      mode === 'dark'
        ? '0 -100px 0 var(--mui-palette-black-c400)'
        : '0 -100px 0 var(--mui-palette-white-c700)',
  };

  return (
    <>
      <div className="bg-preview" style={BackgroundPreview} />
      <Stack
        direction="row"
        spacing={0}
        className="asset-content-main page-anima"
        ref={contentMainRef}
      >
        {matchDownSm ? (
          <Drawer
            open={toggleInfo}
            onClose={() => setToggleInfo(false)}
            anchor="left"
          >
            <Grid size="auto" className="info">
              <Container>
                <SingleInfo
                  loading={loadingAsset}
                  dataAsset={dataAsset}
                  toggleInfo={toggleInfo}
                />
              </Container>
            </Grid>
          </Drawer>
        ) : (
          <Grid size="auto" className={toggleInfo ? 'info' : 'info close'}>
            <Container>
              <SingleInfo
                loading={loadingAsset}
                dataAsset={dataAsset}
                toggleInfo={toggleInfo}
              />
            </Container>
          </Grid>
        )}
        <Grid size="grow" className="previews">
          <Container container gap={5} maxWidth="full">
            <SingleHeader
              toggleInfo={toggleInfo}
              setToggleInfo={setToggleInfo}
              loading={loadingAsset}
              dataAsset={dataAsset}
              userID={dataUser.id}
            />
            <SinglePreviews
              loading={loadingAsset}
              dataAsset={dataAsset}
              toggleInfo={toggleInfo}
            />
          </Container>
        </Grid>
      </Stack>
      <SingleDetails
        loading={loadingAsset}
        dataAsset={dataAsset}
        divDetails={divDetails}
        setDivDetails={setDivDetails}
      />
      <SingleComments
        loading={loadingAsset}
        dataAsset={dataAsset}
        dataUser={dataUser}
        divComments={divComments}
        setDivComments={setDivComments}
      />
      {console.log(dataAsset)}
      <Footer />
    </>
  );
};

export default SingleLayoutIllustration;
