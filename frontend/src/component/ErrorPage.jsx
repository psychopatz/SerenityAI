import React from 'react';
import { styled } from '@mui/system';
import { Box, Typography, Button, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: 'transparent',
  padding: '0 20px',
  position: 'relative',
  maxWidth: '100%', 
  overflow: 'hidden', 

  // Add a pseudo-element for the vignette effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // Allows interactions to pass through
    background: 'radial-gradient(circle, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.5) 100%)',
    zIndex: 1, // Places the vignette below the content
  },

  // Ensure child content appears above the vignette
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: '80px',
  color: theme.palette.error.main,
  marginBottom: '20px',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  marginBottom: '16px',
  color: theme.palette.text.secondary,
}));

const BackButton = styled(Button)({
  marginTop: '20px',
});

const ErrorPage = () => {
  const theme = useTheme();

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <ErrorContainer>
      <ErrorIcon />
      <StyledTypography variant="h1" component="h1" gutterBottom>
        Oops! Something went wrong.
      </StyledTypography>
      <ErrorMessage variant="h5">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </ErrorMessage>
      <BackButton variant="contained" color="primary" onClick={handleGoBack}>
        Go Back
      </BackButton>
    </ErrorContainer>
  );
};

export default ErrorPage;
