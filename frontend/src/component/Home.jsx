import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../assets/SAILogo.png"; // Ensure the path to the logo is correct

// Styled container for the homepage
const HomeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  padding: theme.spacing(3),
  backgroundColor: "#e8f4f9", // Very light blue background
  textAlign: "center",
}));

// Styled logo image with color adjustments
const Logo = styled("img")(() => ({
  width: "150px", // Balanced logo size
  height: "auto", // Maintain aspect ratio
  marginBottom: "16px", // Space between logo and text
  filter: "drop-shadow(0px 0px 8px rgba(100, 108, 255, 0.6))", // Soft shadow to make logo pop
}));

// Styled Title (SERENITY AI) with color and font styling
const Title = styled(Typography)(({ theme }) => ({
  fontSize: "2.8rem", // Balanced size for the title
  fontWeight: 700, // Bold font for emphasis
  color: "#2f3640", // Dark gray for text color
  marginBottom: theme.spacing(2),
  fontFamily: "'Roboto', sans-serif", // Roboto font for modern feel
}));

// Styled Quote (Your Personal AI for Emotional Well-being)
const Quote = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem", // Slightly smaller than title
  color: "#a29bfe", // Light purple accent color for the quote
  fontStyle: "italic", // Italicized for emphasis
  fontFamily: "'Poppins', sans-serif", // Poppins font for a clean look
  textAlign: "center",
}));

const Home = () => {
  return (
    <HomeContainer>
      <Logo src={logo} alt="SAI Logo" />
      <Title variant="h1">SERENITY AI</Title>
      <Quote>"Your Personal AI for Emotional Well-being"</Quote>
    </HomeContainer>
  );
};

export default Home;
