package com.SerenityBuilders.SerenityAI.Controller;

import com.SerenityBuilders.SerenityAI.Entity.RecommendationEntity;
import com.SerenityBuilders.SerenityAI.Service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Adjust based on your frontend URL
@RequestMapping("/api/recommendation")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping(value = "/postRecommendation")
    public ResponseEntity<RecommendationEntity> postRecommendation(@RequestBody RecommendationEntity recommendation) {
        RecommendationEntity savedRecommendation = recommendationService.postRecommendation(recommendation);
        return new ResponseEntity<>(savedRecommendation, HttpStatus.CREATED);
    }

    @GetMapping(value = "/get")
    public ResponseEntity<List<RecommendationEntity>> getAllRecommendations() {
        List<RecommendationEntity> recommendations = recommendationService.getAllRecommendations();
        return new ResponseEntity<>(recommendations, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RecommendationEntity> updateRecommendation(@PathVariable("id") int id, @RequestBody RecommendationEntity newRecommendationDetails) throws Exception {
        RecommendationEntity updatedRecommendation = recommendationService.updateRecommendation(id, newRecommendationDetails);
        return new ResponseEntity<>(updatedRecommendation, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRecommendation(@PathVariable("id") int id) {
        String response = recommendationService.deleteRecommendation(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
