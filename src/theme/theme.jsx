import { createTheme } from '@mui/material/styles';
import { darken, lighten, alpha } from '@mui/system';
import Icon from '../components/icon/icon';
import React from 'react';

const White = '#DFE0E4';
const Black = '#354050';
const Blue = '#3742F9';
const Violet = '#6610F2';
const Cyan = '#48DAFA';
const Green = '#1ABB9B';
const Red = '#BA3A31';
const Orange = '#F4A003';

export const BaseColors = {
  White: {
    main: White,
    c100: darken(White, 0.25),
    c100a200: alpha(darken(White, 0.25), 0.6),
    c200: darken(White, 0.1875),
    c300: darken(White, 0.125),
    c400: darken(White, 0.0625),
    c500: White,
    c600: lighten(White, 0.25),
    c700: lighten(White, 0.5),
    c800: lighten(White, 0.75),
    c900: lighten(White, 1),
    a100: alpha(White, 0.9),
    a130: alpha(White, 0.8),
    a160: alpha(White, 0.7),
    a200: alpha(White, 0.6),
    a300: alpha(White, 0.3),
    a400: alpha(White, 0),
  },
  Black: {
    main: Black,
    c100: darken(Black, 0.7),
    c100a100: alpha(darken(Black, 0.7), 0.9),
    c100a200: alpha(darken(Black, 0.7), 0.6),
    c200: darken(Black, 0.525),
    c200a100: alpha(darken(Black, 0.35), 0.9),
    c300: darken(Black, 0.35),
    c300a200: alpha(darken(Black, 0.35), 0.6),
    c400: darken(Black, 0.175),
    c400a100: alpha(darken(Black, 0.175), 0.9),
    c500: Black,
    c500a000: alpha(Black, 0),
    c600: lighten(Black, 0.05),
    c700: lighten(Black, 0.1),
    c800: lighten(Black, 0.15),
    c900: lighten(Black, 0.2),
    c900a200: alpha(lighten(Black, 0.2), 0.6),
    a100: alpha(Black, 0.9),
    a130: alpha(Black, 0.8),
    a160: alpha(Black, 0.7),
    a200: alpha(Black, 0.6),
    a300: alpha(Black, 0.3),
    a400: alpha(Black, 0),
  },
  Blue: {
    main: Blue,
    c100: darken(Blue, 0.2),
    c200: darken(Blue, 0.15),
    c300: darken(Blue, 0.1),
    c400: darken(Blue, 0.05),
    c500: Blue,
    c600: lighten(Blue, 0.05),
    c700: lighten(Blue, 0.1),
    c800: lighten(Blue, 0.15),
    c900: lighten(Blue, 0.2),
    c900a200: alpha(lighten(Blue, 0.2), 0.6),
    a100: alpha(Blue, 0.9),
    a200: alpha(Blue, 0.6),
    a300: alpha(Blue, 0.3),
    a400: alpha(Blue, 0),
  },
  Violet: {
    main: Violet,
    c100: darken(Violet, 0.2),
    c100a160: alpha(darken(Violet, 0.2), 0.7),
    c200: darken(Violet, 0.15),
    c300: darken(Violet, 0.1),
    c400: darken(Violet, 0.05),
    c500: Violet,
    c600: lighten(Violet, 0.05),
    c700: lighten(Violet, 0.1),
    c800: lighten(Violet, 0.15),
    c900: lighten(Violet, 0.2),
    a100: alpha(Violet, 0.9),
    a200: alpha(Violet, 0.6),
    a300: alpha(Violet, 0.3),
    a400: alpha(Violet, 0),
  },
  Cyan: {
    main: Cyan,
    c100: darken(Cyan, 0.4),
    c200: darken(Cyan, 0.3),
    c300: darken(Cyan, 0.2),
    c400: darken(Cyan, 0.1),
    c500: Cyan,
    c600: lighten(Cyan, 0.15),
    c700: lighten(Cyan, 0.3),
    c800: lighten(Cyan, 0.45),
    c900: lighten(Cyan, 0.6),
    a100: alpha(Cyan, 0.9),
    a200: alpha(Cyan, 0.6),
    a300: alpha(Cyan, 0.3),
    a400: alpha(Cyan, 0),
  },
  Green: {
    main: Green,
    c100: darken(Green, 0.4),
    c200: darken(Green, 0.3),
    c300: darken(Green, 0.2),
    c400: darken(Green, 0.1),
    c500: Green,
    c600: lighten(Green, 0.1),
    c700: lighten(Green, 0.2),
    c800: lighten(Green, 0.3),
    c900: lighten(Green, 0.4),
    a100: alpha(Green, 0.9),
    a200: alpha(Green, 0.6),
    a300: alpha(Green, 0.3),
    a400: alpha(Green, 0),
  },
  Red: {
    main: Red,
    c100: darken(Red, 0.4),
    c200: darken(Red, 0.3),
    c300: darken(Red, 0.2),
    c400: darken(Red, 0.1),
    c500: Red,
    c600: lighten(Red, 0.05),
    c700: lighten(Red, 0.1),
    c800: lighten(Red, 0.15),
    c900: lighten(Red, 0.2),
    a100: alpha(Red, 0.9),
    a200: alpha(Red, 0.6),
    a300: alpha(Red, 0.3),
    a400: alpha(Red, 0),
  },
  Orange: {
    main: Orange,
    c100: darken(Orange, 0.4),
    c200: darken(Orange, 0.3),
    c300: darken(Orange, 0.2),
    c400: darken(Orange, 0.1),
    c500: Orange,
    c600: lighten(Orange, 0.1),
    c700: lighten(Orange, 0.2),
    c800: lighten(Orange, 0.3),
    c900: lighten(Orange, 0.4),
    a100: alpha(Orange, 0.9),
    a200: alpha(Orange, 0.6),
    a300: alpha(Orange, 0.3),
    a400: alpha(Orange, 0),
  },
};

