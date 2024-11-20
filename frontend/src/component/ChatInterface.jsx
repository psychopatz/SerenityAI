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
import SendIcon from '@mui/icons-material/Send';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { sendChatRequest, analyzeUserInput } from '../services/AiAnalyticsService';
import { motion } from 'framer-motion';
import smsSound from '../assets/sms.mp3';

const StyledContainer = styled(Container)(({ theme, isSmallScreen }) => ({
  height: (isSmallScreen ? '100%' : '100vh'),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f0f2f5',
  width: '100%',
  paddingTop: '64px',
  overflowX: 'hidden',
  maxWidth: '100% !important',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  width: '100%',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column-reverse',
}));

const ChatInterface = ({ isSmallScreen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('Your name is Serenity, you are an ai therapist. Your job is to help users especially with their emotional issues. Give them tips and advices. When generating, always format your outputs in a proper markup language and use emoji to show emotion');
  const [includeDate, setIncludeDate] = useState(true);
  const messagesEndRef = useRef(null);

  const audioRef = useRef(null);

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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = styled(Box)(({ theme, role }) => ({
    display: 'inline-block',
    padding: theme.spacing(2),
    backgroundColor: role === 'user' ? '#0084ff' : '#e5e5ea',
    color: role === 'user' ? '#ffffff' : '#000000',
    borderRadius: '16px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    textAlign: role === 'user' ? 'right' : 'left',
    marginBottom: theme.spacing(1),
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
    <StyledContainer maxWidth="lg" isSmallScreen={isSmallScreen}>
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

      <StyledBox>
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
              <MessageBubble role={msg.role}>
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
      </StyledBox>

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
            minWidth: isSmallScreen ? 48 : 'auto',
            backgroundColor: '#0084ff', 
            '&:hover': { backgroundColor: '#0066cc' } 
          }}
        >
          {isSmallScreen ? <SendIcon /> : <VoiceChatIcon />}
        </Button>
      </Box>
      <audio ref={audioRef} src={smsSound} />
    </StyledContainer>
  );
};

export default ChatInterface;
