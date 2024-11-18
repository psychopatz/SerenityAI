import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import UserService from '../services/UserService';

const Profile = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        location: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Initialize navigate from useNavigate hook
    const navigate = useNavigate();

    // Retrieve the logged-in user's email from localStorage (or sessionStorage)
    const userEmail = localStorage.getItem('userEmail'); // Make sure to store this during login

    // Fetch user profile on component mount
    useEffect(() => {
        if (userEmail) {
            UserService.getProfile(userEmail)
                .then((data) => {
                    setUser(data); // Set user data into the state
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Failed to fetch profile');
                    setLoading(false);
                });
        } else {
            setError('No user is logged in');
            setLoading(false);
        }
    }, [userEmail]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    // Handle profile update submission
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
    
        if (userEmail) {
            console.log("Updating user with email:", userEmail); // Debugging log
            UserService.updateUser(userEmail, user)
                .then((updatedUser) => {
                    console.log("Updated user:", updatedUser); // Log the updated user data
                    setSuccessMessage('Profile updated successfully');
                    setUser(updatedUser); // Update state with the new data
                })
                .catch((err) => {
                    console.error("Error updating profile:", err); // Log error
                    setError('Failed to update profile');
                });
        } else {
            setError('No user is logged in');
        }
    };

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        navigate('/login'); // Redirect to login page
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    User Profile
                </Typography>
                <form onSubmit={handleUpdateProfile}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        disabled
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Date of Birth"
                        type="date"
                        name="dateOfBirth"
                        value={user.dateOfBirth}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Gender"
                        name="gender"
                        value={user.gender}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Location"
                        name="location"
                        value={user.location}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Update Profile
                    </Button>
                </form>

                {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}

                {/* Logout Button */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Logout
                </Button>
            </Paper>
        </Box>
    );
};

export default Profile;
    