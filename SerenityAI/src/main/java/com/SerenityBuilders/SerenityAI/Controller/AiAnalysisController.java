package com.SerenityBuilders.SerenityAI.Controller;
import com.SerenityBuilders.SerenityAI.util.LlmUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;

@RestController
@RequestMapping("/api/ai-analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class AiAnalysisController {

    private final LlmUtil llmUtil;

    @Autowired
    public AiAnalysisController(LlmUtil llmUtil) {
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

            // Determine if the date should be included (default is true)
            boolean includeDate = request.getOrDefault("includeDate", true).equals(Boolean.TRUE);

            if (includeDate) {
                // Get the current date and day of the week
                LocalDate currentDate = LocalDate.now();
                String dayOfWeek = currentDate.getDayOfWeek()
                        .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

                // Generate date information
                String dateInfo = String.format("Today is %s, %s. ", dayOfWeek, currentDate);

                // Append the date information to the first part in the system_instruction
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> parts = (List<Map<String, Object>>) systemInstruction.get("parts");
                if (!parts.isEmpty()) {
                    Map<String, Object> firstPart = parts.get(0);
                    String originalText = (String) firstPart.get("text");
                    firstPart.put("text", dateInfo + originalText);
                }
            }

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
            textPart.put("text", "You are an intelligent assistant designed to analyze user inputs for personal preferences and past experiences. Your task is to determine if the user's input contains:\n" +
                    "\n" +
                    "1. **Likes**: Things the user expresses enjoyment or preference for.\n" +
                    "2. **Dislikes**: Things the user expresses displeasure or aversion toward.\n" +
                    "3. **Memories**: Recollections of specific events, moments, or experiences.\n" +
                    "\n" +
                    "For each input, output the analysis in the following JSON format:\n" +
                    "\n" +
                    "```json\n" +
                    "{\n" +
                    "  \"likes\": [\"list of likes\"],\n" +
                    "  \"dislikes\": [\"list of dislikes\"],\n" +
                    "  \"memories\": [\"list of memories\"]\n" +
                    "}\n");
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