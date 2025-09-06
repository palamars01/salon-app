'use client';

import { ThemeOptions, createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#4B9443',
    },
    secondary: {
      main: '#325928',
    },
    text: {
      primary: '#1A1E25',
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins)',
  },
};

export const theme = createTheme(themeOptions);
