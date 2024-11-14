package com.SerenityBuilders.SerenityAI.Service;

import com.SerenityBuilders.SerenityAI.Entity.Sentiment;
import com.SerenityBuilders.SerenityAI.Repository.SentimentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SentimentService {

    private final SentimentRepository sentimentRepository;

    @Autowired
    public SentimentService(SentimentRepository sentimentRepository) {
        this.sentimentRepository = sentimentRepository;
    }

    public void saveSentiment(Sentiment sentiment) {
        sentimentRepository.save(sentiment);
    }
}
