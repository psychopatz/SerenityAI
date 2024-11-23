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
  // backdropFilter: 'blur(10px)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.4), transparent)',
    zIndex: -1,
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
