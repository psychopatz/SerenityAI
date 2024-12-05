import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import StorageService from '../services/StorageService';
import Baymax from "../assets/Baymax.json";
import Lottie from "lottie-react";


const Auth = () => {
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const storage = StorageService();

  const handleInputChange = (e, isLogin) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveToLocal = (userdata) => {
    storage.setLocalStorage('userdata', userdata);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const loggedInUser = await UserService.loginUser(loginData);
      handleSaveToLocal(loggedInUser);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      if (errorMessage.includes('Invalid credentials')) {
        setLoginError('Invalid email or password. Please try again.');
      } else {
        setLoginError('Login failed. Please try again later.');
      }
    }
  };
  

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setSuccessMessage('');
    try {
      await UserService.registerUser(registerData);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        setIsPanelActive(false); // Redirect to the login panel
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      if (errorMessage.includes('Email already exists')) {
        setRegisterError('This email is already registered. Please use another email.');
      } else {
        setRegisterError('Registration failed. Please try again later.');
      }
    }
  };
  
  return (
    <><ToastContainer position="top-center" autoClose={3000} />
    <Box
    
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 4,
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '90%', md: '1000px' },
          height: '800px',
          display: 'flex',
          borderRadius: '15px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Register Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '30px',
            zIndex: 2,
            backgroundColor: '#ffffff',
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Create Account
          </Typography>
          {registerError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerError}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          <form onSubmit={handleRegisterSubmit} style={{ width: '100%', maxWidth: '500px' }}>
            <Stack spacing={3}>
              <TextField
                label="First Name"
                name="firstName"
                value={registerData.firstName}
                onChange={(e) => handleInputChange(e, false)}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={registerData.lastName}
                onChange={(e) => handleInputChange(e, false)}
                fullWidth
                required
              />
              <TextField
                label="Email"
                name="email"
                value={registerData.email}
                onChange={(e) => handleInputChange(e, false)}
                fullWidth
                required
              />
              <TextField
  label="Password"
  type={showPassword ? 'text' : 'password'}
  name="password"
  value={registerData.password}
  onChange={(e) => handleInputChange(e, false)}
  fullWidth
  required
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={registerData.dateOfBirth}
                onChange={(e) => handleInputChange(e, false)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl>
                <FormLabel component="legend" sx={{ marginBottom: '8px' }}>Gender</FormLabel>
                <TextField
                  select
                  label="Select Gender"
                  name="gender"
                  value={registerData.gender}
                  onChange={(e) => handleInputChange(e, false)}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </FormControl>

              <FormControl>
                <FormLabel component="legend" sx={{ marginBottom: '8px' }}>Location</FormLabel>
                <TextField
                  select
                  label="Select City"
                  name="location"
                  value={registerData.location}
                  onChange={(e) => handleInputChange(e, false)}
                  variant="outlined"
                  fullWidth
                  required
                >
                  <MenuItem value="Manila">Manila</MenuItem>
                  <MenuItem value="Cebu City">Cebu City</MenuItem>
                  <MenuItem value="Davao City">Davao City</MenuItem>
                  <MenuItem value="Quezon City">Quezon City</MenuItem>
                  <MenuItem value="Makati">Makati</MenuItem>
                  <MenuItem value="Taguig">Taguig</MenuItem>
                  <MenuItem value="Pasig">Pasig</MenuItem>
                  <MenuItem value="Mandaluyong">Mandaluyong</MenuItem>
                  <MenuItem value="Baguio City">Baguio City</MenuItem>
                  <MenuItem value="Iloilo City">Iloilo City</MenuItem>
                  <MenuItem value="Dumaguete">Dumaguete</MenuItem>
                  <MenuItem value="Zamboanga City">Zamboanga City</MenuItem>
                  <MenuItem value="Cagayan de Oro">Cagayan de Oro</MenuItem>
                  <MenuItem value="Tagbilaran">Tagbilaran</MenuItem>
                  <MenuItem value="Tarlac City">Tarlac City</MenuItem>
                  <MenuItem value="Naga City">Naga City</MenuItem>
                  <MenuItem value="General Santos">General Santos</MenuItem>
                </TextField>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  padding: '12px 0',
                  fontSize: '1rem',
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Login Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex',
            padding: '30px',
            zIndex: 2,
            backgroundColor: '#ffffff',
            
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={3} >
            Sign In
          </Typography>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          <form onSubmit={handleLoginSubmit} style={{ width: '100%', maxWidth: '500px' }}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={loginData.email}
                onChange={(e) => handleInputChange(e, true)}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginData.password}
                onChange={(e) => handleInputChange(e, true)}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  padding: '12px 0',
                  fontSize: '1rem',
                }}
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Sliding Overlay Panel */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: isPanelActive ? '50%' : '0%',
            width: '50%',
            height: '100%',
            transition: 'left 0.6s ease-in-out',
            zIndex: 3,
            background: isPanelActive
              ? 'linear-gradient(to right, #ff416c, #ff4b2b)'
              : 'linear-gradient(to right, #2193b0, #6dd5ed)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '1.2rem',
            padding: '20px',
          }}
        >
          <Box textAlign="center" p={4}>
          <Lottie animationData={Baymax} loop={true} style={{ width: "50%", marginLeft: "80px", position: "absolute", top: "90px",  filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5))" }} />

  {isPanelActive ? (
    
    <>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Ready to Reconnect?
      </Typography>
      <Typography mb={3}>
        We've missed you! Log in now to pick up where you left off.
      </Typography>
      <Button
        variant="outlined"
        sx={{
          color: '#fff',
          borderColor: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
        onClick={() => setIsPanelActive(false)}
      >
        Go to Login
      </Button>
    </>
  ) : ( 
    <>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Welcome to SerenityAI!
      </Typography>
      <Typography mb={3}>
        Join us today and start your journey toward emotional well-being.
      </Typography>
      <Button
        variant="outlined"
        sx={{
          color: '#fff',
          borderColor: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
        onClick={() => setIsPanelActive(true)}
      >
        Create Account
      </Button>
    </>
  )}
</Box>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default Auth;