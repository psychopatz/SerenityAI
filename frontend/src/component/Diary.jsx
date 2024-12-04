import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import Lottie from "lottie-react";
import ProfileAnimation from '../assets/Profile.json';
import HeartEmojiAnimation from '../assets/HeartEmoji.json';
import DislikeAnimation from '../assets/DislikeAnimation.json';
import { getAllMemories } from '../services/MemoryService';
import StorageService from '../services/StorageService';
import MemoriesAnimation from '../assets/Memories.json';
import MoodTypeAnimation from '../assets/CurrentMood.json';
import SwingingAnimation from '../assets/Swinging.json';
import JammingAnimation from '../assets/JammingAnimation.json'
// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled Components
const DiaryContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px', // Space between the phone and the diary section
  width: '100%',
  height: '100vh',
  padding: '20px',
});

const Phone = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '331px',
  height: '616px',
  background: 'linear-gradient(45deg, #4caf50, #1a1a58)', // Add gradient
  borderRadius: '30px',
  padding: '10px',
});


const PhoneMirror = styled('div')({
  position: 'relative',
  width: '328px',
  height: '600px',
  backgroundColor: '#ECEBDE',
  borderRadius: '30px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const ProfileSection = styled(Box)(({ theme }) => ({
  width: '90%',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const ProfileAnimationWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Achievements = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const MemoriesSection = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: '600px',
  overflowY: 'auto',
  height: '90%',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  flexDirection: 'column', // Arrange MemoryCards in a column
  alignItems: 'flex-start', // Align cards to the left
  marginTop: theme.spacing(33), // Add space above the section
}));

const InteractionSection = styled(Box)(({ theme, type }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: 
    type === 'like' 
      ? '#EB5B00' 
      : type === 'dislike' 
      ? '#6A669D' 
      : type === 'mood' 
      ? '#d1c4e9' 
      : type === 'memories' 
      ? '#e0f7fa' 
      : '#ffffff', 
  borderRadius: "30px",
}));

const SwingingAnimationWrapper = styled(Box)({
  position: 'absolute',
  top: '50px', // Adjust this value for spacing from the top
  left: '-20px', // Adjust this value for spacing from the right
  zIndex: 10, // Ensure it appears above other elements
  width: '500px', // Set width as per your design
  height: '500px', // Set height as per your design
});

const JammingAnimationWrapper = styled(Box)({
  position: 'absolute',
  bottom: '0px', // Adjust this value for spacing from the top
  right: '10px', // Adjust this value for spacing from the right
  zIndex: 10, // Ensure it appears above other elements
  width: '500px', // Set width as per your design
  height: '500px', // Set height as per your design
});





// Main Diary Component
const Diary = () => {
  const [userMemories, setUserMemories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredAnimation, setHoveredAnimation] = useState(null);

  const storage = StorageService();

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

  const totalLikes = userMemories.reduce((acc, memory) => acc + (memory.likes?.length || 0), 0);
  const totalDislikes = userMemories.reduce((acc, memory) => acc + (memory.dislikes?.length || 0), 0);

  if (loading) {
    return <p>Loading your diary...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <DiaryContainer>
      {/* Wow Animation */}
      <SwingingAnimationWrapper>
        <Lottie animationData={SwingingAnimation} loop style={{ width: '100%', height: '100%' }} />
      </SwingingAnimationWrapper>

      
      {/* Phone Section */}
      <Phone>
        <PhoneMirror>
          <ProfileSection>
            <ProfileAnimationWrapper>
              <Lottie
                animationData={
                  hoveredAnimation === 'like'
                    ? HeartEmojiAnimation
                    : hoveredAnimation === 'dislike'
                    ? DislikeAnimation
                    : hoveredAnimation === 'moodtype'
                    ? MoodTypeAnimation
                    : hoveredAnimation === 'memories'
                    ? MemoriesAnimation
                    : ProfileAnimation
                }
                style={{
                  height: 120,
                  width: 120,
                }}
                loop
              />
            </ProfileAnimationWrapper>
            <Typography variant="h6" gutterBottom fontWeight={'bold'}>
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
              <Typography variant="h6" fontWeight={'bold'}>Achievements</Typography>
              <Typography variant="body2">
                <strong>Total Likes:</strong> {totalLikes}
              </Typography>
              <Typography variant="body2">
                <strong>Total Dislikes:</strong> {totalDislikes}
              </Typography>
            </Achievements>
          </ProfileSection>
        </PhoneMirror>
      </Phone>

      {/* Memories Section */}
      <MemoriesSection>
  {userMemories.length > 0 ? (
    userMemories.map((memory) => (
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
            onMouseEnter={() => setHoveredAnimation('like')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight={"bold"}>
              Likes
            </Typography>
            <Typography variant="body2">
              {memory.likes?.join(', ') || 'No likes'}
            </Typography>
          </InteractionSection>

          {/* Dislikes Section */}
          <InteractionSection
            type="dislike"
            onMouseEnter={() => setHoveredAnimation('dislike')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight={"bold"}>
              Dislikes
            </Typography>
            <Typography variant="body2">
              {memory.dislikes?.join(', ') || 'No dislikes'}
            </Typography>
          </InteractionSection>

          {/* Mood Type Section */}
          <InteractionSection
            type="mood"
            onMouseEnter={() => setHoveredAnimation('moodtype')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight="bold">
              Current Mood
            </Typography>
            <Typography variant="body2">
              {memory.moodType || 'No mood data available'}
            </Typography>
          </InteractionSection>

          {/* Memories */}
          <InteractionSection
            type="memories"
            onMouseEnter={() => setHoveredAnimation('memories')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight="bold">
              Memories
            </Typography>
            <Typography variant="body2">
              {memory.memories?.join(', ') || 'No memories'}
            </Typography>
          </InteractionSection>
        </Box>
    ))
  ) : (
    <Box>
      {/* Render empty sections when no memories exist */}
      <InteractionSection
            type="like"
            onMouseEnter={() => setHoveredAnimation('like')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight={"bold"}>
              Likes
            </Typography>
            <Typography variant="body2">
             No likes
            </Typography>
          </InteractionSection>

          <InteractionSection
            type="dislike"
            onMouseEnter={() => setHoveredAnimation('dislike')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight={"bold"}>
              Dislikes
            </Typography>
            <Typography variant="body2">
             No dislikes
            </Typography>
          </InteractionSection>

          {/* Mood Type Section */}
          <InteractionSection
            type="mood"
            onMouseEnter={() => setHoveredAnimation('moodtype')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight="bold">
              Current Mood
            </Typography>
            <Typography variant="body2">
              No mood data available
            </Typography>
          </InteractionSection>

          {/* Memories */}
          <InteractionSection
            type="memories"
            onMouseEnter={() => setHoveredAnimation('memories')}
            onMouseLeave={() => setHoveredAnimation(null)}
          >
            <Typography variant="subtitle1" color="black" fontWeight="bold">
              Memories
            </Typography>
            <Typography variant="body2">
              No memories
            </Typography>
          </InteractionSection>
    </Box>
  )}
</MemoriesSection>

    </DiaryContainer>
  );
};

export default Diary;
