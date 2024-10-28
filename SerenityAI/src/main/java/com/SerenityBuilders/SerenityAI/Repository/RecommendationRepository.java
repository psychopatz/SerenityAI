package com.SerenityBuilders.SerenityAI.Repository;

import com.SerenityBuilders.SerenityAI.Entity.RecommendationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendationRepository extends JpaRepository<RecommendationEntity, Integer> {
    // Additional query methods can be defined here if needed
}
