import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/LoginRegister';
import ChatInterface from './component/ChatInterface';
import RecommendationApp from './component/RecommendationApp';
import Nav from './component/Nav';
import Home from "./component/Home";

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatInterface/>} />
        <Route path="/recommendation" element={<RecommendationApp/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
