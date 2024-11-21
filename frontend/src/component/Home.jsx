import { Box, Button as MuiButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import logo from "../assets/SAILogo.png";
import ChatboxIframe from "./ChatboxIframe";


 const HomeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Take up full height of viewport
  width: "100vw", // Take up full width of viewport
  padding: theme.spacing(3),
  backgroundColor: "#rgba(255, 255, 255, 0.1)", 
  textAlign: "center",
  overflow: "hidden", // Hide scrollbars
  position: "absolute", // Position absolute to remove any parent restrictions
  top: 0,
  marginRight: "auto",
  bottom: 0,
  right: 300,
  overflowX: "hidden",
  overflowY: "hidden",
  marginLeft: "auto",
 }));

 const RightContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "auto", // Take up full height of viewport
  width: "30vw", // Take up 30% of viewport width
  padding: theme.spacing(3),
  backgroundColor: "#rgba(255, 255, 255, 0.1)", 
  textAlign: "center",
  overflow: "hidden", // Hide scrollbars
  position: "absolute", // Add this line
  right: 0, // Add this line
  top: 150,
}));

const TopRightContainer = styled(Box)(({ theme }) => ({
  height: "auto", // Take up 40% of viewport height
  width: "100%", // Take up full width of parent
  padding: theme.spacing(3),
  backgroundColor: "#rgba(255, 255, 255, 0.1)", 
  textAlign: "center",
  overflow: "hidden", // Hide scrollbars
}));

const BottomRightContainer = styled(Box)(({ theme }) => ({
  height: "auto", // Take up 60% of viewport height
  width: "90%", //   Take up full width of parent
  padding: theme.spacing(0),
  backgroundColor: "#rgba(255, 255, 255, 0.1)", 
  textAlign: "justify",
  overflow: "hidden", // Hide scrollbars
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
  marginBottom: theme.spacing(2),
  fontFamily: "'Roboto', sans-serif",
  background: "linear-gradient(90deg, #000000, #000000)", // Gradient for text
  WebkitBackgroundClip: "text", // Clips the background to the text
  WebkitTextFillColor: "transparent", // Makes the text transparent to show the gradient
  color: "transparent", // Ensure text color doesn't override gradient
  textShadow: `
    0 0 8px rgba(0, 0, 0, 0.4), 
    0 0 16px rgba(0, 0, 0, 0.3), 
    0 0 24px rgba(0, 0, 0, 0.2)
  `, // Glowing shadow around the text
}));


const Quote = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  color: "#a29bfe",
  fontStyle: "italic",
  fontFamily: "'Poppins', sans-serif",
  textAlign: "center",
}));

const Title2 = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  color: "#333",
  fontWeight: "bold",
  fontFamily: "'Poppins', sans-serif",
  textAlign: "center",
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  color: "#666",
  fontStyle: "normal",
  fontFamily: "'Poppins', sans-serif",
  textAlign: "left",
}));



const Home = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  return (
    <HomeContainer>
      <Box>
        <Logo src={logo} alt="SAI Logo" sx={{marginBottom:"10px",}}/>
        <Title variant="h1">SERENITY AI</Title>
        <Quote>"Your Personal AI for Emotional Well-being"</Quote>
        <MuiButton variant="contained" color="primary" onClick={toggleChatVisibility}>
          {isChatVisible ? "Close Chat" : "Open Chat"}
        </MuiButton>
        <AnimatePresence>
          {isChatVisible && (
            <ChatboxIframe isVisible={isChatVisible} toggleChatVisibility={toggleChatVisibility} />
          )}
        </AnimatePresence> 
      </Box>
      <RightContainer>
        <TopRightContainer>
        <Title2>Empowering Your Mental Wellness Journey with AI.</Title2>
        </TopRightContainer>
        <BottomRightContainer>
        <Description>"SerenityAI is a user-focused platform designed to support mental and emotional wellness through AI-driven tools. The application addresses common pain pointsin mental health management, including limited access to personalized resources, difficulty tracking emotional patterns, lack of immediate coping strategies, andprivacy concerns."</Description>
        </BottomRightContainer>
      </RightContainer>
    </HomeContainer>
  );
};

export default Home;
