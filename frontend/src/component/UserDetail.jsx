import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const userData = await UserService.getUserById(id);
        setUser(userData);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>User Details</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Sign Up Date:</strong> {user.signUpDate}</p>
            <p><strong>Last Login:</strong> {user.lastLogin}</p>
        </div>
    );
};

export default UserDetail;
