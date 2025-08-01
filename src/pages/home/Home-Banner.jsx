import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useAlert } from '../../hooks/alertContext';
import SkeletonMUP from '../../components/skeleton/skeleton';

const VerticalMarquee = ({ children, speed = 50 }) => {
  const marqueeRef = React.useRef(null);

  React.useEffect(() => {
    const marquee = marqueeRef.current;
    let animationFrame;
    let position = 0;

    const animate = () => {
      position -= 0.5; // Controla a velocidade
      if (position <= -marquee.scrollHeight / 2) {
        position = 0;
      }
      marquee.style.transform = `translateY(${position}px) rotate(-5deg)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <Box
      ref={marqueeRef}
      sx={{
        overflow: 'hidden',
        transform: 'rotate(-5deg)',
        transformOrigin: 'center',
        '& > *': {
          willChange: 'transform',
        },
      }}
    >
      {children}
      {React.cloneElement(children, { key: 'clone' })}
    </Box>
  );
};

const HomeBanner = ({ data, loading }) => {
  const showAlert = useAlert();

  return (
    <Box component="section" className="page-anima banner-infinity">
      {loading ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            gap: 25,
            padding: '0 30px',
          }}
        >
          <SkeletonMUP width="50%" height="450px" num={3} />
        </div>
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
            }}
          >
            <Typography variant="h1" textAlign="center">
              {(data && data.content.posts) || '0'} itens
              <br />
              cadastrados
            </Typography>
            <Typography variant="body1" textAlign="center" mt={2}>
              Contribua com o nosso banco de Ativos Digitais.
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              height: '100%', // Ajuste conforme necessário
              overflow: 'hidden',
            }}
          >
            <div className="marquee">
              <VerticalMarquee speed={40}>
                <Grid container spacing={3} sx={{ marginBottom: '25px' }}>
                  {data?.content.random_thumbnails?.map(({ id, full_url }) => (
                    <Grid item size={6} key={id}>
                      <Box
                        sx={{
                          width: '100%',
                          transition: 'transform 0.3s ease',
                          backgroundImage: `url(${full_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          height: '500px',
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </VerticalMarquee>
            </div>
          </Box>
        </>
      )}
    </Box>
  );
};

export default React.memo(HomeBanner);
