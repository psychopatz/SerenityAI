import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
        gender: '',
        location: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted!"); // Check if this logs in the console
        try {
            await UserService.registerUser(formData);
            navigate('/login'); // Redirect to login on success
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };
    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
