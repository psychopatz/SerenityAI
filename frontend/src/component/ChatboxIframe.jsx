// ChatboxIframe.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ChatInterface from "./ChatInterface";
import { motion } from "framer-motion";

const ChatContainer = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  right: theme.spacing(3),
  width: "350px",
  height: "500px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  backgroundColor: "rgba(255, 255, 255, 0.2)", 
  overflow: "hidden",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px 16px 0 0",
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1),
  backgroundColor: "rgba(74, 144, 226, 1)", 
  borderBottom: "1px solid rgba(224, 224, 224, 0.5)", 
  borderRadius: "16px 16px 0 0",
}));

const ChatboxIframe = ({ isVisible, toggleChatVisibility }) => {
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    const handleChatMessagesUpdated = () => {
      setUpdateKey(prevKey => prevKey + 1);
    };

    window.addEventListener('chatMessagesUpdated', handleChatMessagesUpdated);

    return () => {
      window.removeEventListener('chatMessagesUpdated', handleChatMessagesUpdated);
    };
  }, []);

  return ReactDOM.createPortal(
    <ChatContainer
      key={updateKey} // Add key prop to force re-render
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: isVisible ? 0 : "100%", opacity: isVisible ? 1 : 0 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <ChatHeader>
        <Typography variant="subtitle1" style={{ fontWeight: 600, paddingLeft: "10px", color: "rgba(255, 255, 255, 1)" }}>
          SerenityAI
        </Typography>
        <IconButton onClick={toggleChatVisibility}>
          <CloseIcon />
        </IconButton>
      </ChatHeader>
      <ChatInterface isSmallScreen={true} />
    </ChatContainer>,
    document.body
  );
};

export default ChatboxIframe;
