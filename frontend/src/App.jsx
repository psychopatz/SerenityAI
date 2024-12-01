// src/App.js

import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import Login from "./component/Auth";
import ChatInterface from './component/ChatInterface';
import Nav from './component/Nav';
import Home from "./component/Home";
import Profile from './component/Profile';
import Logout from "./component/Logout";
import ErrorPage from "./component/ErrorPage";
import Dashboard from "./component/Dashboard";
import PageWrapper from './component/PageWrapper'; 
import ChatboxIframe from "./component/ChatboxIframe";
import Diary from "./component/Diary";
import About from "./component/AboutUsPage";
import Settings  from "./component/Settings";
import DynamicBaymax from "./component/DynamicBaymax";
import TestMic from "./pages/TestMic";


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
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/logout" element={<PageWrapper><Logout/></PageWrapper>} />
        <Route path="/chat" element={<PageWrapper><ChatInterface /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/diary" element={<PageWrapper><Diary /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/testmic" element={<PageWrapper><TestMic/></PageWrapper>} />
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

  // Ref to store the last isChatVisible state when on allowed paths
  const lastIsChatVisible = useRef(isChatVisible);

  // Ref to store the previous path's allowed status
  const prevIsAllowedPath = useRef(allowedPaths.includes(currentPath));

  useEffect(() => {
    const isAllowedPath = allowedPaths.includes(currentPath);
    const wasAllowedPath = prevIsAllowedPath.current;

    console.log(`Navigating to: ${currentPath}`);
    console.log(`Was allowed path: ${wasAllowedPath}, Is allowed path: ${isAllowedPath}`);

    if (wasAllowedPath && !isAllowedPath) {
      // Navigating from allowed to disallowed
      console.log("Navigating away from allowed path. Saving chat visibility state and hiding chat.");
      lastIsChatVisible.current = isChatVisible;
      setIsChatVisible(false);
    } else if (!wasAllowedPath && isAllowedPath) {
      // Navigating from disallowed to allowed
      console.log("Navigating back to allowed path. Restoring chat visibility state.");
      setIsChatVisible(lastIsChatVisible.current);
    }
    // If navigating between allowed paths or between disallowed paths, do nothing

    // Update previous allowed path ref
    prevIsAllowedPath.current = isAllowedPath;
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
      <DynamicBaymax sx={{ 
          }}/>


    </Router>
  );
};

export default App;
