    package com.SerenityBuilders.SerenityAI.Controller;

    import java.time.LocalDate;
    import java.time.format.TextStyle;
    import java.util.ArrayList;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Locale;
    import java.util.Map;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.SerenityBuilders.SerenityAI.Repository.MemoryRepository;
import com.SerenityBuilders.SerenityAI.util.LlmUtil;

    @RestController
    @RequestMapping("/api/ai-analysis")
    @CrossOrigin(origins = "http://localhost:5173")
    public class AiAnalysisController {

        private final LlmUtil llmUtil;
        private final MemoryRepository memoryRepository;

        @Autowired
        public AiAnalysisController(LlmUtil llmUtil, MemoryRepository memoryRepository) {
            this.llmUtil = llmUtil;
            this.memoryRepository = memoryRepository;
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
                    // Append the current date and day of the week to system_instruction
                    LocalDate currentDate = LocalDate.now();
                    String dayOfWeek = currentDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                    String dateInfo = String.format("Today is %s, %s. ", dayOfWeek, currentDate);

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) systemInstruction.get("parts");
                    if (!parts.isEmpty()) {
                        Map<String, Object> firstPart = parts.get(0);
                        String originalText = (String) firstPart.get("text");
                        firstPart.put("text", dateInfo + originalText);
                    }
                }

                String response = llmUtil.generateResponse(systemInstruction, contents, safetySettings, generationConfig);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
            }
        }
        @PostMapping("/analyze")
        public ResponseEntity<String> aiMemoryFramework(
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
                        "4. **MoodType**: This is what the user is feeling based on the input  like Happy, sad, angry, neutral\n" +
                        "\n" +
                        "For each input, output the analysis in the following JSON format:\n" +
                        "\n" +
                        "```json\n" +
                        "{\n" +
                        "  \"likes\": [\"list of likes\"],\n" +
                        "  \"dislikes\": [\"list of dislikes\"],\n" +
                        "  \"memories\": [\"list of memories\"]\n" +
                        "  \"moodtype\": [\"emotion\"]\n" +
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
