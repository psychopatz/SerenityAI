import React, { useState, useEffect } from 'react';
import StorageService from '../services/StorageService';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import { getAllMemories } from '../services/MemoryService'; // Import function to fetch memories from the database

const Diary = () => {
  const [userMemories, setUserMemories] = useState([]); // State to store user's memories
  const [currentUser, setCurrentUser] = useState(null); // State for the current user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storage = StorageService();

  useEffect(() => {
    const fetchUserMemories = async () => {
      try {
        // Retrieve current user from localStorage
        const userdata = storage.getLocalStorage('userdata'); // Assuming 'userdata' is the key
        setCurrentUser(userdata);

        if (!userdata) {
          setError('No user data found.');
          setLoading(false);
          return;
        }

        // Fetch memories from the database
        const allMemories = await getAllMemories(); // Fetch all memories from the API

        // Filter memories for the current user based on memoryID
        const userMemoryID = userdata.memoryID;
        const filteredMemories = allMemories.filter(memory => memory.id === userMemoryID);

        setUserMemories(filteredMemories);
      } catch (err) {
        setError('Failed to fetch memories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserMemories();
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
          My Memories
        </Typography>
        {userMemories.length > 0 ? (
          userMemories.map((memory) => (
            <Paper
              key={memory.id}
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
                <Typography variant="h6">{`Memory ID: ${memory.id}`}</Typography>
                <Typography>
                  <strong>Likes:</strong> {memory.likes?.join(', ') || 'No likes'}
                </Typography>
                <Typography>
                  <strong>Dislikes:</strong> {memory.dislikes?.join(', ') || 'No dislikes'}
                </Typography>
                <Typography>
                  <strong>Mood Type:</strong> {memory.moodType || 'No mood type'}
                </Typography>
                <Typography>
                  <strong>Memories:</strong> {memory.memories?.join(', ') || 'No Memories type'}
                </Typography>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography align="center">
            No memories found for this user.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Diary;
