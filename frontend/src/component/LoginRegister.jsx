import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    MenuItem,
    Box,
    Alert,
    Stack,
    Paper,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {Visibility, VisibilityOff } from '@mui/icons-material';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import SAILogo from '../assets/SAILogo.png';
import Hand from '../assets/hand.png';
import Hand2 from '../assets/hand2.png';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
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
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isLogin) {
            setLoginData((prev) => ({ ...prev, [name]: value }));
        } else {
            setRegisterData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loggedInUser = await UserService.loginUser(loginData);
            console.log('Logged in:', loggedInUser);
            localStorage.setItem('userEmail', loggedInUser.email);  // assuming loggedInUser contains email
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            console.error('Login failed:', error);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage(''); // Clear any previous success message

        try {
            await UserService.registerUser(registerData);
            setSuccessMessage('Registration successful! Redirecting to login...'); // Show success message
            setTimeout(() => {
                setIsLogin(true); // Switch to login after 3 seconds
                setRegisterData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    dateOfBirth: '',
                    gender: '',
                    location: '',
                }); // Clear the register form
                setSuccessMessage(''); // Clear the success message after redirection
            }, 3000); // Show success message for 3 seconds before redirecting
        } catch (error) {
            // Handle errors for existing email or name
            if (error.response?.data?.message.includes('Email already taken')) {
                setError('This email is already taken');
            } else {
                setError('Registration failed');
            }
            console.error('Registration failed:', error);
        }
    };

    

    return (
        <Box
    sx={{
        backgroundColor: '#0014FF',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }}
>
{isLogin && (
        <img
            src={SAILogo}
            alt="SAI Logo"
            style={{
                position: 'absolute',
                top: '13%', // Adjust as needed
                transform: 'translateY(-50%) ',
                width: '170px',
                height: 'auto',
            }}
        />
    )}

{isLogin && (
<img 
    src={Hand} 
    alt="Hand" 
    style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '310px',
        height: '500px',
        
     }} 
     
    />
)}

{isLogin && (
<img 
    src={Hand2} 
    alt="Hand" 
    style={{ 
        position: 'absolute', 
        right: '390px',
        height: '600px',
        bottom: '10px',
        
     }} 
    />
)}

    <Paper
        elevation={6}
        sx={{
            p: 4,
            maxWidth: 450,
            width: '100%',
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'white',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)', // Add subtle shadow
           // maxHeight: '670px',
        }}
    >
        
        <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
                fontWeight: 'bold',
                color: '#333',
            }}
        >
            {isLogin ? 'Welcome Back' : 'Create an Account'}
        </Typography>
        <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: '#666' }}
        >
            {isLogin
                ? 'Please log in to your account.'
                : 'Fill in the details to create your account.'}
        </Typography>

        <Stack
            spacing={3}
            component="form"
            onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
            sx={{
                width: '100%',
            }}
        >
            {!isLogin && (
                <>
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
                        label="Date of Birth"
                        type="date"
                        name="dateOfBirth"
                        value={registerData.dateOfBirth}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                    />
                    <TextField
                        select
                        label="Gender"
                        name="gender"
                        value={registerData.gender}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                        label="Location"
                        name="location"
                        value={registerData.location}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </>
            )}
            <TextField
                label="Email"
                type="email"
                name="email"
                value={isLogin ? loginData.email : registerData.email}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={isLogin ? loginData.password : registerData.password}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleTogglePassword} edge="end">
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
                size="large"
                sx={{
                    py: 1.5,
                    backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundImage: 'linear-gradient(to right, #5a0fb8, #1d62db)',
                    },
                }}
            >
                {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
        </Stack>

        {error && (
            <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
                {error}
            </Alert>
        )}
        {successMessage && (
            <Alert severity="success" sx={{ mt: 3, width: '100%' }}>
                {successMessage}
            </Alert>
        )}

        <Typography variant="body2" align="center" sx={{ mt: -0, color: '#666' }}>
            {isLogin ? (
                <>
                    Don’t have an account?{' '}
                    <Button
                        onClick={() => setIsLogin(false)}
                        variant="text"
                        sx={{
                            color: '#6a11cb',
                            fontWeight: 'bold',
                        }}
                    >
                        Sign Up
                    </Button>
                </>
            ) : (
                <>
                    Already have an account?{' '}
                    <Button
                        onClick={() => setIsLogin(true)}
                        variant="text"
                        sx={{
                            color: '#6a11cb',
                            fontWeight: 'bold',
                            maxHeight: '0px',
                        }}
                    >
                        Log In
                    </Button>
                </>
            )}
        </Typography>
    </Paper>
</Box>
  );
};

export default LoginRegister;
