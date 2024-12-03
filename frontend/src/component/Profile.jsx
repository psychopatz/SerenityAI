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
    IconButton,
    InputAdornment,
  } from "@mui/material";
  import UserService from "../services/UserService";
  import photoUploadService from "../services/PhotoUploadService"; // Assume this is your service for handling photo uploads
  import MaleAvatar from "../assets/male-avatar.png";
  import FemaleAvatar from "../assets/female-avatar.png";
  import DefaultAvatar from "../assets/default-avatar.png";
  import EmailIcon from "@mui/icons-material/Email";
  import LocationOnIcon from "@mui/icons-material/LocationOn";
  import CakeIcon from "@mui/icons-material/Cake";
  import WcIcon from "@mui/icons-material/Wc";
  import Visibility from "@mui/icons-material/Visibility";
  import VisibilityOff from "@mui/icons-material/VisibilityOff";

  // Styled Components
  const ProfileContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: theme.spacing(2),
    backgroundColor: "transparent",
  }));

  const DetailsCard = styled(Paper)(({ theme }) => ({
    width: "90%",
    maxWidth: "700px",
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(145deg, #FFECA1, #98F5F9)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(2),
    alignItems: "center",
    textAlign: "left",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  }));

  const AvatarContainer = styled(Box)(({ theme }) => ({
    gridColumn: "span 2",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
  }));

  const Field = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
    "& strong": {
      fontWeight: theme.typography.fontWeightBold,
    },
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    gridColumn: "span 2",
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontSize: "1rem",
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius,
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

  const HiddenInput = styled("input")({
    display: "none",
  });


  const Profile = () => {
    const [userData, setUserData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      gender: "",
      dateOfBirth: "",
      password: "",
    });
    const [photoId, setPhotoId] = useState("");
    const [photoData, setPhotoData] = useState(null);
    const [message, setMessage] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    useEffect(() => {
      const fetchPhoto = async () => {
        const storedData = JSON.parse(localStorage.getItem("userdata"));
        if (storedData) {
          setUserData(storedData);
          if (storedData.profilePhotoId) {
            try {
              const photoBlob = await photoUploadService.getPhoto(storedData.profilePhotoId);
              const photoUrl = URL.createObjectURL(photoBlob);
              setPhotoData(photoUrl);
            } catch (error) {
              console.error("Error fetching photo:", error);
              setPhotoData(null); // Graceful fallback
            }
          }
        }
      };
      fetchPhoto();
    }, []);
    
    

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const handleSave = async () => {
      if (userData.password && confirmPassword) {
        if (userData.password !== confirmPassword) {
          setSnackbar({ open: true, message: "Passwords do not match!", severity: "error" });
          return;
        }
      } else {
        delete userData.password;
      }

      try {
        const updatedData = await UserService.updateProfile(userData.email, userData);
        localStorage.setItem("userdata", JSON.stringify(updatedData));
        setUserData(updatedData);
        setConfirmPassword("");
        setIsEditing(false);
        setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
      } catch (error) {
        console.error("Failed to update profile:", error);
        setSnackbar({
          open: true,
          message: "Failed to update profile. Please try again.",
          severity: "error",
        });
      }
    };

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };

    const getAvatar = () => {
      if (photoData) {
        return photoData; // Use fetched photo blob URL
      }
      if (userData.profilePhotoId) {
        return `http://localhost:8080/api/photo/${userData.profilePhotoId}`; // Use the photo URL from backend if available
      }
      if (userData.gender?.toLowerCase() === "male") {
        return MaleAvatar;
      } else if (userData.gender?.toLowerCase() === "female") {
        return FemaleAvatar;
      } else {
        return DefaultAvatar;
      }
    };
    
    
    
    const handleUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const response = await photoUploadService.uploadPhoto(file);
          const { id } = response; // Assuming backend returns a photo ID
          const uploadedPhotoUrl = URL.createObjectURL(file); // For immediate preview
          setPhotoData(uploadedPhotoUrl); // Update avatar preview
    
          // Update user profile with the new photo ID
          const { password, ...rest } = userData; // Exclude password
          const updatedUserData = { ...userData, profilePhotoId: id };
          
          // Send the updated user data to the backend to update the profile
          const updatedData = await UserService.updateProfile(userData.email, updatedUserData);
          localStorage.setItem("userdata", JSON.stringify(updatedData)); // Save updated data in local storage
          setUserData(updatedData); // Update state
    
          setSnackbar({ open: true, message: "Photo uploaded and profile updated successfully!", severity: "success" });
        } catch (error) {
          console.error("Error uploading photo:", error);
          setSnackbar({ open: true, message: "Error uploading photo.", severity: "error" });
        }
      }
    };
    
    

    return (
      <ProfileContainer>
        <DetailsCard>
          {/* Avatar Section */}
          <AvatarContainer>
            <label htmlFor="avatar-upload">
              <Avatar src={getAvatar()} alt="User Avatar" />
            </label>
            <HiddenInput
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {`${userData.firstName || "First Name"} ${userData.lastName || "Last Name"}`}
            </Typography>
          </AvatarContainer>
    
          {/* Conditional Rendering for Editing or Viewing */}
          {isEditing ? (
            <Box component="form" sx={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <Box sx={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {/* Profile Fields */}
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
    
              {/* Edit Button */}
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                sx={{ gridColumn: "span 2" }}
              >
                Edit Profile
              </StyledButton>
            </>
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