const ButtonsColors = {
  Blue: {
    main: BaseColors.Blue.main,
    light: BaseColors.Blue.c700,
    dark: BaseColors.Blue.c300,
    darker: BaseColors.Blue.c100,
    contrastText: BaseColors.White.main,
  },
  Violet: {
    main: BaseColors.Violet.main,
    light: BaseColors.Violet.c700,
    dark: BaseColors.Violet.c300,
    darker: BaseColors.Violet.c100,
    contrastText: BaseColors.White.main,
  },
  Green: {
    main: BaseColors.Green.main,
    light: BaseColors.Green.c700,
    dark: BaseColors.Green.c300,
    darker: BaseColors.Green.c100,
    contrastText: BaseColors.Black.main,
  },
  Cyan: {
    main: BaseColors.Cyan.main,
    light: BaseColors.Cyan.c700,
    dark: BaseColors.Cyan.c300,
    darker: BaseColors.Cyan.c100,
    contrastText: BaseColors.Black.main,
  },
  Red: {
    main: BaseColors.Red.main,
    light: BaseColors.Red.c700,
    dark: BaseColors.Red.c300,
    darker: BaseColors.Red.c100,
    contrastText: BaseColors.White.main,
  },
  Orange: {
    main: BaseColors.Orange.main,
    light: BaseColors.Orange.c700,
    dark: BaseColors.Orange.c300,
    darker: BaseColors.Orange.c100,
    contrastText: BaseColors.Black.main,
  },
  White: {
    main: BaseColors.White.main,
    light: BaseColors.White.c900,
    dark: BaseColors.White.c400,
    darker: BaseColors.White.c100,
    contrastText: BaseColors.Black.main,
  },
  Black: {
    main: BaseColors.Black.main,
    light: BaseColors.Black.c900,
    dark: BaseColors.Black.c400,
    darker: BaseColors.Black.c100,
    contrastText: BaseColors.White.main,
  },
};

const Theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        text: {
          primary: BaseColors.White.main,
          secondary: BaseColors.White.c600,
          disabled: BaseColors.White.c100,
        },
        background: {
          default: BaseColors.Black.main,
          paper: BaseColors.Black.c900,
          contrast: BaseColors.White.main,
          tooltip: BaseColors.Black.c400,
          backdrop: BaseColors.Black.c100a100,
          border: BaseColors.Black.c900a200,
        },
        main: BaseColors.Cyan.main,
        contrastMain: BaseColors.Black.main,
        default: ButtonsColors.White,
        primary: ButtonsColors.Blue,
        secondary: ButtonsColors.Violet,
        success: ButtonsColors.Green,
        info: ButtonsColors.Cyan,
        error: ButtonsColors.Red,
        warning: ButtonsColors.Orange,
        white: BaseColors.White,
        black: BaseColors.Black,
        blue: BaseColors.Blue,
        violet: BaseColors.Violet,
        cyan: BaseColors.Cyan,
        green: BaseColors.Green,
        red: BaseColors.Red,
        orange: BaseColors.Orange,
        divider: {
          primary: BaseColors.Cyan.main,
          neutral: BaseColors.Black.c700,
        },
      },
    },
    light: {
      palette: {
        text: {
          primary: BaseColors.Black.main,
          secondary: BaseColors.Black.c600,
          disabled: BaseColors.Black.c900,
        },
        background: {
          default: BaseColors.White.main,
          paper: BaseColors.White.c800,
          contrast: BaseColors.Black.main,
          tooltip: BaseColors.White.c400,
          backdrop: 'rgba(181,182,185,.5)',
          border: BaseColors.White.c100a200,
        },
        main: BaseColors.Blue.main,
        contrastMain: BaseColors.White.main,
        primary: ButtonsColors.Blue,
        secondary: ButtonsColors.Violet,
        success: ButtonsColors.Green,
        info: ButtonsColors.Cyan,
        error: ButtonsColors.Red,
        warning: ButtonsColors.Orange,
        white: BaseColors.White,
        black: BaseColors.Black,
        blue: BaseColors.Blue,
        violet: BaseColors.Violet,
        cyan: BaseColors.Cyan,
        green: BaseColors.Green,
        red: BaseColors.Red,
        orange: BaseColors.Orange,
        default: ButtonsColors.Black,
        divider: {
          primary: BaseColors.Blue.main,
          neutral: BaseColors.White.c300,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Open sans", sans-serif',
    fontSize: 14,
    lineHeight: '28px',
    h1: {
      fontFamily: '"Ubuntu", sans-serif',
      fontSize: 64,
      fontWeight: 900,
      lineHeight: '64px',
      letterSpacing: '-2%',
    },
    h2: {
      fontFamily: '"Ubuntu", sans-serif',
      fontSize: 36,
      fontWeight: 600,
      lineHeight: '50px',
      letterSpacing: '0',
    },
    h3: {
      fontFamily: '"Ubuntu", sans-serif',
      fontSize: 24,
      fontWeight: 600,
      lineHeight: '22px',
      letterSpacing: '0',
    },
    h4: {
      fontFamily: '"Ubuntu", sans-serif',
      fontSize: 20,
      fontWeight: 900,
      lineHeight: '22px',
      letterSpacing: '0',
    },
    h5: {
      fontFamily: '"Ubuntu", sans-serif',
      fontSize: 16,
      fontWeight: 700,
      lineHeight: '22px',
      letterSpacing: '',
    },
    subtitle1: {
      fontFamily: '"Ubuntu", sans-serif',
      fontSize: 24,
      fontWeight: 200,
      lineHeight: '50px',
      letterSpacing: '',
    },
    button: {
      fontFamily: '"Ubuntu", sans-serif',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      variants: [
        {
          props: { size: 'large' },
          style: { fontSize: '24px', padding: '30px 60px', fontWeight: 700 },
        },
        {
          props: { size: 'medium' },
          style: { fontSize: '20px', padding: '22px 50px', fontWeight: 600 },
        },
        {
          props: { size: 'small' },
          style: { fontSize: '16px', padding: '10px 15px', fontWeight: 500 },
        },
        {
          props: { size: 'xsmall' },
          style: { fontSize: '12px', padding: '5px', fontWeight: 300 },
        },
        {
          props: { size: 'xxsmall' },
          style: {
            fontSize: '10px',
            padding: '5px',
            minWidth: '0 !important',
            minHeight: '0 !important',
            fontWeight: 100,
          },
        },
        {
          props: { color: 'neutral', variant: 'contained' },
          style: {
            color: 'var(--mui-palette-text-primary)',
            backgroundColor: 'var(--mui-palette-background-default)',
          },
        },
        {
          props: { color: 'neutral', variant: 'outlined' },
          style: {
            color: 'var(--mui-palette-text-primary)',
            borderColor: 'var(--mui-palette-background-default)',
          },
        },
      ],
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: 'medium',
        exclusive: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          color: 'var(--mui-palette-text-primary)',
          borderRadius: 0,
          '& .MuiToggleButton-root': {
            color: 'var(--mui-palette-text-primary)',
            border: '0',
            '&:not(:last-child)': {
              borderRight: 'var(--mui-palette-divider-neutral) 1px solid',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--mui-palette-divider-neutral)',
              color: 'var(--mui-palette-text-primary)',
              fontWeight: 600,
            },
          },
          '& .MuiToggleButton-sizeMedium': {
            textTransform: 'none !important',
            fontWeight: 300,
            fontSize: '16px',
          },
          '& .MuiToggleButton-sizeSmall': {
            textTransform: 'none !important',
            fontSize: '14px',
          },
        }),
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: <Icon icon="arrow-down-simple" size={35} />,
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: 'var(--mui-palette-background-tooltip)',
          color: 'var(--mui-palette-text-primary)',
        }),
        arrow: ({ theme }) => ({
          color: 'var(--mui-palette-background-tooltip)',
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 400,
          background: 'var(--mui-palette-background-default)',
          color: 'var(--mui-palette-text-primary)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--mui-palette-background-backdrop)',
          backgroundImage: 'none',
          backdropFilter: 'blur(3px)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--breakpoint-xs': '0px',
          '--breakpoint-sm': '600px',
          '--breakpoint-md': '900px',
          '--breakpoint-lg': '1200px',
          '--breakpoint-xl': '1536px',
        },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
});

export default Theme;
