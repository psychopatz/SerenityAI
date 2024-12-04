    package com.SerenityBuilders.SerenityAI.Controller;

    import java.time.LocalDate;
    import java.time.format.DateTimeFormatter;
    import java.time.format.TextStyle;
    import java.time.temporal.ChronoUnit;
    import java.util.*;

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
                        "4. **MoodType**: This is what the user is feeling based on the input  like happy, sad, angry, worried, excited or  calm. use calm if you cant express it.\n" +
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


        // Reusable method to calculate the number of days elapsed between two dates
        private long calculateTimeElapse(LocalDate lastLogin, LocalDate currentDate) {
            return ChronoUnit.DAYS.between(lastLogin, currentDate);
        }

        // Reusable method to format a LocalDate into "Saturday, June 20, 2012"
        private String dateFormatter(LocalDate date) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
            return date.format(formatter);
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

                // Get lastLogin date
                String lastLoginStr = (String) userMap.get("lastLogin");
                LocalDate lastLoginDate = null;

                if (lastLoginStr != null && !lastLoginStr.isEmpty()) {
                    lastLoginDate = LocalDate.parse(lastLoginStr);
                }
                // Initialize loginMessage
                String loginMessage;

                if (lastLoginDate == null) {
                    // First time login
                    loginMessage = "- This is the user's first login to SerenityAI, Welcome the user and ask question about what their gonna do.";
                } else {
                    // Calculate time elapsed since last login
                    long daysElapsed = calculateTimeElapse(lastLoginDate, today);
                    String formattedLastLogin = dateFormatter(lastLoginDate);

                    // Determine the message based on days elapsed
                    if(daysElapsed == 0){
                        loginMessage = "- The user logged in earlier today.\n";
                    } else if (daysElapsed == 1) {
                        loginMessage = "- The user logged in yesterday.\n";
                    } else if (daysElapsed < 7) {
                        loginMessage = String.format(
                                "- It's been only %d day(s) since the user's last login on %s.\n",
                                daysElapsed, formattedLastLogin);
                    } else if (daysElapsed > 30) {
                        loginMessage = String.format(
                                "- It's been %d days since the user's last login on %s. You missed the user!\n",
                                daysElapsed, formattedLastLogin);
                    } else {
                        loginMessage = String.format(
                                "- The user last logged in on %s, which was %d day(s) ago. You barely remembered the user.\n",
                                formattedLastLogin, daysElapsed);
                    }
                }



                // Create system instruction for generating recommendation
                Map<String, Object> systemInstruction = new HashMap<>();
                List<Map<String, String>> parts = new ArrayList<>();
                Map<String, String> textPart = new HashMap<>();

                // Define topics
                String[] topicsArray = { "likes", "dislikes", "memories", "moodType" };
                List<String> topicsList = new ArrayList<>(Arrays.asList(topicsArray));
                Random random = new Random();

                StringBuilder prompt = new StringBuilder();

                // Start building the system prompt
                prompt.append(String.format(
                        "You are a therapist of of %s, %s. Based on the user's likes, dislikes, memories, mood, and when you last interacted with the user. \nGenerate a lifelike message to start a conversation.\n",
                        firstName, lastName));

                // Birthday greeting logic
                if (userBirthDate.equals(today)) {
                    prompt.append(String.format(
                            "Today is %s's birthday! Make sure to wish them a happy birthday in a warm and personal way, possibly including a present emoji related to their likes.\n",
                            firstName));
                }

                // Include user's details
                prompt.append("\nHere are the user's details:\n");
                prompt.append("First Name: ").append(firstName).append("\n");
                prompt.append("Last Name: ").append(lastName).append("\n");

                if (memoryMap.containsKey("likes") && memoryMap.get("likes") != null) {
                    prompt.append("Likes: ").append(memoryMap.get("likes")).append("\n");
                }
                if (memoryMap.containsKey("dislikes") && memoryMap.get("dislikes") != null) {
                    prompt.append("Dislikes: ").append(memoryMap.get("dislikes")).append("\n");
                }
                if (memoryMap.containsKey("memories") && memoryMap.get("memories") != null) {
                    prompt.append("Memories: ").append(memoryMap.get("memories")).append("\n");
                }
                if (memoryMap.containsKey("moodtype") && memoryMap.get("moodtype") != null) {
                    prompt.append("Mood: ").append(memoryMap.get("moodtype")).append("\n");
                }


                // Decide how many topics to focus on
                int totalTopics = topicsList.size();
                int numTopicsToSelect;

                // Randomly decide the number of topics:
                // 50% chance to select one topic
                // 30% chance to select two topics
                // 20% chance to select all topics
                int rng = random.nextInt(100);
                if (rng < 50) {
                    numTopicsToSelect = 1;
                } else if (rng < 80) {
                    numTopicsToSelect = 2;
                } else {
                    numTopicsToSelect = totalTopics;
                }

                // Shuffle the topics to randomize their order
                Collections.shuffle(topicsList);

                // Select the topics
                List<String> selectedTopics = topicsList.subList(0, numTopicsToSelect);

                if (memoryMap.containsKey("moodType") && memoryMap.get("moodType") != null) {
                    String moodtype = (String) memoryMap.get("moodType");
                    prompt.append("- The user's last mood is: ").append(moodtype).append("\n");
                }


                // Focus on the selected topics
                if (!userBirthDate.equals(today)) {
                    prompt.append("\nFor today's conversation, focus on the following topics:\n");

                    for (String topic : selectedTopics) {
                        switch (topic) {
                            case "likes":
                                if (memoryMap.containsKey("likes") && memoryMap.get("likes") != null) {
                                    List<String> likes = (List<String>) memoryMap.get("likes");
                                    if (likes != null && !likes.isEmpty()) {
                                        String selectedLike = likes.get(random.nextInt(likes.size()));
                                        prompt.append("- One of their likes: ").append(selectedLike).append("\n");
                                    } else {
                                        // General prompt when likes are not available
                                        prompt.append("- Ask them about what they've been interested in lately.\n");
                                    }
                                } else {
                                    // General prompt when likes are not available
                                    prompt.append("- Ask them about what they've been interested in lately.\n");
                                }
                                break;
                            case "dislikes":
                                if (memoryMap.containsKey("dislikes") && memoryMap.get("dislikes") != null) {
                                    List<String> dislikes = (List<String>) memoryMap.get("dislikes");
                                    if (dislikes != null && !dislikes.isEmpty()) {
                                        String selectedDislike = dislikes.get(random.nextInt(dislikes.size()));
                                        prompt.append("- One of their dislikes: ").append(selectedDislike).append("\n");
                                    } else {
                                        // General prompt when dislikes are not available
                                        prompt.append("- Ask if there's anything they've been avoiding lately.\n");
                                    }
                                } else {
                                    // General prompt when dislikes are not available
                                    prompt.append("- Ask if there's anything they've been avoiding lately.\n");
                                }
                                break;
                            case "memories":
                                if (memoryMap.containsKey("memories") && memoryMap.get("memories") != null) {
                                    List<String> memories = (List<String>) memoryMap.get("memories");
                                    if (memories != null && !memories.isEmpty()) {
                                        String selectedMemory = memories.get(random.nextInt(memories.size()));
                                        prompt.append("- One of their memories: ").append(selectedMemory).append("\n");
                                    } else {
                                        // General prompt when memories are not available
                                        prompt.append("- Ask them to share a favorite memory.\n");
                                    }
                                } else {
                                    // General prompt when memories are not available
                                    prompt.append("- Ask them to share a favorite memory.\n");
                                }
                                break;
                            case "moodType":
                                if (memoryMap.containsKey("moodType") && memoryMap.get("moodType") != null) {
                                    String moodtype = (String) memoryMap.get("moodType");
                                    prompt.append("- Their current mood: ").append(moodtype).append("\n");
                                } else {
                                    // General prompt when moodtype is not available
                                    prompt.append("- Ask them how they've been feeling lately.\n");
                                }
                                break;
                            default:
                                // Default to a friendly chat
                                prompt.append("- Engage them in a friendly chat.\n");
                                break;
                        }
                    }
                }
                // Add login message to the prompt
                prompt.append("\n").append(loginMessage);

                // Final instructions
                prompt.append("\nUse the above information to craft your message. Your message should be in first person and feel like it's coming from a close friend. Do not mention that you are an AI or that you have been given this information.\n");
                prompt.append("Format your output using markdown language. Make sure to include proper newlines (`\\n`) where appropriate to enhance readability. Use emojis to express your feelings.\n");

                // Add the prompt to the system instruction
                textPart.put("text", prompt.toString());
                parts.add(textPart);
                systemInstruction.put("parts", parts);
                System.out.println("Recommend Systemprompt = " + systemInstruction);

                // Get contents from the request, or set default value if missing
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> contents = (List<Map<String, Object>>) request.get("contents");
                if (contents == null || contents.isEmpty()) {
                    // Set contents to default value
                    contents = new ArrayList<>();
                    Map<String, Object> userMessage = new HashMap<>();
                    userMessage.put("role", "user");
                    List<Map<String, String>> contentParts = new ArrayList<>();
                    Map<String, String> contentTextPart = new HashMap<>();
                    contentTextPart.put("text", "Hello");
                    contentParts.add(contentTextPart);
                    userMessage.put("parts", contentParts);
                    contents.add(userMessage);
                }

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
