package com.SerenityBuilders.SerenityAI.Entity;

import jakarta.persistence.*;

@Entity
public class Sentiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String sentimentValue;

    public Sentiment() {
    }

    public Sentiment(String message, String sentimentValue) {
        this.message = message;
        this.sentimentValue = sentimentValue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSentimentValue() {
        return sentimentValue;
    }

    public void setSentimentValue(String sentimentValue) {
        this.sentimentValue = sentimentValue;
    }
}

