import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Paper, Typography, Box } from '@mui/material';
import Lottie from "lottie-react";
import ProfileAnimation from '../assets/Profile.json';
import HeartEmojiAnimation from '../assets/HeartEmoji.json';
import DislikeAnimation from '../assets/DislikeAnimation.json';
import { getAllMemories } from '../services/MemoryService';
import StorageService from '../services/StorageService';
import Baymax from "../assets/Baymax.json";

// Keyframes (if needed for animations)
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled Components
const DiaryWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(30),
  gap: theme.spacing(3),
  backdropFilter: 'blur(5px)',
  height: '',


  
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  width: '40%',
  backgroundColor: '#fff9c4',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '500px',
  justifyContent: 'center',
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme.spacing(-10),
  transform: 'translateY(50px)',
  animation: `${fadeIn} 0.5s ease-in-out`,
  marginLeft: '-200px',
}));

const ProfileAnimationWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Achievements = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const MemoriesSection = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const MemoryCard = styled(Paper)(({ theme }) => ({
  margin: `${theme.spacing(2)} auto`,
  padding: theme.spacing(3),
  backgroundColor: 'transparent',
  borderRadius: theme.shape.borderRadius,
}));

const InteractionSection = styled(Box)(({ theme, type }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: type === 'like' ? '#e3f2fd' : '#ffccbc',
  transition: 'background-color 0.3s ease',
}));

// Main component
const Diary = () => {
  const [userMemories, setUserMemories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredAnimation, setHoveredAnimation] = useState(null);

  const storage = StorageService();

  // Preload sounds

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

  // Calculate counts
  const totalLikes = userMemories.reduce((acc, memory) => acc + (memory.likes?.length || 0), 0);
  const totalDislikes = userMemories.reduce((acc, memory) => acc + (memory.dislikes?.length || 0), 0);

  if (loading) {
    return <p>Loading your diary...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
  
    <DiaryWrapper>
      {/* Profile Section */}
      <ProfileSection>
        <ProfileAnimationWrapper>
          <Lottie
            animationData={
              hoveredAnimation === 'like'
                ? HeartEmojiAnimation
                : hoveredAnimation === 'dislike'
                ? DislikeAnimation
                : ProfileAnimation
            }
            style={{
              height: 120,
              width: 120,
            }}
            loop
          />
        </ProfileAnimationWrapper>
        <Typography variant="h6" gutterBottom>
          {`${currentUser?.firstName || 'First Name'} ${currentUser?.lastName || 'Last Name'}`}
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
        <Achievements>
          <Typography variant="h6">Achievements</Typography>
          <Typography variant="body2">
            <strong>Total Likes:</strong> {totalLikes}
          </Typography>
          <Typography variant="body2">
            <strong>Total Dislikes:</strong> {totalDislikes}
          </Typography>
        </Achievements>
      </ProfileSection>

      {/* Diary Section */}
      <MemoriesSection>
        <Typography variant="h4" align="center" gutterBottom>
          My Memories
        </Typography>
        {userMemories.length > 0 ? (
          userMemories.map((memory) => (
            <MemoryCard key={memory.id} elevation={0}>
              <Typography variant="h6" gutterBottom>{`Memory ID: ${memory.id}`}</Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {/* Likes Section */}
                <InteractionSection
                  type="like"
                  onMouseEnter={() => {
                    setHoveredAnimation('like');
                  }}
                  onMouseLeave={() => {
                    setHoveredAnimation(null);
                  }}
                >
                  <Typography variant="subtitle1" color="primary">
                    Likes
                  </Typography>
                  <Typography variant="body2">
                    {memory.likes?.join(', ') || 'No likes'}
                  </Typography>
                </InteractionSection>

                {/* Dislikes Section */}
                <InteractionSection
                  type="dislike"
                  onMouseEnter={() => {
                    setHoveredAnimation('dislike');
                  }}
                  onMouseLeave={() => {
                    setHoveredAnimation(null);
                  }}
                >
                  <Typography variant="subtitle1" color="secondary">
                    Dislikes
                  </Typography>
                  <Typography variant="body2">
                    {memory.dislikes?.join(', ') || 'No dislikes'}
                  </Typography>
                </InteractionSection>
              </Box>
            </MemoryCard>
          ))
        ) : (
          <Typography align="center">No memories found for this user.</Typography>
        )}
      </MemoriesSection>
    </DiaryWrapper>
  );
};

export default Diary;
