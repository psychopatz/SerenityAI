import React, { useState, useRef, useEffect, memo } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
  styled
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { sendChatRequest, analyzeUserInput } from '../services/AiAnalyticsService';
import StorageService from '../services/StorageService';
import { motion } from 'framer-motion';
import smsSound from '../assets/sms.mp3';
import { createMemory, updateMemoryById, getMemoryById } from '../services/MemoryService';
import UserService from '../services/UserService';
import MicrophoneButton from './MicrophoneButton';

const ChatbotBody = styled(Container)(({ theme, isSmallScreen }) => ({
  position: 'relative', // Ensure the pseudo-element is positioned correctly
  height: isSmallScreen ? '100%' : '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  width: '100%',
  paddingTop: isSmallScreen ? '0px' : '64px',
  overflowX: 'hidden',
  maxWidth: '100% !important',
  backdropFilter: 'blur(5px)',


  // Add a pseudo-element for the vignette effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // Allows clicks to pass through
    background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)',
    zIndex: 1, // Ensure the vignette is on top
  },

  // Ensure child content appears above the vignette
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));



const ChatContents = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  width: '100%',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageBubble = styled(Box)(({ theme, role, isSmallScreen }) => ({
  display: 'inline-block',
  padding: theme.spacing(2),
  backgroundColor: role === 'user' ? 'rgba(0, 132, 255, 0.8)' : 'rgba(229, 229, 234, 0.8)',
  color: role === 'user' ? '#ffffff' : '#000000',
  borderRadius: '16px',
  maxWidth: (isSmallScreen ? '100%' : '60%'),
  minWidth: (isSmallScreen ? '40%' : '4%'),
  wordWrap: 'break-word',
  textAlign: role === 'user' ? 'left' : 'left',
  marginBottom: theme.spacing(1),
  marginRight: role === 'user' ? '20px' : '0',
  position: 'relative',
  minHeight: '40px',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    border: role === 'user' ? '10px solid transparent' : '8px solid transparent',
    borderTopColor: role === 'user' ? '#0084ff' : '#e5e5ea',
    left: role === 'user' ? 'auto' : '-8px',
    right: role === 'user' ? '-10px' : 'auto',
  },
}));


const SendButton = styled(Button)(({ theme, isSmallScreen }) => ({
  marginLeft: isSmallScreen ? theme.spacing(1) : theme.spacing(2),
  minWidth: isSmallScreen ? 48 : 'auto',
  backgroundColor: 'rgba(0, 132, 255, 0.5)',
  backdropFilter: 'blur(5px)',
  '&:hover': {
    backgroundColor: 'rgba(0, 132, 255, 0.9)',
  },
  color: '#ffffff',
  borderRadius: '50%',
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  
}));

const InputMessage = styled(TextField)(({ theme, isSmallScreen }) => ({
  flexGrow: 1,
  marginRight: isSmallScreen ? 0 : theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
  borderRadius: '16px', 
  overflow: 'hidden',
  backdropFilter: 'blur(5px)',
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    padding: isSmallScreen ? '4px' : '8px', 
    minHeight: isSmallScreen ? '36px' : '56px',
  },
  '& .MuiOutlinedInput-input': {
    lineHeight: isSmallScreen ? '1.2' : '1.5', 
    color: '#000',
  },
}));


