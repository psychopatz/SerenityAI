import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLocation } from 'react-router-dom';
import { navBackgroundImage } from "../styles/NavStyles";

const Nav = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const AppBarStyled = styled(AppBar)({

    backgroundImage: navBackgroundImage 
    });

  const navLinkStyle = {
    color: "#000",
    marginRight: "1rem",
  };

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Chat", path: "/chat" },
    { label: "Services", path: "/services" },
    { label: "Contact", path: "/contact" },
  ];

  console.log("Rendering Navigation component");

  return (
    <AppBarStyled position="static" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Serenity AI
        </Typography>
        {navItems.map((item, index) => {
          console.log(`Rendering nav item: ${item.label}`);
          return (
            <Button key={index} style={navLinkStyle} href={item.path}>
              {item.label}
            </Button>
          );
        })}
      </Toolbar>
    </AppBarStyled>
  );
};

export default Nav;