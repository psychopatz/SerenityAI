
import React, { useState, useEffect } from "react";
import RecommendationService from "../services/RecommendationServices";
import './RecommendationApp.css'; 


function RecommendationApp() {
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({
    recommendationType: "",
    recommendationDetails: "",
    dateGiven: ""
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await RecommendationService.getAllRecommendations();
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecommendation({ ...newRecommendation, [name]: value });
  };

  const handleAddRecommendation = async (e) => {
    e.preventDefault();
    try {
      await RecommendationService.postRecommendation(newRecommendation);
      fetchRecommendations(); 
      setNewRecommendation({ recommendationType: "", recommendationDetails: "", dateGiven: "" }); // Reset form
    } catch (error) {
      console.error("Error adding recommendation:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await RecommendationService.deleteRecommendation(id);
      fetchRecommendations(); 
    } catch (error) {
      console.error("Error deleting recommendation:", error);
    }
  };

  return (
    <div className="recommendation-app">
      <h1>Recommendation Management</h1>
      <form onSubmit={handleAddRecommendation} className="recommendation-form">
        <input
          type="text"
          name="recommendationType"
          value={newRecommendation.recommendationType}
          onChange={handleInputChange}
          placeholder="Recommendation Type"
          required
        />
        <textarea
          name="recommendationDetails"
          value={newRecommendation.recommendationDetails}
          onChange={handleInputChange}
          placeholder="Recommendation Details"
          required
        ></textarea>
        <input
          type="date"
          name="dateGiven"
          value={newRecommendation.dateGiven}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Recommendation</button>
      </form>

      <ul className="recommendation-list">
        {recommendations.map((rec) => (
          <li key={rec.recommendation_id}>
            <p><strong>Type:</strong> {rec.recommendationType}</p>
            <p><strong>Details:</strong> {rec.recommendationDetails}</p>
            <p><strong>Date Given:</strong> {new Date(rec.dateGiven).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(rec.recommendation_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecommendationApp;
