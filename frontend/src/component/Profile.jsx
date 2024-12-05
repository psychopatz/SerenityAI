import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  styled,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { keyframes } from "@mui/system";
import UserService from "../services/UserService";
import photoUploadService from "../services/PhotoUploadService";
import StorageService from "../services/StorageService";
import ChangePassword from "./ChangePassword";
import ImageOverlay from "./ImageOverlay";

// Icons
import { Email, LocationOn, Cake, Wc, CameraAlt } from "@mui/icons-material";

// Avatars
import MaleAvatar from "../assets/male-avatar.png";
import FemaleAvatar from "../assets/female-avatar.png";
import DefaultAvatar from "../assets/default-avatar.png";

// Pulsating Animation
const pulsate = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }
`;

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
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 140,
  height: 140,
  margin: "auto", 
  cursor: "pointer",
}));

const AvatarImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
  border: "6px solid #E8E8E8",
  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
}));

const CameraIcon = styled(CameraAlt)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "50%",
  padding: "4px",
  fontSize: "1.2rem",
  color: "#000",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    animation: `${pulsate} 1.5s infinite`,
  },
}));

const ProfileField = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& strong": {
    fontWeight: theme.typography.fontWeightBold,
    marginLeft: theme.spacing(1),
  },
}));

const Profile = () => {
  const storageService = StorageService();
  const [userData, setUserData] = useState(
    storageService.getLocalStorage("userdata") || {}
  );
  const [photoData, setPhotoData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State to control the ChangePassword dialog
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // State to control the ImageOverlay
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Avatar selection logic
  const getAvatar = () => {
    if (photoData) {
      return photoData;
    }

    const gender = userData.gender?.toLowerCase();
    return gender === "male"
      ? MaleAvatar
      : gender === "female"
      ? FemaleAvatar
      : DefaultAvatar;
  };

  useEffect(() => {
    const fetchPhoto = async () => {
      if (userData?.profilephoto_id) {
        try {
          const photoBlob = await photoUploadService.getPhoto(
            userData.profilephoto_id
          );
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhotoData(reader.result);
          };
          reader.readAsDataURL(photoBlob);
        } catch (error) {
          console.error("Error fetching photo:", error);
          setPhotoData(null);
        }
      }
    };
    fetchPhoto();
  }, [userData?.profilephoto_id]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await photoUploadService.uploadPhoto(file);
      const photoId = response;

      const updatedUserData = {
        ...userData,
        profilephoto_id: photoId,
      };

      setUserData(updatedUserData);
      storageService.setLocalStorage("userdata", updatedUserData);

      await UserService.updateUserById(userData.user_id, {
        profilephoto_id: photoId,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result);
      };
      reader.readAsDataURL(file);

      setSnackbar({
        open: true,
        message: "Photo uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      setSnackbar({
        open: true,
        message: `Failed to upload photo: file is too large.`,
        severity: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      await UserService.updateUserById(userData.user_id, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        location: userData.location,
        gender: userData.gender,
        birthday: userData.birthday,
        profilephoto_id: userData.profilephoto_id,
      });
      storageService.setLocalStorage("userdata", userData);

      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Update failed:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    }
  };

  const handleAvatarClick = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <ProfileContainer>
      <DetailsCard>
        <Box sx={{ gridColumn: "span 2", textAlign: "center" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
            id="avatar-upload"
          />

          <AvatarContainer onClick={handleAvatarClick}>
            <AvatarImage src={getAvatar()} alt="User Avatar" />
            <Tooltip title="Change Profile Image" arrow>
              <label
                htmlFor="avatar-upload"
                style={{ position: "absolute", bottom: 5, right: 5 }}
                onClick={(event) => event.stopPropagation()}
              >
                <CameraIcon />
              </label>
            </Tooltip>
          </AvatarContainer>

          {isOverlayOpen && (
            <ImageOverlay imageSrc={getAvatar()} onClose={handleCloseOverlay} />
          )}

          <Typography variant="h5" fontWeight="bold">
            {`${userData.firstName || "First Name"} ${userData.lastName || "Last Name"}`}
          </Typography>
        </Box>

        {isEditing ? (
          <Box
            sx={{
              gridColumn: "span 2",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            {["firstName", "lastName", "email", "location", "gender"].map(
              (field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={userData[field] || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  fullWidth
                />
              )
            )}
            <TextField
              label="Birthday"
              type="date"
              value={userData.dateOfBirth || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  dateOfBirth: e.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Box
              sx={{
                gridColumn: "span 2",
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Box>
            <Box sx={{ gridColumn: "span 2", textAlign: "center", mt: 2 }}>
              <Button
                variant="text"
                color="secondary"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <ProfileField>
              <Email color="primary" />
              <strong>Email:</strong> {userData.email || "Not provided"}
            </ProfileField>
            <ProfileField>
              <LocationOn color="primary" />
              <strong>Location:</strong> {userData.location || "Not provided"}
            </ProfileField>
            <ProfileField>
              <Wc color="primary" />
              <strong>Gender:</strong> {userData.gender || "Not provided"}
            </ProfileField>
            <ProfileField>
              <Cake color="primary" />
              <strong>Birthday:</strong>{" "}
              {userData.dateOfBirth || "Not provided"}
            </ProfileField>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{ gridColumn: "span 2", mt: 2 }}
            >
              Edit Profile
            </Button>
          </>
        )}
      </DetailsCard>

      <ChangePassword
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
