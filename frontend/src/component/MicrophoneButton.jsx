import React, { useState } from 'react';
import { transcribeSpeech } from '../services/AiAnalyticsService';
import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import Box from '@mui/material/Box';

const AnimatedButton = styled(({ isRecording, ...other }) => <IconButton {...other} />)(({ theme, isRecording }) => ({
  width: 60,
  height: 60,
  transition: 'transform 0.3s ease-in-out',
  transform: isRecording ? 'scale(1.1)' : 'scale(1)',
  background: isRecording
    ? `radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)`
    : theme.palette.primary.main,
  animation: isRecording ? 'pulseRed 1.5s infinite ease-in-out' : 'none',
  '@keyframes pulseRed': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.2)', backgroundSize: '120%' },
    '100%': { transform: 'scale(1)' },
  },
  color: theme.palette.common.white,
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

const MicrophoneButton = ({ setInput }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleAudioInput = async (audioBlob) => {
    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
    try {
      const result = await transcribeSpeech(audioFile);
      console.log('Full Transcription Response:', result);
      
      // Check if result is a string directly
      const transcribedText = typeof result === 'string' 
        ? result 
        : result?.text || '';
  
      if (transcribedText) {
        setInput(transcribedText);
        console.log('Transcription Text:', transcribedText);
      } else {
        console.error('Transcription failed or returned empty text');
      }
    } catch (error) {
      console.error('Error during transcription:', error);
    }
  };
  

  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      console.error('MediaDevices API or MediaRecorder not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await handleAudioInput(audioBlob);
        setIsRecording(false);
        setCountdown(5); // Reset countdown
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('Recording started...');

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            mediaRecorder.stop();
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <AnimatedButton onClick={startRecording} disabled={isRecording} isRecording={isRecording}>
        {isRecording ? countdown : <MicIcon />}
      </AnimatedButton>
    </Box>
  );
};

export default MicrophoneButton;
