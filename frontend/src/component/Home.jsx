import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../assets/SAILogo.png"; 
import Button from "./Button";



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

const Home = () => {
  
  return (
    <HomeContainer>
      <Logo src={logo} alt="SAI Logo" />
      <Title variant="h1">SERENITY AI</Title>
      <Quote>"Your Personal AI for Emotional Well-being"</Quote>
      <Button />
    
    </HomeContainer>
  );
};

export default Home;
