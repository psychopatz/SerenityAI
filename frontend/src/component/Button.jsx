import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: '3px',
  background: 'linear-gradient(90deg, #03a9f4, #f441a5)',
  borderRadius: '0.9em',
  transition: 'all 0.4s ease',
  '&:hover::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '0.9em',
    zIndex: -10,
    filter: 'blur(1.2em)',
    background: 'linear-gradient(90deg, #03a9f4, #f441a5)',
    transition: 'filter 0.4s ease',
  },
  '&:active::before': {
    filter: 'blur(0.2em)',
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '1.2em',
  padding: '0.4em 0.6em',
  borderRadius: '0.5em',
  backgroundColor: '#000',
  color: '#fff',
  cursor: 'pointer',
  boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.7)',
}));

const MyButton = () => {
  return (
    <StyledContainer sx={{ marginTop: '30px' }} >
      <CustomButton variant="contained" component={Link} to="/login" >Start Counseling</CustomButton>
    </StyledContainer>
  );
};

export default MyButton;
