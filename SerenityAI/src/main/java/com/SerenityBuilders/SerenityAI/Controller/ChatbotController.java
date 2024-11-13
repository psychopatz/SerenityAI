package com.SerenityBuilders.SerenityAI.Controller;
import com.SerenityBuilders.SerenityAI.util.LlmUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
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
}

