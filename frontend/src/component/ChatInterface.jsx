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
import SendIcon from '@mui/icons-material/Send';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { sendChatRequest, analyzeUserInput } from '../services/AiAnalyticsService';
import { motion } from 'framer-motion';

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f0f2f5',
  width: '100%',
  paddingTop: '64px', // Offset for the fixed navigation bar
  overflowX: 'hidden', // Disable horizontal scrolling
  maxWidth: '100% !important', // Ensure full-width display
}));

const StyledBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  width: '100%',
  overflowX: 'hidden', // Disable horizontal scrolling
  display: 'flex',
  flexDirection: 'column-reverse', // Show latest messages at the bottom
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
  },
  width: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0084ff',
  '&:hover': {
    backgroundColor: '#0066cc',
  },
  width: '100%',
}));

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('Your name is Serenity, you are an ai therapist. Your job is to help users especially with their emotional issues. Give them tips and advices. When generating, always format your outputs in a proper markup language and use emoji to show emotion');
  const [includeDate, setIncludeDate] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      parts: [{ text: input }]
    };

    // Reset previous error
    setError('');

    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);
    setInput('');

    let isMounted = true;

    try {
      // Prepare chat request first
      const chatData = {
        includeDate,
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [...messages, userMessage]
      };

      const response = await sendChatRequest(chatData);

      // Extract AI message if available
      if (response && response.candidates && response.candidates[0]) {
        const aiMessage = response.candidates[0].content;
        if (isMounted) {
          setMessages(prevMessages => [...prevMessages, aiMessage]);
        }
      }

      // Analyze sentiment after chat response
      const analysisData = await analyzeUserInput({
        contents: [userMessage]
      });

      // Extract sentiment if available
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
    padding: theme.spacing(2), // Added padding to avoid cramped look
    backgroundColor: role === 'user' ? '#0084ff' : '#e5e5ea',
    color: role === 'user' ? '#ffffff' : '#000000',
    borderRadius: '16px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    textAlign: role === 'user' ? 'right' : 'left',
    marginBottom: theme.spacing(1),
    position: 'relative',
    minHeight: '40px', // Added minimum height to avoid cramped look
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
    <StyledContainer maxWidth="lg">
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

      <Box sx={{ padding: 2, borderTop: '1px solid #e0e0e0', backgroundColor: '#f0f2f5' }}>
        <StyledTextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          variant="outlined"
        />
        <StyledButton
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!input.trim() || loading}
          fullWidth
        >
          Send
        </StyledButton>
      </Box>
    </StyledContainer>
  );
};

export default ChatInterface;
