package com.SerenityBuilders.SerenityAI.Controller;

import com.SerenityBuilders.SerenityAI.Entity.Sentiment;
import com.SerenityBuilders.SerenityAI.Service.SentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentiment")
@CrossOrigin(origins = "http://localhost:5173")
public class SentimentController {

    private final SentimentService sentimentService;

    @Autowired
    public SentimentController(SentimentService sentimentService) {
        this.sentimentService = sentimentService;
    }

    @PostMapping(value = "/save")
    public ResponseEntity<String> saveSentiment(@RequestBody Sentiment sentiment) {
        sentimentService.saveSentiment(sentiment);
        return ResponseEntity.ok("Sentiment saved successfully");
    }
}

