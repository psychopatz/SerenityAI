import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './component/Register';
import Login from './component/LoginRegister';
import MoodEntryApp from './component/MoodEntryApp';
import ChatInterface from './component/ChatInterface';
import UserList from './component/UserList';
import RecommendationApp from './component/RecommendationApp';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/moodentry" element={<MoodEntryApp />} />
                <Route path="/chat" element={<ChatInterface/>} />
                <Route path="/list" element={<UserList/>} />
                <Route path="/recommendation" element={<RecommendationApp/>} />

            </Routes>
        </Router>
    );
};

export default App;
