package com.SerenityBuilders.SerenityAI.Controller;
import com.SerenityBuilders.SerenityAI.util.LlmUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/ai-analysis")
public class ChatbotController {

    private final LlmUtil llmUtil;

    @Autowired
    public ChatbotController(LlmUtil llmUtil) {
        this.llmUtil = llmUtil;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> generateResponse(
            @RequestBody Map<String, Object> request
    ) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> systemInstruction = (Map<String, Object>) request.get("system_instruction");

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> contents = (List<Map<String, Object>>) request.get("contents");

            @SuppressWarnings("unchecked")
            List<Map<String, String>> safetySettings = (List<Map<String, String>>) request.get("safetySettings");

            @SuppressWarnings("unchecked")
            Map<String, Object> generationConfig = (Map<String, Object>) request.get("generationConfig");

            String response = llmUtil.generateResponse(
                    systemInstruction,
                    contents,
                    safetySettings,
                    generationConfig
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/sentiment")
    public ResponseEntity<String> analyzeSentiment(
            @RequestBody Map<String, Object> request
    ) {
        try {
            // Create system instruction for sentiment analysis
            Map<String, Object> systemInstruction = new HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> textPart = new HashMap<>();
            textPart.put("text", "Analyze the sentiment of the following Tweets and classify them as POSITIVE, NEGATIVE, or NEUTRAL.");
            parts.add(textPart);
            systemInstruction.put("parts", parts);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> contents = (List<Map<String, Object>>) request.get("contents");

            @SuppressWarnings("unchecked")
            List<Map<String, String>> safetySettings = (List<Map<String, String>>) request.get("safetySettings");

            @SuppressWarnings("unchecked")
            Map<String, Object> generationConfig = (Map<String, Object>) request.get("generationConfig");

            String response = llmUtil.generateResponse(
                    systemInstruction,
                    contents,
                    safetySettings,
                    generationConfig
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}