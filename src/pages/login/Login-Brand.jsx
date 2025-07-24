import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MouseParallax } from 'react-just-parallax';
import { useColorScheme } from '@mui/material/styles';
import Brand from '../../components/brand/brand';
import SecurityIllustration from '../../assets/img/illustrations/security.svg?react';
import Graphic01 from '../../assets/img/graphic/graphic-01.png';
import Graphic02 from '../../assets/img/graphic/graphic-02.png';
import Graphic03 from '../../assets/img/graphic/graphic-03.png';
import { Box } from '@mui/material';

const PageLoginBrand = () => {
  const location = useLocation();
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const Illustration = () => {
    if (
      location.pathname === '/login' ||
      location.pathname === '/criar-conta' ||
      location.pathname === '/criar-conta/codigo'
    ) {
      return <Brand style={{ width: '250px' }} version="extended" />;
    } else {
      return (
        <>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Brand style={{ width: '250px' }} version="extended" />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              width: '100%',
            }}
          ></Box>
        </>
      );
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <MouseParallax
        enableOnTouchDevice
        isAbsolutelyPositioned
        lerpEase={0.014}
        strength={0.15}
      >
        <img
          src={Graphic02}
          alt=""
          style={{
            position: 'absolute',
            top: '-200px',
            left: '-200px',
            width: '125px',
          }}
        />
      </MouseParallax>
      <Illustration />
      <MouseParallax
        enableOnTouchDevice
        isAbsolutelyPositioned
        lerpEase={0.014}
        strength={-0.14}
        zIndex={-1}
      >
        <img
          src={Graphic03}
          alt=""
          style={{
            position: 'absolute',
            top: '-100px',
            left: '350px',
            width: '300px',
          }}
        />
      </MouseParallax>
      <MouseParallax
        enableOnTouchDevice
        isAbsolutelyPositioned
        lerpEase={0.014}
        strength={0.04}
        zIndex={-1}
      >
        <img
          src={Graphic01}
          alt=""
          style={{
            position: 'absolute',
            left: '-130px',
            top: '235px',
            width: '75px',
          }}
        />
      </MouseParallax>
    </div>
  );
};

export default PageLoginBrand;
