import React, { useState, useRef, useEffect } from 'react';
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
import VoiceChatIcon from '@mui/icons-material/VoiceChat';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { sendChatRequest, analyzeUserInput } from '../services/AiAnalyticsService';
import StorageService from '../services/StorageService'; // Import StorageService
import { motion } from 'framer-motion';
import smsSound from '../assets/sms.mp3';

const ChatbotBody = styled(Container)(({ theme, isSmallScreen }) => ({
  height: (isSmallScreen ? '100%' : '100vh'),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f0f2f5',
  width: '100%',
  paddingTop: (isSmallScreen ? '0px' : '64px'),
  overflowX: 'hidden',
  maxWidth: '100% !important',
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

const ChatInterface = ({ isSmallScreen }) => {
  const storageService = StorageService(); // Initialize StorageService
  const [messages, setMessages] = useState(() => {
    // Initialize messages from session storage or empty array
    const storedMessages = storageService.getSessionStorage('chatMessages');
    return storedMessages || [];
  });
  const [input, setInput] = useState('');
  const userdata = storageService.getLocalStorage('userdata')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [systemInstruction, setSystemInstruction] = useState(`Your name is Serenity, you are an ai therapist. The name of your user is ${userdata.lastName}, ${userdata.firstName}.Your job is to help users especially with their emotional issues. Give them tips and advices.Call the user by their firstname.  When generating, always format your outputs in a proper markup language and use emoji to show emotion`);
  const [includeDate, setIncludeDate] = useState(true);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Update session storage whenever messages change
  useEffect(() => {
    storageService.setSessionStorage('chatMessages', messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'model') {
      audioRef.current?.play();
    }
  }, [messages]);

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

      const analysisData = await analyzeUserInput({
        contents: [userMessage]
      });

      if (analysisData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        try {
          const analysis = JSON.parse(analysisData.candidates[0].content.parts[0].text);
          if (isMounted) {
            setSentiment(analysis.moodtype?.[0] || '');
            console.log('Sentiment:', analysis.moodtype);
          }
        } catch (parseError) {
          console.warn('Could not parse sentiment analysis');
        }
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

  // Add a method to clear chat history
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

  const MessageBubble = styled(Box)(({ theme, role, isSmallScreen }) => ({
    display: 'inline-block',
    padding: theme.spacing(2),
    backgroundColor: role === 'user' ? '#0084ff' : '#e5e5ea',
    color: role === 'user' ? '#ffffff' : '#000000',
    borderRadius: '16px',
    maxWidth: '60%',
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

      <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, borderTop: '1px solid #e0e0e0', backgroundColor: '#f0f2f5' }}>
        <TextField
          fullWidth
          multiline
          maxRows={isSmallScreen ? 2 : 4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          variant="outlined"
          sx={{ 
            flexGrow: 1, 
            marginRight: isSmallScreen ? 0 : 1 
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!input.trim() || loading}
          sx={{ 
            marginLeft: isSmallScreen ? 1 : 2,
            minWidth: isSmallScreen ? 48 : 'auto',
            backgroundColor: '#0084ff', 
            '&:hover': { backgroundColor: '#0066cc' } 
          }}
        >
          {isSmallScreen ? <VoiceChatIcon /> : <VoiceChatIcon />}
        </Button>
       

        {/* 
        <Button
          variant="outlined"
          onClick={clearChatHistory}
          sx={{ 
            marginLeft: 1,
            color: '#0084ff', 
            borderColor: '#0084ff',
            '&:hover': { backgroundColor: '#f0f0f0' } 
          }}
        >
          Clear Chat
        </Button> */}

      </Box>
      <audio ref={audioRef} src={smsSound} />
    </ChatbotBody>
  );
};

export default ChatInterface;