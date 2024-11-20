import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { navBackgroundImage } from "../styles/NavStyles";
import logo from "../assets/SAILogo.png";
import { motion } from "framer-motion";

const Nav = () => {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const AppBarStyled = styled(AppBar)({
    background: "linear-gradient(to right, #0077b6, #be2ed6)", // Gradient background
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: "3px",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid black", // Add subtle border for separation
  });

  const navLinkStyle = {
    color: "#03045e",
    marginRight: "1rem",
    textDecoration: "none",
  };

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Chat", path: "/chat" },
    { label: "About us", path: "/services" },
    { label: "Profile", path: "/profile" },
  ];

  console.log("Rendering Navigation component");

  return (
    <>
      <AppBarStyled>
        <Toolbar>
          <Link to="/home">
            <img
              src={logo}
              alt="Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
          </Link>
          <Typography
            variant="h6"
            style={{ flexGrow: 1, marginTop: "10px", color: "black", fontWeight: "bold" }}
          >
            SERENITY AI
          </Typography>
          {navItems.map((item, index) => {
            console.log(`Rendering nav item: ${item.label}`);
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={index}
                component={Link}
                to={item.path}
                style={{
                  ...navLinkStyle,
                  color: isActive ? "#FF5733" : "#000", // Change color if the current route is active
                  fontWeight: isActive ? "bold" : "normal",
                  marginTop: "15px",
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Toolbar>
      </AppBarStyled>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.div>
    </>
  );
};

export default Nav;
