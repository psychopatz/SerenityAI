package com.SerenityBuilders.SerenityAI.util;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Component
public class LlmUtil {
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LlmUtil() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // Default safety settings
    private static final List<Map<String, String>> DEFAULT_SAFETY_SETTINGS = new ArrayList<Map<String, String>>() {{
        add(createSafetySetting("HARM_CATEGORY_HARASSMENT", "BLOCK_NONE"));
        add(createSafetySetting("HARM_CATEGORY_HATE_SPEECH", "BLOCK_NONE"));
        add(createSafetySetting("HARM_CATEGORY_SEXUALLY_EXPLICIT", "BLOCK_NONE"));
        add(createSafetySetting("HARM_CATEGORY_DANGEROUS_CONTENT", "BLOCK_NONE"));
        add(createSafetySetting("HARM_CATEGORY_CIVIC_INTEGRITY", "BLOCK_NONE"));
    }};

    // Default generation config
    private static final Map<String, Object> DEFAULT_GENERATION_CONFIG = new HashMap<String, Object>() {{
        put("stopSequences", new ArrayList<>());
        put("temperature", 1.0);
        put("maxOutputTokens", 800);
        put("topP", 0.8);
        put("topK", 10);
    }};

    private static Map<String, String> createSafetySetting(String category, String threshold) {
        Map<String, String> setting = new HashMap<>();
        setting.put("category", category);
        setting.put("threshold", threshold);
        return setting;
    }

    public String generateResponse(
            Map<String, Object> systemInstruction,
            List<Map<String, Object>> contents,
            List<Map<String, String>> safetySettings,
            Map<String, Object> generationConfig
    ) throws Exception {
        // Use default values if optional parameters are null
        if (safetySettings == null) {
            safetySettings = DEFAULT_SAFETY_SETTINGS;
        }
        if (generationConfig == null) {
            generationConfig = DEFAULT_GENERATION_CONFIG;
        }

        // Construct request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("system_instruction", systemInstruction);
        requestBody.put("contents", contents);
        requestBody.put("safetySettings", safetySettings);
        requestBody.put("generationConfig", generationConfig);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create HTTP entity
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Construct full URL with API key
        String fullUrl = apiUrl + "?key=" + apiKey;

        // Make the request
        ResponseEntity<String> response = restTemplate.postForEntity(
                fullUrl,
                requestEntity,
                String.class
        );

        // Check response status
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("API request failed with status code: " + response.getStatusCode() +
                    ", response: " + response.getBody());
        }

        return response.getBody();
    }
}