import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  useTheme,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { getRecommendation } from '../services/AiAnalyticsService';
import { getMemoryById } from '../services/MemoryService';
import StorageService from '../services/StorageService';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { motion } from 'framer-motion';

// Animation keyframes
const colorAnimation = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

// Styled Components
const StyledComponents = {
  Container: styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
    padding: theme.spacing(2),
    width: '100%',
  })),

  Overlay: styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 0,
  }),

  Content: styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: 'transparent',
    boxShadow: 'none',
    textAlign: 'center',
    color: '#ffffff',
    width: '100%',
  })),

  Welcome: styled('h1')(({ theme }) => ({
    color: '#ffffff',
    marginBottom: theme.spacing(2),
    fontSize: '3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '4rem',
    },
  })),

  Loading: styled('h2')(({ theme }) => ({
    color: '#ffffff',
    marginBottom: theme.spacing(2),
    fontSize: '2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.5rem',
    },
  })),

  Recommendation: styled(motion.div)(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    width: '100%',
    color: '#ffffff',
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative',
  })),

  AnimatedBackground: styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '200%',
    background: 'linear-gradient(270deg, #ff8a00, #e52e71, #9c27b0, #2196f3)',
    backgroundSize: '800% 800%',
    animation: `${colorAnimation} 30s ease infinite`,
    opacity: 0.3,
  }),

  MarkdownContent: styled(MarkdownPreview)(({ theme }) => ({
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    color: '#ffffff',
    fontSize: '1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
    '& p': {
      margin: theme.spacing(2, 0),
    },
  })),

};

const Dashboard = () => {
  // Hooks and Services
  const storageService = StorageService();
  const theme = useTheme();

  // State
  const [userData, setUserData] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
 

  // Helper Functions
  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 17) return 'Good Afternoon';
    if (hours >= 17 && hours < 22) return 'Good Evening';
    return 'Good Night';
  };

  const createRequestData = (user, memory) => ({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      lastLogin: user.lastLogin,
    },
    memory: {
      likes: memory?.likes || [],
      dislikes: memory?.dislikes || [],
      memories: memory?.memories || [],
      moodtype: memory?.moodtype || '',
    },
    safetySettings: [],
    generationConfig: {},
  });

  const handleRecommendationResponse = (response) => {
    if (!response?.candidates?.[0]?.content?.parts) {
      console.error('Invalid recommendation response format.');
      return '';
    }
    return response.candidates[0].content.parts.map(part => part.text).join('\n');
  };

  const updateChatMessages = (text) => {
    const chatMessages = storageService.getSessionStorage('chatMessages');
    if (!chatMessages?.length) {
      const newChatMessages = [{
        parts: [{ text }],
        role: 'model',
      }];
      storageService.setSessionStorage('chatMessages', newChatMessages);
      window.dispatchEvent(new Event('chatMessagesUpdated'));
    }
  };

  // Effects
  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = storageService.getLocalStorage('userdata');
      if (!storedUserData) {
        console.error('No user data found in local storage.');
        return;
      }

      setUserData(storedUserData);
      try {
        const memory = storedUserData.memoryID === 0 
          ? { likes: [], dislikes: [], memories: [], moodtype: '' }
          : await getMemoryById(storedUserData.memoryID);
        
        setMemoryData(memory);

        const storedRecommendation = storageService.getSessionStorage('recommendation');
        if (storedRecommendation) {
          setRecommendation(storedRecommendation);
        } else {
          await fetchRecommendation(storedUserData, memory);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleRecommendationUpdated = () => {
      setRecommendation(storageService.getSessionStorage('recommendation'));
    };

    window.addEventListener('recommendationUpdated', handleRecommendationUpdated);
    return () => window.removeEventListener('recommendationUpdated', handleRecommendationUpdated);
  }, []);

  const fetchRecommendation = async (user, memory) => {
    if (!user || !memory) {
      console.error('User data or memory data is missing.');
      return;
    }

    setLoading(true);
    try {
      if (!user.lastLogin) {
        user.lastLogin = new Date().toISOString();
        console.log(user.lastLogin);
      }
      const requestData = createRequestData(user, memory);
      const response = await getRecommendation(requestData);
      const text = handleRecommendationResponse(response);

      setRecommendation(text);
      storageService.setSessionStorage('recommendation', text);
      window.dispatchEvent(new Event('recommendationUpdated'));
      updateChatMessages(text);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render Helpers
  const renderRecommendation = () => (
    <StyledComponents.Recommendation>
      <StyledComponents.AnimatedBackground />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <StyledComponents.MarkdownContent source={recommendation} />
      </Box>
    </StyledComponents.Recommendation>
  );

  const renderContent = () => {
    if (!memoryData) return <StyledComponents.Loading>Loading your memory data...</StyledComponents.Loading>;
    if (loading) return <CircularProgress color="inherit" />;
    if (recommendation) return renderRecommendation();
    return <StyledComponents.Loading>Loading recommendation...</StyledComponents.Loading>;
  };

  return (
    <>
      <StyledComponents.Overlay />
      <StyledComponents.Container>
        <StyledComponents.Content>
          <StyledComponents.Welcome>
            {greeting}{userData ? `, ${userData.firstName}` : ''}!
          </StyledComponents.Welcome>
          {renderContent()}
        </StyledComponents.Content>
      </StyledComponents.Container>

      
    </>
  );
};

export default Dashboard;