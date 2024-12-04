// ChangePassword.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UserService from "../services/UserService";
import StorageService from "../services/StorageService";

const ChangePassword = ({ open, onClose }) => {
  const storageService = StorageService();
  const userData = storageService.getLocalStorage("userdata") || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }

    if (password.length < 6) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters long.",
        severity: "warning",
      });
      return;
    }

    try {
      // Assuming your UserService has a method to update the password
      await UserService.updateUserById(userData.user_id, { password });
      
      // Optionally, update local storage if password is stored (not recommended for security reasons)
      // storageService.setLocalStorage("userdata", { ...userData, password });

      setSnackbar({
        open: true,
        message: "Password updated successfully!",
        severity: "success",
      });

      // Reset fields
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error) {
      console.error("Password update failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to update password.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePassword;
