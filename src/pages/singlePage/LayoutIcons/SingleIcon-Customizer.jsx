import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Container,
  Grid,
  Grow,
  Input,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Slider,
  TextField,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import React from 'react';
import { useIcon } from '../../../hooks/iconContext';
import Icon from '../../../components/icon/icon';
import SvgEditor from '../../../components/icon/svgEditor';
import { useAlert } from '../../../hooks/alertContext';
import { BaseColors } from '../../../theme/theme';
import RotationCustom from '../../../components/customElements/rotation';
import SizeCustom from '../../../components/customElements/size';
import OpacityCustom from '../../../components/customElements/opacity';
import StrokeWeight from '../../../components/customElements/stroke';
import ColorsCustom from '../../../components/customElements/colors';

const SingleIconCustomizer = ({ previews }) => {
  const { mode } = useColorScheme();
  const { icon, codeIcon, styleIcon, setStyleIcon } = useIcon();
  const iconSelected = previews.filter(
    (preview) => preview.id === icon.idIcon,
  )[0];
  const showAlert = useAlert();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const copyClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        showAlert('Ícone copiado para a área de transferência!', 'success');
      })
      .catch((err) => {
        console.error('Erro ao copiar código: ', err);
        showAlert('Erro ao copiar ícone. Verifique o console.', 'error');
      });
  };

  const handleToggleDownload = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const downloadImage = async (format) => {
    if (!iconSelected) return;

    try {
      if (format === 'svg') {
        // Caso especial para SVG - não precisa de canvas
        const blob = new Blob([codeIcon], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `icon-${icon.nameFile}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url); // Liberar memória
      } else {
        // Processo para PNG/JPEG (usando canvas)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgBlob = new Blob([codeIcon], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          let mimeType, fileExtension;
          if (format === 'png') {
            mimeType = 'image/png';
            fileExtension = 'png';
          } else {
            mimeType = 'image/jpeg';
            fileExtension = 'jpg';
          }

          const dataUrl = canvas.toDataURL(mimeType);
          const link = document.createElement('a');
          link.download = `icon-${icon.nameFile}.${fileExtension}`;
          link.href = dataUrl;
          link.click();
        };

        img.src = url;
      }

      showAlert(
        `Download do ícone em ${format.toUpperCase()} iniciado!`,
        'success',
      );
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      showAlert(`Erro ao gerar imagem ${format.toUpperCase()}`, 'error');
    }
  };

  const resetCustom = () => {
    setStyleIcon({
      width: 100,
      height: 100,
      opacity: 1,
      rotate: 0,
      viewBox: 32,
      horizontalFlip: false,
      verticalFlip: false,
      strokeWidth: 2,
      linecap: 'round',
      linejoin: 'round',
      classStrokePrimary: 'cls-1',
      classStrokeSecondary: 'cls-3',
      classFillPrimary: 'cls-2',
      classFillSecondary: 'cls-4',
      colorStrokePrimary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
      colorStrokeSecondary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
      colorFillPrimary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
      colorFillSecondary:
        mode === 'dark' ? BaseColors.White.main : BaseColors.Black.main,
    });
  };

  if (icon.idIcon > 0) {
    return (
      <div className="sticky">
        <Container
          className="content-group"
          sx={{ paddingBottom: '0 !important' }}
        >
          <Grid container className="content">
            <Box className="content-group custom-tumbnail">
              {iconSelected !== undefined && (
                <SvgEditor svgUrl={iconSelected.url} />
              )}
              <ButtonGroup
                size="xsmall"
                variant="contained"
                fullWidth
                disableElevation
              >
                <Tooltip title="CTRL + C">
                  <Button
                    startIcon={<Icon icon="copy" />}
                    color="neutral"
                    onClick={() => copyClipboard(codeIcon)}
                  >
                    Copiar
                  </Button>
                </Tooltip>
                <Button
                  startIcon={<Icon icon="download" />}
                  color="success"
                  aria-controls={open ? 'split-button-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-label="Selecione o tipo de arquivo"
                  aria-haspopup="menu"
                  onClick={handleToggleDownload}
                  ref={anchorRef}
                >
                  Baixar
                </Button>
              </ButtonGroup>
              <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: 'top center',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius:
                          placement === 'bottom'
                            ? '0 0 4px 4px !important'
                            : '4px 4px 0 0 !important',
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          id="split-button-menu"
                          autoFocusItem
                          sx={{ p: 0 }}
                        >
                          <MenuItem onClick={() => downloadImage('svg')}>
                            SVG
                          </MenuItem>
                          <MenuItem onClick={() => downloadImage('png')}>
                            PNG
                          </MenuItem>
                          <MenuItem onClick={() => downloadImage('jpeg')}>
                            JPEG
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          </Grid>
        </Container>
        <div className="overflow-auto scrollbar-simple">
          <div className="scroll-config">
            <Container className="content-group">
              <Grid container className="content">
                <Box className="content-group">
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      margin: '25px 0',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ marginBottom: '0 !important' }}
                    >
                      <Icon icon="brush" size={30} /> Customização
                    </Typography>
                    <Button
                      variant="contained"
                      size="xsmall"
                      onClick={() => resetCustom()}
                    >
                      Resetar
                    </Button>
                  </Box>
                  <Box className="custom-setting">
                    {/* Cromia */}
                    <Accordion defaultExpanded elevation={0}>
                      <AccordionSummary
                        expandIcon={<Icon icon="arrow-down-simple" />}
                        aria-controls="panelColor-content"
                        id="panelColor-header"
                      >
                        <Typography component="span" variant="body2">
                          Cores
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ColorsCustom />
                      </AccordionDetails>
                    </Accordion>

                    {/* Traçado */}
                    <Accordion elevation={0}>
                      <AccordionSummary
                        expandIcon={<Icon icon="arrow-down-simple" />}
                        aria-controls="panelStroke-content"
                        id="panelStroke-header"
                      >
                        <Typography component="span" variant="body2">
                          Traçado
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <StrokeWeight />
                      </AccordionDetails>
                    </Accordion>

                    {/* Aparência */}
                    <Accordion elevation={0}>
                      <AccordionSummary
                        expandIcon={<Icon icon="arrow-down-simple" />}
                        aria-controls="panelAppearance-content"
                        id="panelAppearance-header"
                      >
                        <Typography component="span" variant="body2">
                          Aparência
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <SizeCustom />
                        <RotationCustom />
                        <OpacityCustom />
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Box>
              </Grid>
            </Container>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="scroll scrollbar-simple">
        <div className="scroll-config">
          <Container className="content-group">
            <Grid container className="content">
              <Box className="content-group">
                <Typography
                  variant="h4"
                  textAlign="center"
                  sx={{ display: 'block' }}
                >
                  Selecione um ícone
                </Typography>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <Icon icon="question" size={150} stroke={1.5} />
                </div>
              </Box>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
};

export default SingleIconCustomizer;
