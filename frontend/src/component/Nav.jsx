import { AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/SAILogo.png";

const Nav = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const AppBarStyled = styled(AppBar)({
    background: "linear-gradient(to right, #0077b6, #be2ed6)",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: "3px",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid black",
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

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const userInitial = userData?.firstName?.charAt(0) + userData?.lastName?.charAt(0) || "";
  const userProfilePicture = userData?.profilePicture; // Assuming there's a profilePicture field

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = ["Settings", "Logout"]; // Dynamic menu items

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
                  color: isActive ? "#FF5733" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                  marginTop: "15px",
                }}
              >
                {item.label}
              </Button>
            );
          })}
          <Avatar
            src={userProfilePicture}
            alt={userInitial}
            style={{ marginLeft: "auto", backgroundColor: "#0077b6" }}
            onClick={handleAvatarClick}
          >
            {!userProfilePicture && userInitial}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            {menuItems.map((item, index) => (
              <MenuItem key={index} onClick={handleClose}>{item}</MenuItem>
            ))}
          </Menu>
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
