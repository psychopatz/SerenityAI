package com.SerenityBuilders.SerenityAI.Repository;

import com.SerenityBuilders.SerenityAI.Entity.Sentiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentimentRepository extends JpaRepository<Sentiment, Long> {
    // Additional query methods can be defined here if needed
}
