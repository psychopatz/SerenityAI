// src/components/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StorageService from "../services/StorageService";
import { Box, CircularProgress, Typography } from "@mui/material";

const Logout = () => {
  const storage = StorageService();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local and session storage
    storage.clearLocalStorage();
    storage.clearSessionStorage();

    // Optional: Add a slight delay to show the loading spinner/message
    const timer = setTimeout(() => {
      // Navigate to the login page
      navigate("/login", { replace: true });
    }, 500); // 500ms delay

    // Clean up the timer if the component unmounts before the timeout
    return () => clearTimeout(timer);
  }, [storage, navigate]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent", // Ensures the background is transparent
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // Ensures this overlay is above other content
      }}
    >
      {/* Optional: Loading Spinner */}
      <CircularProgress color="secondary" />

      {/* Optional: Logout Message */}
      <Typography
        variant="h6"
        color="secondary"
        sx={{ mt: 2 }}
      >
        Logging out...
      </Typography>
    </Box>
  );
};

export default Logout;
