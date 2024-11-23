import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginRegister from './component/LoginRegister';
import ChatInterface from './component/ChatInterface';
import Nav from './component/Nav';
import Home from "./component/Home";
import Profile from './component/Profile';
import Logout from "./component/Logout";
import ErrorPage from "./component/ErrorPage";
import Dashboard from "./component/Dashboard";
import PageWrapper from './component/PageWrapper'; 

const AnimatedRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<PageWrapper><LoginRegister /></PageWrapper>} />
        <Route path="/logout" element={<PageWrapper><Logout/></PageWrapper>} />
        <Route path="/chat" element={<PageWrapper><ChatInterface /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><ErrorPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <Nav />
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
