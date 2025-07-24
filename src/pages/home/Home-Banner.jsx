import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Marquee } from '@devnomic/marquee';
import '@devnomic/marquee/dist/index.css';
import { useAlert } from '../../hooks/alertContext';
import SkeletonMUP from '../../components/skeleton/skeleton';

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
          <div className="marquee">
            <Marquee
              fade={false}
              direction="up"
              className="gap-[0rem] [--duration:10s]"
              innerClassName="motion-reduce:animate-none motion-reduce:first:hidden"
            >
              <Grid container spacing={3} sx={{ marginBottom: '25px' }}>
                {data && data.content.random_thumbnails.length > 0
                  ? data.content.random_thumbnails.map(({ id, full_url }) => (
                      <Grid size={6} key={id}>
                        <img
                          className="item"
                          src={full_url}
                          style={{ width: '100%' }}
                        />
                      </Grid>
                    ))
                  : 'Não encontrei nada por aqui...'}
              </Grid>
            </Marquee>
          </div>
        </>
      )}
    </Box>
  );
};

export default React.memo(HomeBanner);
