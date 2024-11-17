import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/LoginRegister';
import ChatInterface from './component/ChatInterface';
import UserList from './component/UserList';
import RecommendationApp from './component/RecommendationApp';
import Nav from './component/Nav';

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatInterface/>} />
        <Route path="/list" element={<UserList/>} />
        <Route path="/recommendation" element={<RecommendationApp/>} />
      </Routes>
      
    </Router>
  );
};

export default App;
