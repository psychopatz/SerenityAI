import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  styled,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import UserService from "../services/UserService";
import MaleAvatar from "../assets/male-avatar.png";
import FemaleAvatar from "../assets/female-avatar.png";
import DefaultAvatar from "../assets/default-avatar.png";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";

// Styled Components
const ProfileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: theme.spacing(4),
  backgroundColor: "transparent", // Ensure transparency
}));

const DetailsCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "700px", // Wider card for better space usage
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
  background: "linear-gradient(145deg, #FFECA1, #98F5F9)", // Subtle gradient
  textAlign: "center",
}));

const Avatar = styled("img")(({ theme }) => ({
  width: 140,
  height: 140,
  borderRadius: "50%",
  marginBottom: theme.spacing(3),
  objectFit: "cover",
  border: "6px solid #E8E8E8",
  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
}));

const Field = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
  fontSize: theme.typography.body1.fontSize,
  "& strong": {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5),
  fontSize: "1.2rem",
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2,
}));

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    gender: "",
    dateOfBirth: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userdata"));
    if (storedData) {
      setUserData(storedData);
    }
  }, []);

  const handleSave = async () => {
    try {
      const updatedData = await UserService.updateProfile(userData.email, userData);
      localStorage.setItem("userdata", JSON.stringify(updatedData));
      setUserData(updatedData);
      setIsEditing(false);
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSnackbar({ open: true, message: "Failed to update profile. Please try again.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getAvatar = () => {
    if (userData.gender.toLowerCase() === "male") {
      return MaleAvatar;
    } else if (userData.gender.toLowerCase() === "female") {
      return FemaleAvatar;
    } else {
      return DefaultAvatar;
    }
  };

  return (
    <ProfileContainer>
      <DetailsCard>
        {/* Profile Picture */}
        <Avatar src={getAvatar()} alt="User Avatar" />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {`${userData.firstName || "First Name"} ${
            userData.lastName || "Last Name"
          }`}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {userData.location || "Location not provided"}
        </Typography>
        <Divider sx={{ margin: "20px auto", width: "80%" }} />
        {isEditing ? (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="First Name"
              variant="outlined"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Location"
              variant="outlined"
              value={userData.location}
              onChange={(e) => setUserData({ ...userData, location: e.target.value })}
              fullWidth
            />
            <TextField
              label="Gender"
              variant="outlined"
              value={userData.gender}
              onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
              fullWidth
            />
            <TextField
              label="Birthday"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={userData.dateOfBirth}
              onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Field>
              <EmailIcon color="primary" />
              <strong>Email:</strong> {userData.email || "Not provided"}
            </Field>
            <Field>
              <LocationOnIcon color="primary" />
              <strong>Location:</strong> {userData.location || "Not provided"}
            </Field>
            <Field>
              <WcIcon color="primary" />
              <strong>Gender:</strong> {userData.gender || "Not provided"}
            </Field>
            <Field>
              <CakeIcon color="primary" />
              <strong>Birthday:</strong> {userData.dateOfBirth || "Not provided"}
            </Field>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </StyledButton>
          </Box>
        )}
      </DetailsCard>

      {/* Snackbar for Notifications */}
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
    </ProfileContainer>
  );
};

export default Profile;
