import { AppBar, Avatar, Button, Menu, MenuItem, Toolbar, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/SAILogo.png";
import StorageService from "../services/StorageService";

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

  const MenuItemStyled = styled(MenuItem)({
    color: "#03045e",
    fontWeight: "bold",
    '&:hover': {
      backgroundColor: "#e0f7fa",
    },
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
        <Toolbar>
          <Link to="/dashboard">
            <img
              src={logo}
              alt="Logo"
              style={{ height: "50px", marginRight: "10px" }}
            />
          </Link>
          <Typography
            variant="h6"
            style={{ flexGrow: 1, marginTop: "4px", color: "black", fontWeight: "bold" }}
          >
            SERENITY AI
          </Typography>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={index}
                component={Link}
                to={item.path}
                style={{
                  ...navLinkStyle,
                  color: isActive ? "#ffffff" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                  marginTop: "15px",
                }}
              >
                {item.label}
              </Button>
            );
          })}

          <Box>
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