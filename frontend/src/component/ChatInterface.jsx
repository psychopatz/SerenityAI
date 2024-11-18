import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Paper,
  TextField,
  IconButton,
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Send as SendIcon, SentimentSatisfiedAlt as EmojiIcon } from '@mui/icons-material';
import { sendChatRequest, sendSentimentRequest } from '../services/AiAnalyticsService';


const StyledContainer = styled(Container)({
  height: '100vh',
  padding: '32px',
  marginTop: '80px',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  display: 'flex',
  justifyContent: 'space-between',
}));

const MessagesArea = styled(Box)({
  flex: 1,
  overflow: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const MessageBox = styled(Box)(({ alignSelf }) => ({
  alignSelf,
  maxWidth: '70%',
}));

const MessagePaper = styled(Paper)(({ theme, role }) => ({
  padding: theme.spacing(2),
  backgroundColor: role === 'user' ? theme.palette.primary.light : 'white',
  color: role === 'user' ? 'white' : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
}));

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('You are a therapist. Your name is doctor');
  const [includeDate, setIncludeDate] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (role, text) => ({
    role,
    parts: [{ text }],
  });

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = input;
    setInput('');
    setError('');
    setLoading(true);
  
    try {
      const newMessages = [...messages, formatMessage('user', userMessage)];
      setMessages(newMessages);
  
      const chatData = {
        includeDate,
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: newMessages,
        safetySettings: [],
        generationConfig: {},
      };
  
      const responseJson = await sendChatRequest(chatData);
      if (!responseJson) throw new Error('Failed to get response after multiple attempts');
  
      const responseCandidate = responseJson.candidates && responseJson.candidates[0];
      const responseContent = responseCandidate && responseCandidate.content;
      const responseText = responseContent && responseContent.parts && responseContent.parts[0].text;
  
      if (!responseText) throw new Error('Invalid response format');
  
      setMessages([...newMessages, formatMessage('model', responseText)]);
  
      const sentimentData = {
        contents: [formatMessage('user', userMessage)],
        safetySettings: [],
        generationConfig: {},
      };
  
      const sentimentJson = await sendSentimentRequest(sentimentData);
      if (sentimentJson) {
        const sentimentCandidate = sentimentJson.candidates && sentimentJson.candidates[0];
        const sentimentContent = sentimentCandidate && sentimentCandidate.content;
        const sentimentText = sentimentContent && sentimentContent.parts && sentimentContent.parts[0].text;
  
        if (sentimentText) {
          setSentiment(sentimentText);
  
          // Save sentiment to the database
          await fetch('/api/sentiment/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: userMessage,
              sentimentValue: sentimentText,
            }),
          });
        }
      }
    } catch (err) {
      setError(err.message);
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <StyledPaper elevation={3}>
          <Typography variant="h6">Current User Mood: {sentiment || 'Unknown'}</Typography>
        </StyledPaper>
      
      </Box>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
        <ChatHeader>
           <Typography variant="h6">Baymax </Typography>
        </ChatHeader>
        <MessagesArea>
          {messages.map((msg, index) => (
            <MessageBox key={index} alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
              <MessagePaper elevation={1} role={msg.role}>
                <Typography>{msg.parts[0].text}</Typography>
              </MessagePaper>
            </MessageBox>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <div ref={messagesEndRef} />
        </MessagesArea>
        <Box sx={{ p: 2, bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="primary">
              <EmojiIcon />
            </IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              variant="outlined"
              size="small"
            />
            <IconButton color="primary" onClick={handleSend} disabled={loading || !input.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </StyledContainer>
  );
};

export default ChatInterface;
