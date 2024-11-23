import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import SAILogo from '../assets/SAILogo.png';
import Hand from '../assets/hand.png';
import Hand2 from '../assets/hand2.png';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    location: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await UserService.registerUser(registerData);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <img
        src={SAILogo}
        alt="SAI Logo"
        style={{
          position: 'absolute',
          bottom: '83%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          zIndex: 1,
        }}
      />

      {/* Decorative Images */}
      <img
        src={Hand}
        alt="Hand Left"
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '17%',
          height: '1000px',
          opacity: 0.8,
        }}
      />
      <img
        src={Hand2}
        alt="Hand Right"
        style={{
          position: 'absolute',
          top: '10%',
          right: '27%',
          height: '1000px',
          opacity: 0.8,
        }}
      />

      {/* Registration Form */}
      <Paper
        elevation={6}
        sx={{
          zIndex: 2,
          padding: 4,
          paddingTop: 4,
          maxWidth: '500px',
          width: '90%',
          borderRadius: '10px',
          textAlign: 'center',
          maxHeight: '75vh',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Create an Account
        </Typography>

        <Stack spacing={2} component="form" onSubmit={handleRegisterSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={registerData.firstName}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={registerData.lastName}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            value={registerData.email}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={registerData.password}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={registerData.dateOfBirth}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Gender"
            name="gender"
            value={registerData.gender}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Location"
            name="location"
            value={registerData.location}
            onChange={handleInputChange}
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Sign Up
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button
            onClick={() => navigate('/login')}
            variant="text"
            sx={{
              color: '#6a11cb',
              fontWeight: 'bold',
            }}
          >
            Log In
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
