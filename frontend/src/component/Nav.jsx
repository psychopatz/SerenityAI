import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import {Link, useLocation } from 'react-router-dom';
import { navBackgroundImage } from "../styles/NavStyles";
import logo from '../assets/SAILogo.png'; 



const Nav = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const AppBarStyled = styled(AppBar)({
    backgroundColor: "#4A90E2",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1201,
    });

  const navLinkStyle = {
    color: "#000",
    marginRight: "1rem",
    textDecoration: "none",
  };

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Chat", path: "/chat" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  console.log("Rendering Navigation component");

  return (
    <AppBarStyled>
      <Toolbar>
      <Link to="/home"><
        img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
      </Link>
        <Typography variant="h6" style={{ flexGrow: 1, marginTop: '10px', color:'black', fontWeight: 'bold' }}>
         SERENITY AI
        </Typography>
        {navItems.map((item, index) => {
          console.log(`Rendering nav item: ${item.label}`);
          return (
            <Button key={index} style={{ ...navLinkStyle, marginTop: '15px'}} href={item.path}>
              {item.label}
            </Button>
          );
        })}
      </Toolbar>
    </AppBarStyled>
  );
};

export default Nav;