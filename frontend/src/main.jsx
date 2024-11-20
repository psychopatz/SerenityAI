import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { theme, AppThemeProvider } from './styles/Themes.jsx'; // Ensure the path to themes.jsx is correct
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </ThemeProvider>
  </StrictMode>
);

