import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from './component/LoginRegister';
import ChatInterface from './component/ChatInterface';
import Nav from './component/Nav';
import Home from "./component/Home";
import Profile from './component/Profile';
import Logout from "./component/Logout";
import ErrorPage from "./component/ErrorPage";
import Dashboard from "./component/Dashboard";


const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
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
