import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './component/Register';
import Login from './component/Login';
import UserForm from './component/UserForm'; // Example component for Dashboard
import UserList from './component/UserList';
import MoodEntryApp from './component/MoodEntryApp';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<UserForm />} />
                <Route path="/userlist" element={<UserList />} />
                <Route path="/moodentry" element={<MoodEntryApp />} />
            </Routes>
        </Router>
    );
};

export default App;
