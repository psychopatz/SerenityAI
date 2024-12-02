import { AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StorageService from "../services/StorageService";
import Baymax from "../assets/Baymax.json";
import Lottie from "lottie-react";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const storage = StorageService();
  const [shouldRender, setShouldRender] = useState(true);

  const protectedRoutes = ["/dashboard", "/chat", "/settings", "/profile", "/diary"];
  const loggedInRoutes = ["/login", "/register", "/"];
  const excludedRoutes = ["/login", "/register", "/404", "/"];

  // Retrieve user data from localStorage
  const userData = storage.getLocalStorage("userdata");
  const userInitial = userData?.firstName?.charAt(0) + userData?.lastName?.charAt(0) || "";
  const userProfilePicture = userData?.profilePicture;

  useEffect(() => {
    // Handle navigation logic
    if (protectedRoutes.includes(location.pathname) && !userData) {
      navigate("/");
    }
    if (loggedInRoutes.includes(location.pathname) && userData) {
      navigate("/dashboard");
    }
    
    // Set whether the nav should render
    setShouldRender(!excludedRoutes.includes(location.pathname));
  }, [location.pathname, navigate, userData]);

  // Early return if we shouldn't render the nav
  if (!shouldRender) {
    return <Outlet />;
  }

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Chat", path: "/chat" },
    { label: "Diary", path: "/diary" },
    { label: "About us", path: "/about" },
  ];

  const menuItems = [
    { label: "Settings", path: "/settings" },
    { label: "Profile", path: "/profile" },
    { label: "Logout", path: "/logout" },
  ];

  const AppBarStyled = styled(AppBar)({
    background: "linear-gradient(to right, #00CED1, #BF40BF)",
    backgroundSize: "200% 200%",
    animation: "gradientAnimation 10s ease-in-out infinite",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: "3px",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid black",
    maxHeight: "60px",
    height: "60px",
    '& .MuiToolbar-root': {
      minHeight: "60px",
      padding: "0 16px",
    },
    '@keyframes gradientAnimation': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
  });

  const MenuItemStyled = styled(MenuItem)({
    color: "#03045e",
    fontWeight: "bold",
    '&:hover': {
      backgroundColor: "#e0f7fa",
    },
  });

  const ButtonStyled = styled(Button)({
    transition: "transform 0.2s, background-color 0.2s",
    '&:hover': {
      transform: "scale(1.05)",
      backgroundColor:"#0077b6",
      color: "#ffffff",
    },
    '&.Mui-selected': {
      background: 'linear-gradient(to right,#4e54c8, #960276)',
      color: "#0077b6",
      fontSize: "1.2rem",
      padding: "10px 18px",
    },
    padding: "8px 16px",
    minHeight: "40px",
    display: 'flex',
    alignItems: 'center',
  });

  const navLinkStyle = {
    color: "#03045e",
    marginRight: "1rem",
    textDecoration: "none",
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    setAnchorEl(null);
    navigate(path);
  };

  return (
    <>
      <AppBarStyled>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/dashboard">
              <motion.div
                whileHover={{ scale: 1.7 }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror' }}
                style={{ display: 'inline-block', outline: 'none', border: 'none' }}
              >
                <Lottie animationData={Baymax} style={{ width: "auto", height: "5vh", margin: "0", padding: "0", border: 'none', outline: 'none' }} />
              </motion.div>
            </Link>
            <motion.div
              initial={{ textShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)" }}
              animate={{ textShadow: [
                "0px 0px 5px rgba(255, 255, 255, 0.5)",
                "0px 0px 15px rgba(255, 0, 0, 0.8)",
                "0px 0px 15px rgba(0, 255, 0, 0.8)",
                "0px 0px 15px rgba(0, 0, 255, 0.8)",
                "0px 0px 15px rgba(255, 255, 0, 0.8)",
                "0px 0px 15px rgba(0, 255, 255, 0.8)",
                "0px 0px 15px rgba(255, 0, 255, 0.8)",
                "0px 0px 5px rgba(255, 255, 255, 0.5)"
              ] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror' }}
              style={{ marginLeft: "10px", color: "white", fontWeight: "bold", fontSize: "1.5rem", marginBottom: "5px" }}
            >
              SERENITY AI
            </motion.div>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <ButtonStyled
                  key={index}
                  component={Link}
                  to={item.path}
                  className={isActive ? 'Mui-selected' : ''}
                  style={{
                    ...navLinkStyle,
                    color: isActive ? "#ffffff" : "#000",
                    fontWeight: isActive ? "bold" : "normal",
                    marginTop: "15px",
                  }}
                >
                  {item.label}
                </ButtonStyled>
              );
            })}
            <motion.div
              whileHover={{ scale: 1.1, backgroundColor: '#005f99' }}
              whileTap={{ scale: 0.9 }}
              style={{ display: 'inline-block', borderRadius: '50%' }}
            >
              <Avatar
                src={userProfilePicture}
                alt={userInitial}
                style={{ marginLeft: "auto", backgroundColor: "#0077b6" }}
                onClick={handleAvatarClick}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : 'false'}
              >
                {!userProfilePicture && userInitial}
              </Avatar>
            </motion.div>
          </Box>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            style: {
              display: 'flex',
              justifyContent: 'flex-end',
              minWidth: '25px',
              top: '50px',
              left: 'auto',
              right: '5px',
              transform: 'translateX(0)',
              marginTop: "6vh",
              marginLeft: "94vw",
              textAlign: 'left'
            },
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItemStyled key={index} onClick={() => handleMenuItemClick(item.path)}>
              {item.label}
            </MenuItemStyled>
          ))}
        </Menu>
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