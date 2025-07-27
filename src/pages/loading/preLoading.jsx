import React from 'react';
import useScreenSize from '../../utils/windowSize';
import { Grid } from '@mui/material';
import Brand from '../../components/brand/brand';
import './_preloading.scss';
import { UserContext } from '../../hooks/userContext';

const PreLoading = () => {
  const { height } = useScreenSize();
  const { preLoading, setPreLoading } = React.useContext(UserContext);

  React.useEffect(() => {
    const timerPreLoading = setTimeout(() => {
      setPreLoading(false);
    }, 4800);

    return () => clearTimeout(timerPreLoading);
  }, []);

  if (preLoading != true) return null;

  return (
    <Grid
      container
      sx={{
        height: height + 'px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'var(--mui-palette-background-default)',
      }}
      className="preLoading"
    >
      <Brand
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-50px auto auto -50px',
          zIndex: 10,
        }}
        width="100px"
        height="100px"
        version="signature"
        gradient
        className="GradientAnimation"
      />
      <Brand
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-50px auto auto -50px',
        }}
        width="100px"
        height="100px"
        version="signature"
        className="baseAnimation"
      />
    </Grid>
  );
};

export default PreLoading;
