import React, { useState, useEffect } from 'react';
import StorageService from '../services/StorageService';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import { getMemoryById } from '../services/MemoryService'; // Import the getMemoryById service

const Diary = () => {
  const [userMemory, setUserMemory] = useState(null); // State to store the current user's memory
  const [currentUser, setCurrentUser] = useState(null); // State for the current user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storage = StorageService();

  useEffect(() => {
    const fetchUserMemory = async () => {
      try {
        // Retrieve current user from localStorage
        const userdata = storage.getLocalStorage('userdata'); // Assuming 'userdata' is the key
        setCurrentUser(userdata);

        if (!userdata || !userdata.memoryID) {
          setError('No user data or memory ID found.');
          setLoading(false);
          return;
        }

        // Fetch the memory details using memoryID from the user data
        const memory = await getMemoryById(userdata.memoryID);

        if (!memory) {
          setError('Memory not found.');
          setLoading(false);
          return;
        }

        setUserMemory(memory);
      } catch (err) {
        console.error('Error fetching memory:', err); // Debugging
        setError('Failed to fetch memory. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserMemory();
  }, []);

  if (loading) {
    return <p>Loading your diary...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        padding: 3,
        gap: 3,
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          width: '25%',
          backgroundColor: '#fff9c4', // Light yellow background
          borderRadius: 2,
          padding: 3,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            marginBottom: 2,
            boxShadow: 2,
          }}
          alt={`${currentUser?.firstName || 'User'} ${currentUser?.lastName || ''}`}
          src={currentUser?.profilePicture || '/static/images/avatar.png'} // Add profile picture URL if available
        />
        <Typography variant="h6" gutterBottom>
          {`${currentUser?.firstName || 'First Name'} ${currentUser?.lastName || 'Last Name'}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Location:</strong> {currentUser?.location || 'Unknown'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Birthday:</strong> {currentUser?.dateOfBirth || 'Not Provided'}
        </Typography>
      </Box>

      {/* Diary Section */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" align="center" gutterBottom>
          My Memory
        </Typography>
        {userMemory ? (
          <Paper
            elevation={3}
            sx={{
              margin: '16px auto',
              padding: 2,
              backgroundColor: '#fff9c4', // Light yellow background
              width: 'fit-content', // Fit to content
              maxWidth: '100%', // Prevent overflow
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Adding the "lined paper" effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0.1) 0px,
                  rgba(0, 0, 0, 0.1) 1px,
                  transparent 25px
                )`,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h6">{`Memory ID: ${userMemory.id}`}</Typography>
              <Typography>
                <strong>Likes:</strong> {userMemory.likes?.join(', ') || 'No likes'}
              </Typography>
              <Typography>
                <strong>Dislikes:</strong> {userMemory.dislikes?.join(', ') || 'No dislikes'}
              </Typography>
              <Typography>
                <strong>Mood Type:</strong> {userMemory.mood_type || 'No mood type'}
              </Typography>
              <Typography>
                <strong>Memories:</strong> {userMemory.memories?.join(', ') || 'No memories'}
              </Typography>
            </Box>
          </Paper>
        ) : (
          <Typography align="center">No memory found for this user.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Diary;
