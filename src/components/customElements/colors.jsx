import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  ButtonGroup,
  ClickAwayListener,
  Popper,
  Grow,
  Paper,
} from '@mui/material';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useIcon } from '../../hooks/iconContext';
import { BaseColors } from '../../theme/theme';
import Icon from '../icon/icon';

const ColorsCustom = () => {
  const { styleIcon, setStyleIcon } = useIcon();
  const [open, setOpen] = React.useState(false);
  const [currentElement, setCurrentElement] = React.useState('');
  const anchorRefs = React.useRef({});

  const elementsColors = [
    'StrokePrimary',
    'StrokeSecondary',
    'FillPrimary',
    'FillSecondary',
  ];

  const getContrastColor = (hexColor) => {
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? BaseColors.Black.main : BaseColors.White.main;
  };

  const handleColorChange = (color) => {
    if (currentElement === 'StrokePrimary') {
      setStyleIcon((prev) => ({ ...prev, colorStrokePrimary: color }));
    } else if (currentElement === 'StrokeSecondary') {
      setStyleIcon((prev) => ({ ...prev, colorStrokeSecondary: color }));
    } else if (currentElement === 'FillPrimary') {
      setStyleIcon((prev) => ({ ...prev, colorFillPrimary: color }));
    } else if (currentElement === 'FillSecondary') {
      setStyleIcon((prev) => ({ ...prev, colorFillSecondary: color }));
    }
  };

  const handleColorAction = (el, color = null) => {
    if (color) {
      setStyleIcon((prev) => ({
        ...prev,
        [`color${el}`]: color,
      }));
    } else {
      setCurrentElement(el);
      setOpen(true);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (
      Object.values(anchorRefs.current).some(
        (ref) => ref && ref.contains && ref.contains(event.target),
      )
    ) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      // Foca no elemento que abriu o popper
      if (anchorRefs.current[currentElement]) {
        anchorRefs.current[currentElement].focus();
      }
    }
    prevOpen.current = open;
  }, [open, currentElement]);

  return (
    <>
      {elementsColors.map((el) => (
        <Box key={el} className="custom-group color-custom">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {el === 'StrokePrimary' && (
              <Typography component="p" variant="caption">
                Cor do traço'
              </Typography>
            )}
            {el === 'FillPrimary' && (
              <Typography component="p" variant="caption">
                Cor do preenchimento'
              </Typography>
            )}
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              width: '100% !important',
              padding: '5px 7px',
              backgroundColor: BaseColors.Black.main,
            }}
          >
            #
            <HexColorInput
              color={
                el === 'StrokePrimary'
                  ? styleIcon.colorStrokePrimary
                  : el === 'StrokeSecondary'
                  ? styleIcon.colorStrokeSecondary
                  : el === 'FillPrimary'
                  ? styleIcon.colorFillPrimary
                  : styleIcon.colorFillSecondary
              }
              onChange={(color) => handleColorAction(currentElement, color)}
            />
            {/* <Typography
              component="span"
              textTransform="uppercase"
              sx={{ margin: '0 !important' }}
            >
              {el === 'StrokePrimary'
                ? styleIcon.colorStrokePrimary
                : el === 'StrokeSecondary'
                ? styleIcon.colorStrokeSecondary
                : el === 'FillPrimary'
                ? styleIcon.colorFillPrimary
                : styleIcon.colorFillSecondary}
            </Typography> */}
            <Divider orientation="vertical" flexItem />
            <ButtonGroup disableElevation fullWidth>
              <Button
                variant="contained"
                size="xsmall"
                sx={{
                  background:
                    el === 'StrokePrimary'
                      ? styleIcon.colorStrokePrimary
                      : el === 'StrokeSecondary'
                      ? styleIcon.colorStrokeSecondary
                      : el === 'FillPrimary'
                      ? styleIcon.colorFillPrimary
                      : styleIcon.colorFillSecondary,
                }}
                ref={(ref) => (anchorRefs.current[el] = ref)}
                onClick={() => handleColorAction(el)}
              >
                <Icon
                  icon="paint-bucket"
                  size={20}
                  color={getContrastColor(
                    el === 'StrokePrimary'
                      ? styleIcon.colorStrokePrimary
                      : el === 'StrokeSecondary'
                      ? styleIcon.colorStrokeSecondary
                      : el === 'FillPrimary'
                      ? styleIcon.colorFillPrimary
                      : el === 'FillSecondary'
                      ? styleIcon.colorFillSecondary
                      : BaseColors.White.main,
                  )}
                />
              </Button>
              <Button
                variant="contained"
                size="xxsmall"
                color="cyan"
                fullWidth
                onClick={() => handleColorAction(el, BaseColors.Cyan.main)}
              />
              <Button
                variant="contained"
                size="xxsmall"
                color="violet"
                fullWidth
                onClick={() => handleColorAction(el, BaseColors.Violet.main)}
              />
              <Button
                variant="contained"
                size="xxsmall"
                color="red"
                fullWidth
                onClick={() => handleColorAction(el, BaseColors.Red.main)}
              />
              <Button
                variant="contained"
                size="xxsmall"
                color="orange"
                fullWidth
                onClick={() => handleColorAction(el, BaseColors.Orange.main)}
              />
            </ButtonGroup>
          </Stack>
        </Box>
      ))}
      <Popper
        open={open}
        anchorEl={anchorRefs.current[currentElement]}
        placement="top"
        transition
        disablePortal
        sx={{
          width: '200px',
          zIndex: 1,
        }}
        className="colors-custom-popper"
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'top center',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  background: 'none',
                  width: '200px',
                  height: '200px',
                }}
              >
                <HexColorPicker
                  color={
                    currentElement === 'StrokePrimary'
                      ? styleIcon.colorStrokePrimary
                      : currentElement === 'StrokeSecondary'
                      ? styleIcon.colorStrokeSecondary
                      : currentElement === 'FillPrimary'
                      ? styleIcon.colorFillPrimary
                      : currentElement === 'FillSecondary'
                      ? styleIcon.colorFillSecondary
                      : BaseColors.White.main
                  }
                  onChange={(color) => handleColorAction(currentElement, color)}
                />
              </Paper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ColorsCustom;
