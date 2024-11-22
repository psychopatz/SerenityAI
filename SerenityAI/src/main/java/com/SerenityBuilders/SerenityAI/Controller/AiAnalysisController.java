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
                System.out.println("Analyze Systemprompt =" + systemInstruction);
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
                        generationConfig);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
            }
        }

        @PostMapping("/recommendation")
        public ResponseEntity<String> generateRecommendation(@RequestBody Map<String, Object> request) {
            try {
                // Extract user and memory information from request
                Map<String, Object> userMap = (Map<String, Object>) request.get("user");
                Map<String, Object> memoryMap = (Map<String, Object>) request.get("memory");

                // Get user details
                String firstName = (String) userMap.get("firstName");
                String lastName = (String) userMap.get("lastName");
                String dateOfBirth = (String) userMap.get("dateOfBirth");
                LocalDate userBirthDate = LocalDate.parse(dateOfBirth);
                LocalDate today = LocalDate.now();

                // Create system instruction for generating recommendation
                Map<String, Object> systemInstruction = new HashMap<>();
                List<Map<String, String>> parts = new ArrayList<>();
                Map<String, String> textPart = new HashMap<>();

                // Randomly select a topic for the greeting
                String[] topics = { "likes", "dislikes", "memories", "moodtype" };
                String selectedTopic = topics[new Random().nextInt(topics.length)];

                StringBuilder prompt = new StringBuilder();
                switch (selectedTopic) {
                    case "likes":
                        prompt.append(String.format(
                                "Hey %s, I heard you've been enjoying %s lately! What's your favorite thing about it?\n\n",
                                firstName, memoryMap.get("likes")));
                        break;
                    case "dislikes":
                        prompt.append(String.format(
                                "Hey %s, I know you're not a fan of %s. What's something you'd rather do instead?\n\n",
                                firstName, memoryMap.get("dislikes")));
                        break;
                    case "memories":
                        prompt.append(String.format(
                                "Hey %s, I heard you have some great memories of %s! What's your favorite part about it?\n\n",
                                firstName, memoryMap.get("memories")));
                        break;
                    case "moodtype":
                        prompt.append(
                                String.format("Hey %s, I can tell you're feeling %s today! What's on your mind?\n\n",
                                        firstName, memoryMap.get("moodtype")));
                        break;
                }

                // Birthday greeting logic
                if (userBirthDate.equals(today)) {
                    prompt.append(String.format(
                            "Today is %s's birthday! Make sure to greet them warmly and include a present emoji related to their likes if possible.\n\n",
                            firstName));
                }

                // Add user preferences to the prompt
                prompt.append(
                        "Based on the user's likes, dislikes, and memories, choose a specific topic to recommend that the user might enjoy.\n");
                prompt.append("Likes: " + memoryMap.get("likes") + "\n");
                prompt.append("Dislikes: " + memoryMap.get("dislikes") + "\n");
                prompt.append("Memories: " + memoryMap.get("memories") + "\n");
                prompt.append("Format your output using markdown language\n");

                textPart.put("text", prompt.toString());
                parts.add(textPart);
                systemInstruction.put("parts", parts);
                System.out.println("Recommend Systemprompt =" + systemInstruction);
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
