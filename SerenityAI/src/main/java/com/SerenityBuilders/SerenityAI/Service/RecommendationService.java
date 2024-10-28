package com.SerenityBuilders.SerenityAI.service;

import com.SerenityBuilders.SerenityAI.entity.RecommendationEntity;
import com.SerenityBuilders.SerenityAI.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepo;

    // Create
    public RecommendationEntity postRecommendation(RecommendationEntity recommendation) {
        return recommendationRepo.save(recommendation);
    }

    // Read
    public List<RecommendationEntity> getAllRecommendations() {
        return recommendationRepo.findAll();
    }

    // Update
    public RecommendationEntity updateRecommendation(int id, RecommendationEntity newRecommendationDetails) throws NameNotFoundException {
        RecommendationEntity recommendation = new RecommendationEntity();
        try {
            recommendation = recommendationRepo.findById(id).get();
            recommendation.setRecommendationType(newRecommendationDetails.getRecommendationType());
            recommendation.setRecommendationDetails(newRecommendationDetails.getRecommendationDetails());
            recommendation.setDateGiven(newRecommendationDetails.getDateGiven());
        } catch (NoSuchElementException nex) {
            throw new NameNotFoundException("Recommendation " + id + " not found");
        }
        return recommendationRepo.save(recommendation);
    }

    // Delete
    public String deleteRecommendation(int id) {
        recommendationRepo.deleteById(id);
        return "Recommendation Record successfully deleted!";
    }
}
