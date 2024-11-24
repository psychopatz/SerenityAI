import React, { useState, useEffect } from 'react';
import StorageService from '../services/StorageService';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import { getAllMemories } from '../services/MemoryService';
import dc from '../assets/amongus.mp3';

const Diary = () => {
  const [userMemories, setUserMemories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storage = StorageService();

  // Preload sounds
  const soundLikes = new Audio(dc);
  const soundDislikes = new Audio(dc);
  const soundMoodType = new Audio(dc);
  const soundMemories = new Audio(dc);

  useEffect(() => {
    const fetchUserMemories = async () => {
      try {
        const userdata = storage.getLocalStorage('userdata');
        setCurrentUser(userdata);

        if (!userdata) {
          setError('No user data found.');
          setLoading(false);
          return;
        }

        const allMemories = await getAllMemories();
        const userMemoryID = userdata.memoryID;
        const filteredMemories = allMemories.filter(
          (memory) => memory.id === userMemoryID
        );

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
          backgroundColor: '#fff9c4',
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
          alt={`${currentUser?.firstName || 'User'} ${
            currentUser?.lastName || ''
          }`}
          src={
            currentUser?.profilePicture || '/static/images/avatar.png'
          }
        />
        <Typography variant="h6" gutterBottom>
          {`${currentUser?.firstName || 'First Name'} ${
            currentUser?.lastName || 'Last Name'
          }`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Gender:</strong> {currentUser?.gender || 'Not Provided'}
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
              elevation={0}
              sx={{
                margin: '16px auto',
                padding: 3,
                backgroundColor: 'transparent',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>{`Memory ID: ${memory.id}`}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {/* Likes Section */}
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#e3f2fd',
                    borderRadius: 2,
                    opacity: 0.0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#bbdefb',
                      boxShadow: 10,
                      opacity: 1,
                    },
                  }}
                  onMouseEnter={() => soundLikes.play()} // Play sound on hover
                >
                  <Typography variant="subtitle1" color="primary">
                    Likes
                  </Typography>
                  <Typography variant="body2">
                    {memory.likes?.join(', ') || 'No likes'}
                  </Typography>
                </Box>

                {/* Dislikes Section */}
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#ffccbc',
                    borderRadius: 2,
                    opacity: 0.0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#ffab91',
                      boxShadow: 3,
                      opacity: 1,
                    },
                  }}
                  onMouseEnter={() => soundDislikes.play()} // Play sound on hover
                >
                  <Typography variant="subtitle1" color="secondary">
                    Dislikes
                  </Typography>
                  <Typography variant="body2">
                    {memory.dislikes?.join(', ') || 'No dislikes'}
                  </Typography>
                </Box>

                {/* Mood Type Section */}
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#dcedc8',
                    borderRadius: 2,
                    opacity: 0.0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#c5e1a5',
                      boxShadow: 3,
                      opacity: 1,
                    },
                  }}
                  onMouseEnter={() => soundMoodType.play()} // Play sound on hover
                >
                  <Typography variant="subtitle1" color="textPrimary">
                    Mood Type
                  </Typography>
                  <Typography variant="body2">
                    {memory.moodType || 'No mood type'}
                  </Typography>
                </Box>

                {/* Memories Section */}
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: '#ffe0b2',
                    borderRadius: 2,
                    opacity: 0.0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#ffcc80',
                      boxShadow: 3,
                      opacity: 1,
                    },
                  }}
                  onMouseEnter={() => soundMemories.play()} // Play sound on hover
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Memories
                  </Typography>
                  <Typography variant="body2">
                    {memory.memories?.join(', ') || 'No memories'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography align="center">No memories found for this user.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Diary;
