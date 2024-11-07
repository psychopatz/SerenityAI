import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
        gender: '',
        location: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Added success message state
    const navigate = useNavigate();

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
            navigate('/moodentry');
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
                setRegisterData({ name: '', email: '', password: '', dateOfBirth: '', gender: '', location: '' }); // Clear the register form
                setSuccessMessage(''); // Clear the success message after redirection
            }, 3000); // Show success message for 3 seconds before redirecting
        } catch (error) {
            // Handle errors for existing email or name
            if (error.response?.data?.message.includes('Email already taken')) {
                setError('This email is already taken');
            } else if (error.response?.data?.message.includes('Name already taken')) {
                setError('This name is already taken');
            } else {
                setError('Registration failed');
            }
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-primary mb-6">{isLogin ? 'Login' : 'Register'}</h2>

                {/* Display success message if registration is successful */}
                {successMessage && <p className="text-success mt-4">{successMessage}</p>}

                <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="w-full">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={registerData.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                                className="input"
                                required
                            />
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={registerData.dateOfBirth}
                                onChange={handleInputChange}
                                className="input"
                                required
                            />
                            <select
                                name="gender"
                                value={registerData.gender}
                                onChange={handleInputChange}
                                className="input"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="text"
                                name="location"
                                value={registerData.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                                className="input"
                                required
                            />
                        </>
                    )}
                    <input
                        type="email"
                        name="email"
                        value={isLogin ? loginData.email : registerData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={isLogin ? loginData.password : registerData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="input"
                        required
                    />
                    <button type="submit" className="bg-primary">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                    {error && <p className="text-muted-foreground mt-2">{error}</p>}
                </form>

                <div className="mt-4 text-muted-foreground">
                    {isLogin ? (
                        <p>
                            Don't have an account?{' '}
                            <span className="text-secondary cursor-pointer" onClick={() => setIsLogin(false)}>
                                Sign up
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <span className="text-secondary cursor-pointer" onClick={() => setIsLogin(true)}>
                                Log in
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