const ChatInterface = ({ isSmallScreen }) => {
  const storageService = StorageService();
  const [messages, setMessages] = useState(() => {
    const storedMessages = storageService.getSessionStorage('chatMessages');
    return storedMessages || [];
  });
  const [input, setInput] = useState('');
  const userdata = storageService.getLocalStorage('userdata');
  if (!userdata) {
    window.location.href = '/login';
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    likes: [],
    dislikes: [],
    memories: [],
    moodtype: []
  });

  const [systemInstruction, setSystemInstruction] = useState('');
  const [includeDate, setIncludeDate] = useState(true);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize analysis data from backend
  useEffect(() => {
    const initializeAnalysisData = async () => {
      if (userdata.memoryID && !isInitialized) {
        try {
          const memoryData = await getMemoryById(userdata.memoryID);
          if (memoryData) {
            setAnalysisData({
              likes: memoryData.likes || [],
              dislikes: memoryData.dislikes || [],
              memories: memoryData.memories || [],
              moodtype: memoryData.moodType ? [memoryData.moodType] : []
            });
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error initializing memory data:', error);
          setError('Failed to load memory data');
        }
      }
    };

    initializeAnalysisData();
  }, [userdata.memoryID, isInitialized]);

  useEffect(() => {
    const formatMemoryArray = (array) => {
      if (!array || array.length === 0) return 'none';
      return array.map((item, index) => `${index + 1}. ${item}`).join('\n');
    };

    setSystemInstruction(
      `Your name is Serenity, you are a professional therapist. The name of your user is ${userdata.lastName}, ${userdata.firstName}. 
      Your job is to help users, especially with their emotional issues. Give them tips and advice.
      Call the user by their first name. 
      When generating responses, always format your outputs in a proper markup language and use emoji to convey emotion.
      
      Here is what you know about the user:
      Likes: ${formatMemoryArray(analysisData.likes)}
      Dislikes: ${formatMemoryArray(analysisData.dislikes)}
      Memories: ${formatMemoryArray(analysisData.memories)}
      Use this information to make your responses more personalized and empathetic.`
    );
  }, [analysisData, userdata]);

  useEffect(() => {
    storageService.setSessionStorage('chatMessages', messages);
  }, []);

  useEffect(() => {
    storageService.setSessionStorage('chatMessages', messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'model') {
      audioRef.current?.play();
    }
  }, [messages]);

  const parseAnalysisResponse = (responseText) => {
    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)```/);
      const jsonText = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.warn('Could not parse sentiment analysis', parseError);
      return null;
    }
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const updateAnalysisData = async (newAnalysis) => {
    if (!newAnalysis) return;

    const updatedData = {
      likes: [...new Set([...analysisData.likes, ...(newAnalysis.likes || [])])],
      dislikes: [...new Set([...analysisData.dislikes, ...(newAnalysis.dislikes || [])])],
      memories: [...new Set([...analysisData.memories, ...(newAnalysis.memories || [])])],
      moodtype: newAnalysis.moodtype || analysisData.moodtype
    };

    setAnalysisData(updatedData);
    
    try {
      if (userdata.memoryID === 0) {
        const response = await createMemory({
          ...updatedData,
          moodType: updatedData.moodtype[0]
        });
        const memoryId = response.id;
        const updatedUserData = { ...userdata, memoryID: memoryId };
        storageService.setLocalStorage('userdata', updatedUserData);
        await UserService.updateUserById(userdata.user_id, {lastLogin:getCurrentDate(), memoryID: memoryId });
        
      } else {
        await updateMemoryById(userdata.memoryID, {
          ...updatedData,
          moodType: updatedData.moodtype[0]
        });
        await UserService.updateUserById(userdata.user_id, {lastLogin:getCurrentDate()});
      }
    } catch (error) {
      console.error('Error updating memory:', error);
      setError('Failed to update memory');
    }
    storageService.setSessionStorage('moodType', updatedData.moodtype[0]);
  };
  

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      parts: [{ text: input }]
    };

    setError('');
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);
    setInput('');

    let isMounted = true;

    try {
      const chatData = {
        includeDate,
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [...messages, userMessage]
      };

      const response = await sendChatRequest(chatData);

      if (response && response.candidates && response.candidates[0]) {
        const aiMessage = response.candidates[0].content;
        if (isMounted) {
          setMessages(prevMessages => [...prevMessages, aiMessage]);
        }
      }

      const analysisResponse = await analyzeUserInput({
        contents: [userMessage]
      });

      if (analysisResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const analysis = parseAnalysisResponse(
          analysisResponse.candidates[0].content.parts[0].text
        );
        await updateAnalysisData(analysis);
      }
    } catch (err) {
      console.error('Chat error:', err);
      if (isMounted) {
        setError('Sorry, an error occurred. Please try again.');
        setMessages(prevMessages => [...prevMessages, {
          role: 'model',
          parts: [{ text: "Sorry, I encountered an error. Could you try again?" }]
        }]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const clearChatHistory = () => {
    setMessages([]);
    storageService.removeSessionStorage('chatMessages');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatbotBody maxWidth="lg" isSmallScreen={isSmallScreen}>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {sentiment && (
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 2 }}>
          Current Sentiment: {sentiment}
        </Typography>
      )}

      <ChatContents>
        {messages.slice(-50).map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: msg.role === 'user' ? 'right' : 'left',
                marginBottom: 2
              }}
            >
              <MessageBubble role={msg.role} isSmallScreen={isSmallScreen}>
                <MarkdownPreview
                  source={msg.parts[0].text}
                  style={{
                    backgroundColor: 'transparent',
                    margin: 0,
                    padding: 0,
                    color: msg.role === 'user' ? '#ffffff' : '#000000'
                  }}
                />
              </MessageBubble>
            </Box>
          </motion.div>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </ChatContents>

      <InputContainer>
      <InputMessage
            fullWidth
            multiline
            maxRows={isSmallScreen ? 2 : 4} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            variant="outlined"
            isSmallScreen={isSmallScreen} 
          />
          <MicrophoneButton setInput={setInput} />
    

    <SendButton
      variant="contained"
      onClick={handleSendMessage}
      disabled={!input.trim() || loading}
      isSmallScreen={isSmallScreen}
    >
      <SendIcon />
    </SendButton>
  </InputContainer>
      <audio ref={audioRef} src={smsSound} />
    </ChatbotBody>
  );
};

export default ChatInterface;