import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ChatInterface from "./ChatInterface";

const ChatContainer = styled(Box)(({ theme, isVisible }) => ({
  position: "fixed",
  bottom: isVisible ? 0 : "-100%",
  right: theme.spacing(3),
  width: "350px",
  height: "500px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  transition: "bottom 0.5s ease-in-out",
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
  return (
    <ChatContainer isVisible={isVisible}>
      <ChatHeader>
        <Typography variant="subtitle1" style={{ fontWeight: 600, paddingLeft: "10px", color: "#fff" }}>
          SerenityAI
        </Typography>
        <IconButton onClick={toggleChatVisibility}>
          <CloseIcon />
        </IconButton>
      </ChatHeader>
      <ChatInterface isSmallScreen={true} />
    </ChatContainer>
  );
};

export default ChatboxIframe;
