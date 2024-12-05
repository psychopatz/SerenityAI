import { Box, Card, Button as MuiButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnimatePresence, color } from "framer-motion";
import React, { useState } from "react";
import logo from "../assets/SAILogo.png";
import ChatboxIframe from "./ChatboxIframe";
import Baymax from "../assets/Baymax.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";


const HomeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full viewport height
  width: "100vw", // Full viewport width
  padding: theme.spacing(3),
  backgroundColor: "rgba(255, 255, 255, 0.1)", // Adjust as needed
  textAlign: "center",
  overflow: "hidden", // Ensure no scrolling or overflow
  position: "relative", // Use relative positioning to align content properly
  margin: 0, // Remove any unintended margins
  boxSizing: "border-box", // Include padding in width/height calculations
}));

 const RightContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  height: "auto",
  width: "90vw", // Adjusted width to fit better
  padding: theme.spacing(3),
  textAlign: "center",
  position: "relative", // Changed to relative for better alignment
  right: 0, // Removed negative offset
  top: 0,
  left: 400,
  bottom: 100,
  maxWidth: "100%", // Constrain content to parent width
  boxSizing: "border-box", // Include padding and borders in width calculations
  overflow: "hidden", // Prevent content overflow
}));

const TopRightContainer = styled(Box)(({ theme }) => ({
  width: "100%", // Full width for the title
  marginBottom: theme.spacing(2),
}));

const BottomRightContainer = styled(Box)(({ theme }) => ({
  width: "100%", // Full width for the description
  padding: theme.spacing(2, 0), // Add vertical padding for spacing
  textAlign: "justify", // Justify for better text alignment
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  height: "0", // Take up 60% of viewport height
  width: "30%", // Take up full width of parent
  padding: theme.spacing(0),
  backgroundColor: "#rgba(255, 255, 255, 0.1)", 
  textAlign: "justify",
  overflow: "hidden", // Hide scrollbars
}));




const Title = styled(Typography)(({ theme }) => ({
  fontSize: '4.8rem', // Font size
  fontWeight: 700, // Bold text
  marginLeft: '10px', // Left margin
  marginTop: '250px', // Adjust vertical position
  width: '200%', // Ensure it takes up the full width
  marginBottom: theme.spacing(2), // Bottom margin from theme spacing
  fontFamily: "'Roboto', sans-serif", // Font family
  color: '#ffffff', // White text color
  textShadow: '10px 4px 4px rgba(4, 4, 4, 0.4)', // Black glow effect around the text
  '&:hover': {
    color: '#000000',
    textShadow: '0px 0px 10px #ffffff',
    transition: 'all 0.3s ease-in-out',
  },
  
}));



const Quote = styled(Typography)(({ theme }) => ({
  fontSize: "1.9rem",
  color: "#ffffff",
  fontStyle: "italic",
  fontFamily: "'Poppins', sans-serif",
  textAlign: "center",
  transform: "translateX(50px)",
  marginRight: "-270px",
}));

const Title2 = styled(Typography)(({ theme }) => ({
  fontSize: "3.5rem", // Adjust font size for longer text
  fontWeight: 900,
  fontFamily: "'roboto', sans-serif",
  textAlign: "left",
  color: "#ffffff",
  marginBottom: theme.spacing(2),
  maxWidth: "90%", // Make the width wider
  margin: "0 auto", // Center align
  textShadow: '0px 2px 2px rgba(4, 4, 4, 0.4)',
  '&:hover': {
    color: '#000000',
    textShadow: '0px 0px 10px #ffffff',
    transition: 'all 0.3s ease-in-out',
  },
}));

const Description = styled(Box)(({ theme }) => ({
  fontSize: "1.0rem",
  color: "#a29bfe",
  fontFamily: "'Poppins', sans-serif",
  textAlign: "justify",
  backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark semi-transparent background
  padding: theme.spacing(3), // Add more padding for spacing
  borderRadius: "8px",
  lineHeight: 1.8,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  maxWidth: "90%", // Increased maximum width
  width: "90%", // Ensure it takes up more space
  margin: "0 auto", // Center the content
}));




const Home = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  const navigate = useNavigate();

  return (
    <HomeContainer>

      <Box>
        <Lottie animationData={Baymax} loop={true} style={{ width: "19%", marginLeft: "200px", position: "absolute", top: "200px",  filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5))" }} />
        <Title variant="h1">SERENITY AI</Title>
        <Quote noWrap>"Your Personal AI for Emotional Well-being"</Quote>
      </Box>

      <RightContainer>
  <TopRightContainer>
    <Title2>
      Empowering Your Mental Wellness Journey with AI.
    </Title2>
  </TopRightContainer>
  <BottomRightContainer>
    <Description>
      SerenityAI is a user-focused platform designed to support mental and emotional
      wellness through AI-driven tools. The application addresses common pain points
      in mental health management, including limited access to personalized resources,
      difficulty tracking emotional patterns, lack of immediate coping strategies, and
      privacy concerns.
    </Description>
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
  <MuiButton variant="contained" color="primary"
    sx={{
      fontSize: '1.5rem',
      padding: '1rem 2rem',
      borderRadius: '0.5rem',
      width: '270px',
      height: '50px',
      backgroundColor: 'transparent',
      border: '2px solid #33CC33',
      '&:hover': {
        backgroundColor: '#33CC33', // neon green color
        boxShadow: '0px 0px 10px #33CC33', // glow effect
        transition: 'all 0.3s ease-in-out',
      },
      right: '365px',
    }}
    onClick={() => navigate('/login')}
  >
    Get Started
  </MuiButton>
</Box>
  </BottomRightContainer>
</RightContainer><LeftContainer></LeftContainer>
    </HomeContainer>
  );
};

export default Home;
