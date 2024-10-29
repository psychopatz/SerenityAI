import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [error, setError] = useState(''); // State to hold error message
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const loggedInUser = await UserService.loginUser(user);
            console.log('Logged in:', loggedInUser);
            navigate('/dashboard');
        } catch (error) {
            // Check if the response has a message from the backend
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Login failed"); // Display backend error
            } else {
                setError("An unexpected error occurred."); // Generic error
            }
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
    );
};

export default Login;
