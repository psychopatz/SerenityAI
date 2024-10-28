package com.SerenityBuilders.SerenityAI.repository;

import com.SerenityBuilders.SerenityAI.entity.RecommendationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendationRepository extends JpaRepository<RecommendationEntity, Integer> {
    // Additional query methods can be defined here if needed
}
