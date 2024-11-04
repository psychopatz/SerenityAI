import axios from "axios";

// Base URL for the API
const API_URL = "http://localhost:8080/api/recommendation";

const RecommendationService = {
  // Fetch all recommendations
  getAllRecommendations: () => axios.get(`${API_URL}/get`),

  // Post a new recommendation
  postRecommendation: (recommendation) => axios.post(`${API_URL}/postRecommendation`, recommendation),

  // Update an existing recommendation
  updateRecommendation: (id, recommendation) => axios.put(`${API_URL}/update/${id}`, recommendation),

  // Delete a recommendation by ID
  deleteRecommendation: (id) => axios.delete(`${API_URL}/delete/${id}`)
};

export default RecommendationService;
