// src/App.js

import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import LoginRegister from './component/LoginRegister';
import ChatInterface from './component/ChatInterface';
import Nav from './component/Nav';
import Home from "./component/Home";
import Profile from './component/Profile';
import Logout from "./component/Logout";
import ErrorPage from "./component/ErrorPage";
import Dashboard from "./component/Dashboard";
import PageWrapper from './component/PageWrapper'; 
import ChatboxIframe from "./component/ChatboxIframe";

// Define allowed paths
const allowedPaths = ["/dashboard", "/profile", "/diary","/about"];

// Styled Components
const StyledComponents = {
  Container: styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
    padding: theme.spacing(2),
    width: '100%',
  })),

  ChatButton: styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: '#4a90e2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#357ABD',
    },
    zIndex: 1000,
  })),
};

// Animated Routes Component
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

// ChatboxContainer Component
const ChatboxContainer = ({ isChatVisible, setIsChatVisible }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Ref to store the last isChatVisible state
  const lastIsChatVisible = useRef(isChatVisible);

  useEffect(() => {
    if (allowedPaths.includes(currentPath)) {
      // Revert to the last visible state when entering an allowed path
      setIsChatVisible(lastIsChatVisible.current);
    } else {
      // Store the current state before hiding
      lastIsChatVisible.current = isChatVisible;
      // Hide the chat on disallowed paths
      setIsChatVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  // Determine if the current path is allowed
  const isAllowedPath = allowedPaths.includes(currentPath);

  return (
    isAllowedPath && (
      <>
        {!isChatVisible && (
          <StyledComponents.ChatButton onClick={() => setIsChatVisible(true)} size="large">
            <ChatBubbleIcon fontSize="large" />
          </StyledComponents.ChatButton>
        )}

        <ChatboxIframe
          isVisible={isChatVisible}
          toggleChatVisibility={() => setIsChatVisible(false)}
        />
      </>
    )
  );
};

// Main App Component
const App = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  return (
    <Router>
      <Nav />
      <AnimatedRoutes />
      <ChatboxContainer 
        isChatVisible={isChatVisible} 
        setIsChatVisible={setIsChatVisible} 
      />
    </Router>
  );
};

export default App;
