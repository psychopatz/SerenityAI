import { createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import {svgBackground} from './SvgAssets'
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default Material-UI blue
    },
    secondary: {
      main: '#9c27b0', // Default Material-UI purple
    },
    error: {
      main: '#d32f2f', // Default Material-UI red
    },
    warning: {
      main: '#ed6c02', // Default Material-UI orange
    },
    info: {
      main: '#0288d1', // Default Material-UI light blue
    },
    success: {
      main: '#2e7d32', // Default Material-UI green
    },
    background: {
      default: '#f5f5f5', // Light grey background
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});



const GlobalStyle = () => (
    <GlobalStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        body: {
          margin: 0,
          overflow: 'auto', // Disable scrolling
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svgBackground)}")`, // Embed the SVG background here
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', // Prevent repetition
          backgroundAttachment: 'fixed', 
        },
      }}
    />
  );
  

const AppThemeProvider = ({ children }) => (
  <>
    <CssBaseline />
    <GlobalStyle />
    {children}
  </>
);

export { theme, AppThemeProvider };
