import axios from "axios";

const API_URL = "http://localhost:8080/api/recommendation";

const RecommendationService = {
  getAllRecommendations: () => axios.get(`${API_URL}/get`),
  postRecommendation: (recommendation) => axios.post(`${API_URL}/postRecommendation`, recommendation),
  updateRecommendation: (id, recommendation) => axios.put(`${API_URL}/update/${id}`, recommendation),
  deleteRecommendation: (id) => axios.delete(`${API_URL}/delete/${id}`)
};

export default RecommendationService;
