import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  styled,
} from "@mui/material";
import UserService from "../services/UserService"; // Import UserService

// Import images for male and female avatars
import MaleAvatar from "../assets/male-avatar.png";
import FemaleAvatar from "../assets/female-avatar.png";
import DefaultAvatar from "../assets/default-avatar.png";

// Styled Components
const ProfileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  minHeight: "100vh",
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  width: "300px",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
}));

const DetailsCard = styled(Paper)(({ theme }) => ({
  flex: 1,
  maxWidth: "600px",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Avatar = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: "50%",
  marginBottom: theme.spacing(2),
}));

const Field = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontSize: theme.typography.body1.fontSize,
  "& strong": {
    fontWeight: theme.typography.fontWeightBold,
  },
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

  useEffect(() => {
    // Load user data from localStorage
    const storedData = JSON.parse(localStorage.getItem("userdata"));
    if (storedData) {
      setUserData(storedData);
    }
  }, []);

  const handleSave = async () => {
    try {
      const userDataToSend = { ...userData };
      if (!userDataToSend.password || userDataToSend.password.trim() === "") {
        delete userDataToSend.password;
      }
      const updatedData = await UserService.updateProfile(userData.email, userDataToSend);
      localStorage.setItem("userdata", JSON.stringify(updatedData));
      setUserData(updatedData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("An error occurred while updating your profile. Please try again.");
    }
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
      {/* Left Profile Card */}
      <ProfileCard>
        <Avatar src={getAvatar()} alt="User Avatar" />
        <Typography variant="h6" gutterBottom>
          {`${userData.firstName || "First Name"} ${userData.lastName || "Last Name"}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {userData.location || "Location not provided"}
        </Typography>
      </ProfileCard>

      {/* Right Details Card */}
      <DetailsCard>
        {isEditing ? (
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <TextField
              label="Location"
              variant="outlined"
              value={userData.location}
              onChange={(e) => setUserData({ ...userData, location: e.target.value })}
            />
            <TextField
              label="Gender"
              variant="outlined"
              value={userData.gender}
              onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
            />
            <TextField
              label="Birthday"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={userData.dateOfBirth}
              onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Field>
              <strong>First Name:</strong> {userData.firstName || "Not provided"}
            </Field>
            <Field>
              <strong>Last Name:</strong> {userData.lastName || "Not provided"}
            </Field>
            <Field>
              <strong>Email:</strong> {userData.email || "Not provided"}
            </Field>
            <Field>
              <strong>Location:</strong> {userData.location || "Not provided"}
            </Field>
            <Field>
              <strong>Gender:</strong> {userData.gender || "Not provided"}
            </Field>
            <Field>
              <strong>Birthday:</strong> {userData.dateOfBirth || "Not provided"}
            </Field>
            <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </Box>
        )}
      </DetailsCard>
    </ProfileContainer>
  );
};

export default Profile;