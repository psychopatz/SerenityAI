import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './component/Register';
import Login from './component/LoginRegister';
import MoodEntryApp from './component/MoodEntryApp';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/moodentry" element={<MoodEntryApp />} />
            </Routes>
        </Router>
    );
};

export default App;
