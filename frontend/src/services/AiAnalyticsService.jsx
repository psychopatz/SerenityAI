// AiAnalyticsService.js
import axios from 'axios';

export const sendChatRequest = async (chatData) => {
  try {
    for (let i = 0; i < 5; i++) {
      console.log(`Attempting chat request, attempt ${i + 1}`);
      const response = await axios.post('http://localhost:8080/api/ai-analysis/chat', chatData);
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
      const response = await axios.post('http://localhost:8080/api/ai-analysis/analyze', userData);
      if (response.status === 200) {
        console.log('aiMemoryFramework request successful');
        console.log("Response data:", response.data);
        return response.data;
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
