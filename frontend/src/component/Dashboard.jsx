// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatboxIframe from './ChatboxIframe'; // Adjust the import path as needed
import { getRecommendation } from '../services/AiAnalyticsService';
import { getMemoryById } from '../services/MemoryService';
import StorageService from '../services/StorageService';
import MarkdownPreview from '@uiw/react-markdown-preview';

// Styled components using MUI's styled API

// Container that centers the content
const CenteredContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Center horizontally
  justifyContent: 'center', // Center vertically
  minHeight: '100vh',
  position: 'relative',
  zIndex: 1, // Ensure content is above the overlay
  padding: theme.spacing(2),
  width: '100%',
}));

// Overlay with blur and dark transparency
const BlurBackgroundOverlay = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent overlay
  backdropFilter: 'blur(5px)', // Apply blur effect
  zIndex: 0, // Place behind the content
}));

// Wrapper for the content with transparent background
const TransparentContentWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'transparent',
  boxShadow: 'none',
  textAlign: 'center',
  color: '#ffffff', // White text for visibility
  width: '100%',
}));

// Welcome message heading
const WelcomeMessage = styled('h1')(({ theme }) => ({
  color: '#ffffff',
  marginBottom: theme.spacing(2),
  fontSize: '3rem', // Base font size
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem', // Smaller font size on small screens
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '4rem', // Larger font size on medium and up screens
  },
}));

// **Add the missing SectionTitle styled component**
const SectionTitle = styled('h2')(({ theme }) => ({
  color: '#ffffff',
  marginBottom: theme.spacing(2),
  fontSize: '2rem', // Base font size
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem', // Smaller font size on small screens
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.5rem', // Larger font size on medium and up screens
  },
}));

// Recommendation content styled for markdown
const RecommendationContent = styled(MarkdownPreview)(({ theme }) => ({
  backgroundColor: 'transparent',
  margin: 0,
  padding: 0,
  color: '#ffffff',
  fontSize: '1rem', // Base font size
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem', // Smaller font size on small screens
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem', // Larger font size on medium and up screens
  },
  '& p': {
    margin: theme.spacing(2, 0),
  },
}));

// Wrapper for the recommendation with transparent dark background spanning full width
const RecommendationWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark background
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  width: '100%', // Full width
  color: '#ffffff',
  boxShadow: 'none',
  textAlign: 'left',
}));

// Chat toggle button styled component
const ChatToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: '#4a90e2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#357ABD',
  },
  zIndex: 1000,
}));

const Dashboard = () => {
  const storageService = StorageService();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [userData, setUserData] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false); // State to manage chat visibility

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  useEffect(() => {
    // Determine the greeting based on current time
    const hours = new Date().getHours();
    let currentGreeting = '';
    if (hours >= 5 && hours < 12) {
      currentGreeting = 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
      currentGreeting = 'Good Afternoon';
    } else if (hours >= 17 && hours < 22) {
      currentGreeting = 'Good Evening';
    } else {
      currentGreeting = 'Good Night';
    }
    setGreeting(currentGreeting);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user data from local storage
      const storedUserData = storageService.getLocalStorage('userdata');

      if (storedUserData) {
        setUserData(storedUserData);

        try {
          // Fetch memory data
          const memory = await getMemoryById(storedUserData.memoryID);
          setMemoryData(memory);

          // Check if recommendation is in session storage
          const storedRecommendation = storageService.getSessionStorage('recommendation');

          if (storedRecommendation) {
            // Use stored recommendation
            setRecommendation(storedRecommendation);
          } else {
            // Fetch new recommendation and store it
            await fetchAndStoreRecommendation(storedUserData, memory);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.error('No user data found in local storage.');
      }
    };

    fetchData();
  }, []);

  const fetchAndStoreRecommendation = async (user, memory) => {
    if (!user || !memory) {
      console.error('User data or memory data is missing.');
      return;
    }

    setLoading(true);

    const requestData = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
      },
      memory: {
        likes: memory.likes,
        dislikes: memory.dislikes,
        memories: memory.memories,
        moodtype: memory.moodtype,
      },
      safetySettings: [],
      generationConfig: {},
    };

    try {
      const recommendationResponse = await getRecommendation(requestData);

      // Extract the text from the response
      let text = '';

      if (
        recommendationResponse &&
        recommendationResponse.candidates &&
        recommendationResponse.candidates.length > 0
      ) {
        const candidate = recommendationResponse.candidates[0];
        if (candidate.content && candidate.content.parts) {
          const parts = candidate.content.parts;
          text = parts.map((part) => part.text).join('\n');
        } else {
          console.error('Invalid recommendation response format.');
        }
      } else {
        console.error('No candidates found in recommendation response.');
      }

      setRecommendation(text);

      // Store the recommendation in session storage
      storageService.setSessionStorage('recommendation', text);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BlurBackgroundOverlay />
      <CenteredContentContainer>
        <TransparentContentWrapper>
          <WelcomeMessage>
            {greeting}
            {userData ? `, ${userData.firstName}!` : '!'}
          </WelcomeMessage>
          {memoryData ? (
            <>
              {loading ? (
                <CircularProgress color="inherit" />
              ) : recommendation ? (
                <RecommendationWrapper>
                  <RecommendationContent source={recommendation} />
                </RecommendationWrapper>
              ) : (
                <SectionTitle>Loading recommendation...</SectionTitle>
              )}
            </>
          ) : (
            <SectionTitle>Loading your memory data...</SectionTitle>
          )}
        </TransparentContentWrapper>
      </CenteredContentContainer>

      {/* Chat Toggle Button - Hidden when chat is visible */}
      {!isChatVisible && (
        <ChatToggleButton onClick={toggleChatVisibility} size="large">
          <ChatBubbleIcon fontSize="large" />
        </ChatToggleButton>
      )}

      {/* ChatboxIframe Component */}
      <ChatboxIframe
        isVisible={isChatVisible}
        toggleChatVisibility={toggleChatVisibility}
      />
    </>
  );
};

export default Dashboard;
