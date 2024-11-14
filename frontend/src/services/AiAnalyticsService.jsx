// AiAnalyticsService.js
import axios from 'axios';

export const sendChatRequest = async (chatData) => {
  try {
    for (let i = 0; i < 5; i++) {
      console.log(`Attempting chat request, attempt ${i + 1}`);
      const response = await axios.post('http://localhost:8080/api/ai-analysis/chat', chatData);
      if (response.status === 200) {
        console.log('Chat request successful');
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

export const sendSentimentRequest = async (sentimentData) => {
  try {
    for (let i = 0; i < 5; i++) {
      console.log(`Attempting sentiment request, attempt ${i + 1}`);
      const response = await axios.post('http://localhost:8080/api/ai-analysis/sentiment', sentimentData);
      
      if (response.status === 200) {
        console.log('Sentiment request successful');
        
        const sentimentResponse = response.data;
        const sentimentCandidate = sentimentResponse.candidates && sentimentResponse.candidates[0];
        const sentimentContent = sentimentCandidate && sentimentCandidate.content;
        const sentimentText = sentimentContent && sentimentContent.parts && sentimentContent.parts[0].text;
        
        if (sentimentText) {
          console.log('Sentiment analysis result:', sentimentText);

          // Save sentiment to the database
          await axios.post('http://localhost:8080/api/sentiment/save', {
            message: sentimentData.contents[0].parts[0].text, // Extracted message text
            sentimentValue: sentimentText
          });
          
          console.log('Sentiment data saved to database');
        }
        
        return sentimentResponse;
      } else {
        console.warn('Retrying sentiment request, attempt:', i + 1);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }
  } catch (error) {
    console.error('Error in sendSentimentRequest:', error);
    return null;
  }
};

