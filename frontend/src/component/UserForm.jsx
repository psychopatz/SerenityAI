import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { useParams, useNavigate } from 'react-router-dom';
import './UserForm.css'; // Import the CSS file

const UserForm = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        location: '',
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        const userData = await UserService.getUserById(id);
        setUser(userData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await UserService.updateUser(id, user);
            } else {
                await UserService.createUser(user);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    return (
        <div className="user-form-container">
            <h2 className="form-title">{id ? 'Edit User' : 'Add User'}</h2>
            <form className="user-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={user.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <select
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={user.location}
                        onChange={handleChange}
                        placeholder="Enter your location"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Save</button>
            </form>
        </div>
    );
};

export default UserForm;
