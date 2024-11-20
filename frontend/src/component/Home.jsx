import React, { useState } from "react";
import { Box, Typography, Button as MuiButton, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../assets/SAILogo.png";
import ChatInterface from "./ChatInterface";

const HomeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  padding: theme.spacing(3),
  backgroundColor: "#e8f4f9",
  textAlign: "center",
}));

const Logo = styled("img")(() => ({
  width: "150px",
  height: "auto",
  marginBottom: "16px",
  filter: "drop-shadow(0px 0px 8px rgba(100, 108, 255, 0.6))",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "2.8rem",
  fontWeight: 700,
  color: "#2f3640",
  marginBottom: theme.spacing(2),
  fontFamily: "'Roboto', sans-serif",
}));

const Quote = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  color: "#a29bfe",
  fontStyle: "italic",
  fontFamily: "'Poppins', sans-serif",
  textAlign: "center",
}));

const ChatContainer = styled(Box)(({ theme, isVisible }) => ({  //Ireuse lang ni ninyo
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
}));

const Home = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);


  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  return (
    <HomeContainer>
      <Logo src={logo} alt="SAI Logo" />
      <Title variant="h1">SERENITY AI</Title>
      <Quote>"Your Personal AI for Emotional Well-being"</Quote>
      <MuiButton variant="contained" color="primary" onClick={toggleChatVisibility}>
        {isChatVisible ? "Close Chat" : "Open Chat"}
      </MuiButton>
      <ChatContainer isVisible={isChatVisible}>
        <ChatInterface isSmallScreen={true} />
      </ChatContainer>
    </HomeContainer>
  );
};

export default Home;
