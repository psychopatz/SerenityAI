import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersData = await UserService.getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await UserService.deleteUser(id);
            fetchUsers(); // Refresh the user list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <Link to="/add">Add New User</Link>
            <ul>
                {users.map(user => (
                    <li key={user.user_id}>
                        {user.name} - {user.email}
                        <Link to={`/user/${user.user_id}`}>View</Link>
                        <Link to={`/edit/${user.user_id}`}>Edit</Link>
                        <button onClick={() => deleteUser(user.user_id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
