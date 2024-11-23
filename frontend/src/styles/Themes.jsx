// AppThemeProvider.jsx
import { createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import React from 'react';
import AnimatedBackground from './AnimatedBackground'; // Import the component

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
        overflow: 'hidden', // Hide scrollbars to prevent scrolling
      },
    }}
  />
);

const AppThemeProvider = ({ children }) => (
  <React.Fragment>
    <CssBaseline />
    <GlobalStyle />
    <AnimatedBackground /> {/* Include the animated background */}
    {children}
  </React.Fragment>
);

export { theme, AppThemeProvider };
