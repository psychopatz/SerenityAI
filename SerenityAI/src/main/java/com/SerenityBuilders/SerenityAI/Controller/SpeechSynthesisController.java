package com.SerenityBuilders.SerenityAI.Controller;

import com.SerenityBuilders.SerenityAI.util.SpeechSynthesisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/speech")
@CrossOrigin(origins = "http://localhost:5173")
public class SpeechSynthesisController {

    @Autowired
    private SpeechSynthesisUtil speechSynthesisUtil;

    @PostMapping
    public ResponseEntity<String> transcribeSpeech(@RequestParam("audioFile") MultipartFile audioFile) {
        try {
            // Convert MultipartFile to File
            File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + audioFile.getOriginalFilename());
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(audioFile.getBytes());
            fos.close();

            // Use the utility to transcribe the audio
            String transcription = speechSynthesisUtil.transcribeAudio(convFile);

            // Delete the temporary file
            convFile.delete();

            // Return JSON response with transcription
            return ResponseEntity.ok().body("{\"text\": \"" + transcription + "\"}");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Failed to process audio file\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Failed to transcribe audio\"}");
        }
    }
}
