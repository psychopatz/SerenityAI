import React from "react";
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
  backgroundColor: "#ffffff",
  borderRadius: "8px 8px 0 0",
  overflow: "hidden",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1),
  backgroundColor: "#4a90e2",
  borderBottom: "1px solid #e0e0e0",
}));

const ChatboxIframe = ({ isVisible, toggleChatVisibility }) => {
  return ReactDOM.createPortal(
    <ChatContainer
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: isVisible ? 0 : "100%", opacity: isVisible ? 1 : 0 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <ChatHeader>
        <Typography variant="subtitle1" style={{ fontWeight: 600, paddingLeft: "10px", color: "#fff" }}>
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
