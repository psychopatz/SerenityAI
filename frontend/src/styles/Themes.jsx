import { createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
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

const svgBackground = `
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="560" viewBox="0 0 1440 560">
<style>
        @keyframes float1 { 
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(50px, -30px); }
            50% { transform: translate(-70px, 40px); }
            75% { transform: translate(30px, -20px); }
        }
        @keyframes float2 { 
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-40px, 20px); }
            50% { transform: translate(60px, -50px); }
            75% { transform: translate(-30px, 40px); }
        }
        @keyframes float3 { 
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(70px, -10px); }
            50% { transform: translate(-50px, 30px); }
            75% { transform: translate(40px, -40px); }
        }
        .float1 { animation: float1 10s infinite alternate ease-in-out; }
        .float2 { animation: float2 12s infinite alternate ease-in-out; }
        .float3 { animation: float3 8s infinite alternate ease-in-out; }
</style>
<rect width="1440" height="560" fill="#32325d"/>
<defs>
<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#ab3c51"/>
<stop offset="100%" stop-color="#4f4484"/>
</linearGradient>
<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#e298de"/>
<stop offset="100%" stop-color="#484687"/>
</linearGradient>
<linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#84b6e0"/>
<stop offset="100%" stop-color="#464a8f"/>
</linearGradient>
</defs>
<circle class="float1" cx="1040" cy="227" r="40" fill="url(#grad1)"/>
<circle class="float2" cx="871" cy="442" r="45" fill="url(#grad2)"/>
<circle class="float3" cx="1082" cy="310" r="43" fill="url(#grad3)"/>
<circle class="float1" cx="1371" cy="112" r="40" fill="url(#grad1)"/>
<circle class="float2" cx="1027" cy="9" r="33" fill="url(#grad2)"/>
<circle class="float3" cx="646" cy="370" r="47" fill="url(#grad3)"/>
<circle class="float1" cx="777" cy="494" r="31" fill="url(#grad1)"/>
<circle class="float2" cx="755" cy="191" r="40" fill="url(#grad2)"/>
<circle class="float3" cx="273" cy="113" r="32" fill="url(#grad3)"/>
<circle class="float1" cx="330" cy="539" r="26" fill="url(#grad1)"/>
</svg>
`;

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
          overflow: 'hidden', // Disable scrolling
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svgBackground)}")`, // Embed the SVG background here
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', // Prevent repetition
          backgroundAttachment: 'fixed', // Make the background fixed
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
