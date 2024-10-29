    // src/components/UserManagement.js
import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    location: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    UserService.getAllUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCreateUser = () => {
    UserService.createUser(newUser)
      .then(fetchUsers)
      .catch((error) => console.error(error));
  };

  const handleDeleteUser = (id) => {
    UserService.deleteUser(id)
      .then(fetchUsers)
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>User Management</h2>
      <input name="username" placeholder="Username" onChange={handleInputChange} />
      <input name="name" placeholder="Name" onChange={handleInputChange} />
      <input name="email" placeholder="Email" onChange={handleInputChange} />
      <input name="password" placeholder="Password" onChange={handleInputChange} type="password" />
      <input name="dateOfBirth" placeholder="Date of Birth" onChange={handleInputChange} />
      <input name="gender" placeholder="Gender" onChange={handleInputChange} />
      <input name="location" placeholder="Location" onChange={handleInputChange} />
      <button onClick={handleCreateUser}>Add User</button>

      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {user.name} ({user.email})
            <button onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
