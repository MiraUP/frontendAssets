import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import SkeletonMUP from '../../components/skeleton/skeleton';
import { Link } from 'react-router-dom';

const EditAssetBanner = ({ asset, loading }) => {
  if (loading) {
    return (
      <Container>
        <SkeletonMUP width="100%" height={400} />
      </Container>
    );
  } else {
    return (
      <Container
        className="edit-banner page-anima"
        sx={{ backgroundImage: `url(${asset.thumbnail && asset.thumbnail})` }}
      >
        <Box className="edit-banner-content">
          <Typography component="h1" variant="h2" className="edit-banner-title">
            {asset.title && asset.title}
          </Typography>
          <Typography
            component="p"
            variant="body"
            className="edit-banner-title"
          >
            Edite os dados do Ativo. Se tiver dúvidas,{' '}
            <Link to="#" className="link">
              clique aqui
            </Link>
            .
          </Typography>
        </Box>
      </Container>
    );
  }
};

export default EditAssetBanner;
