import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loggedInUser = await UserService.loginUser(user);
            console.log('Logged in:', loggedInUser);
            navigate('/userlist');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Login failed");
            } else {
                setError("An unexpected error occurred.");
            }
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
