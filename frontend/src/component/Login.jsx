import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import StorageService from '../services/StorageService';
import SAILogo from '../assets/SAILogo.png';
import Hand from '../assets/hand.png';
import Hand2 from '../assets/hand2.png';

const Login = ({ toggleToRegister }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const storage = StorageService();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSaveToLocal = (userdata) => {
    storage.setLocalStorage('userdata', userdata);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loggedInUser = await UserService.loginUser(loginData);
      console.log('Logged in:', loggedInUser);
      handleSaveToLocal(loggedInUser);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
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
          bottom: '70%',
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
          bottom: '30%',
          left: '25%',
          height: '700px',
          width: 'auto',
          opacity: 1.0,
        }}
      />
      <img
        src={Hand2}
        alt="Hand Right"
        style={{
          position: 'absolute',
          top: '20%',
          right: '32%',
          height: '700px',
          width: 'auto',
          opacity: 1.0,
        }}
      />

      {/* Login Form */}
      <Paper
        elevation={6}
        sx={{
          zIndex: 2,
          padding: 4,
          maxWidth: '400px',
          width: '90%',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Please log in to your account.
        </Typography>

        <Stack spacing={3} component="form" onSubmit={handleLoginSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Log In
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{' '}
          <Button
            onClick={() => navigate('/register')}
            variant="text"
            sx={{
              color: '#6a11cb',
              fontWeight: 'bold',
            }}
          >
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
