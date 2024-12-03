import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Paper, Typography, Box } from '@mui/material';
import Lottie from "lottie-react";
import ProfileAnimation from '../assets/Profile.json';
import HeartEmojiAnimation from '../assets/HeartEmoji.json';
import DislikeAnimation from '../assets/DislikeAnimation.json';
import { getAllMemories } from '../services/MemoryService';
import StorageService from '../services/StorageService';

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

const MobileContainer = styled('div')({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Phone = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '331px',
  height: '616px',
  backgroundColor: '#1a1a58',
  borderRadius: '30px',
  padding: '10px',
});

const PhoneMirror = styled('div')({
  position: 'relative',
  width: '328px',
  height: '600px',
  backgroundColor: 'rgb(26, 25, 25)',
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
  boxShadow: theme.shadows[3],
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
  flex: 1, // Allows this section to grow and take available space
  maxWidth: '600px', // Optional: limits the max width
  overflowY: 'auto', // Optional: adds scroll if content overflows
  height: '90%', // Matches the height of the phone
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const MemoryCard = styled(Paper)(({ theme }) => ({
  margin: `${theme.spacing(2)} auto`,
  padding: theme.spacing(3),
  backgroundColor: '#fff', // White background for cards
  borderRadius: theme.shape.borderRadius,
}));

const InteractionSection = styled(Box)(({ theme, type }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: type === 'like' ? '#e0f7fa' : '#ffebee',
  borderRadius: theme.shape.borderRadius,
}));

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
        </PhoneMirror>
      </Phone>

      {/* Memories Section */}
      <MemoriesSection>
        {userMemories.length > 0 ? (
          userMemories.map((memory) => (
            <MemoryCard key={memory.id} elevation={0}>
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
                  onMouseEnter={() => setHoveredAnimation('dislike')}
                  onMouseLeave={() => setHoveredAnimation(null)}
                >
                  <Typography variant="subtitle1" color="secondary">
                    Dislikes
                  </Typography>
                  <Typography variant="body2">
                    {memory.dislikes?.join(', ') || 'No dislikes'}
                  </Typography>
                </InteractionSection>

                {/* Mood Type Section */}
                <InteractionSection
                  type="like"
                  onMouseEnter={() => setHoveredAnimation('like')}
                  onMouseLeave={() => setHoveredAnimation(null)}
                >
                  <Typography variant="subtitle1" color="primary">
                    Current Mood
                  </Typography>
                  <Typography variant="body2">
                    {memory.moodType || 'No mood data available'}
                  </Typography>
                </InteractionSection>

                {/* Memories */}
                <InteractionSection
                  type="like"
                  onMouseEnter={() => setHoveredAnimation('like')}
                  onMouseLeave={() => setHoveredAnimation(null)}
                >
                  <Typography variant="subtitle1" color="primary">
                    Memories
                  </Typography>
                  <Typography variant="body2">
                    {memory.memories?.join(', ') || 'No memories'}
                  </Typography>
                </InteractionSection>
              </Box>
            </MemoryCard>
          ))
        ) : (
          <Typography align="center">No memories found for this user.</Typography>
        )}
      </MemoriesSection>
    </DiaryContainer>
  );
};

export default Diary;
