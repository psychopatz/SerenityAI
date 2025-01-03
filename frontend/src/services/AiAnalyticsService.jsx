// AiAnalyticsService.js
import axios from 'axios';

const API_URL = "http://localhost:8080/api/ai-analysis";

export const sendChatRequest = async (chatData) => {
  try {
    for (let i = 0; i < 5; i++) {
      console.log(`Attempting chat request, attempt ${i + 1}`);
      const response = await axios.post(`${API_URL}/chat`, chatData);
      if (response.status === 200) {
        console.log('Chat request successful');
        console.log("Response data:", response.data);
        return response.data;
      } else {
        console.warn('Retrying chat request, attempt:', i + 1);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }
  } catch (error) {
    console.error('Error in sendChatRequest:', error);
    return null;
  }
};

export const analyzeUserInput = async (userData) => {
  try {
    for (let i = 0; i < 5; i++) {
      console.log(`Attempting to get aiMemoryFramework request, attempt ${i + 1}`);
      const response = await axios.post(`${API_URL}/analyze`, userData);
      if (response.status === 200) {
        console.log('aiMemoryFramework request successful');
        console.log("Response data:", response.data);

        // Assuming the response data now contains a success message
        if (response.data.message === "Memory saved successfully.") {
          console.log("User memory successfully saved to database.");
        }
        return response.data; // Returning the response data as needed
      } else {
        console.warn('Retrying ai memory framework request, attempt:', i + 1);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }
  } catch (error) {
    console.error('Error in aiMemoryFramework:', error);
    return null;
  }
};


export const getRecommendation = async (requestData) => {
  try {
    for (let i = 0; i < 5; i++) {
      console.log(`Attempting recommendation request, attempt ${i + 1}`);
      const response = await axios.post(`${API_URL}/recommendation`, requestData);
      if (response.status === 200) {
        console.log('Recommendation request successful');
        console.log("Response data:", response.data);
        return response.data;
      } else {
        console.warn('Retrying recommendation request, attempt:', i + 1);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }
  } catch (error) {
    console.error('Error in getRecommendation:', error);
    return null;
  }
};

export const transcribeSpeech = async (audioFile) => {
  try {
    const formData = new FormData();
    formData.append('audioFile', audioFile);

    const response = await axios.post('http://localhost:8080/speech', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.status === 200 && response.data.text) {
      console.log('Speech transcription successful');
      console.log('Transcription:', response.data.text);
      return response.data.text;
    } else if (response.data.error) {
      console.warn('Error in transcription:', response.data.error);
      return null;
    } else {
      console.warn('Unexpected response format');
      return null;
    }
  } catch (error) {
    console.error('Error in transcribeSpeech:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return null;
  }
};
