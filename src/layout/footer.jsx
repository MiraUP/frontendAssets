import { Fab, Grid, Tooltip, useScrollTrigger, Zoom } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/icon/icon';

const Footer = () => {
  const scroll = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ position: 'relative', margin: '25px 0' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: 'center' }}>
          <p>Todos os direitos reservados</p>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: 'center' }}>
          <p>
            <Link to="#" className="link">
              <Icon icon="file-document" size={25} />
              <span style={{ marginLeft: '10px' }}>Termos de uso</span>
            </Link>
          </p>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }} sx={{ textAlign: 'center' }}>
          <p>
            <Link to="#" className="link">
              <Icon icon="email" size={25} />
              <span style={{ marginLeft: '10px' }}>Entre em contato</span>
            </Link>
          </p>
        </Grid>
      </Grid>
      <Zoom in={scroll} timeout={300} unmountOnExit>
        <Tooltip title="Voltar ao topo da página">
          <Fab
            aria-label="Voltar ao topo da página"
            className="btn-top-page"
            onClick={handleScrollTop}
          >
            <Icon icon="arrow-up" color="var(--mui-palette-white-main)" />
          </Fab>
        </Tooltip>
      </Zoom>
    </footer>
  );
};

export default Footer;
