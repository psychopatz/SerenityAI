import React, { useState, useRef, useEffect } from 'react';
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

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('You are a cat. Your name is Neko.');
  const [includeDate, setIncludeDate] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (role, text) => ({
    role,
    parts: [{ text }]
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    console.log('User input:', userMessage);
    setInput('');
    setError('');
    setLoading(true);

    try {
      // Add user message to chat
      const newMessages = [...messages, formatMessage('user', userMessage)];
      console.log('New messages:', newMessages);
      setMessages(newMessages);

      // Prepare chat request
      const chatData = {
        includeDate,
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: newMessages,
        safetySettings: [],
        generationConfig: {}
      };
      console.log('Chat request data:', chatData);

      // Send chat request
      const responseJson = await sendChatRequest(chatData);
      if (!responseJson) throw new Error('Failed to get response after multiple attempts');

      console.log('Chat response JSON:', responseJson);
      const responseCandidate = responseJson.candidates && responseJson.candidates[0];
      const responseContent = responseCandidate && responseCandidate.content;
      const responseText = responseContent && responseContent.parts && responseContent.parts[0].text;

      if (!responseText) throw new Error('Invalid response format');

      console.log('Chat response text:', responseText);
      setMessages([...newMessages, formatMessage('model', responseText)]);

      // Also analyze sentiment
      const sentimentData = {
        contents: [formatMessage('user', userMessage)],
        safetySettings: [],
        generationConfig: {}
      };
      console.log('Sentiment request data:', sentimentData);

      const sentimentJson = await sendSentimentRequest(sentimentData);
      if (sentimentJson) {
        console.log('Sentiment response JSON:', sentimentJson);
        const sentimentCandidate = sentimentJson.candidates && sentimentJson.candidates[0];
        const sentimentContent = sentimentCandidate && sentimentCandidate.content;
        const sentimentText = sentimentContent && sentimentContent.parts && sentimentContent.parts[0].text;

        if (sentimentText) {
          console.log('Message sentiment:', sentimentText);
          setSentiment(sentimentText);
        }
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setMessages(prevMessages => prevMessages.slice(0, -1)); // Remove the user's message if an error occurs
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
    <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2,
            bgcolor: '#f5f5f5'
          }}
        >
          <Typography variant="h6">
            Current User Mood: {sentiment || 'Unknown'}
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            bgcolor: '#f5f5f5'
          }}
        >
          <Typography variant="h6">System Instruction:</Typography>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            variant="outlined"
            size="small"
          />
          <FormControlLabel
            control={
              <Switch
                checked={includeDate}
                onChange={(e) => setIncludeDate(e.target.checked)}
                color="primary"
              />
            }
            label="Include Date"
            sx={{ mt: 2 }}
          />
        </Paper>
      </Box>
      <Paper 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: '#f5f5f5'
        }}
      >
        {/* Chat Header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6">
            Chatbot Interface Test, gapaabot pako sa inyong database na ma finalize para makaperform nakog rag hehehe
          </Typography>
        </Box>

        {/* Messages Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: msg.role === 'user' ? 'primary.light' : 'white',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography>{msg.parts[0].text}</Typography>
              </Paper>
            </Box>
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
        </Box>

        {/* Input Area */}
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
            <IconButton 
              color="primary" 
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatInterface;
