package com.SerenityBuilders.SerenityAI.Controller;

import com.SerenityBuilders.SerenityAI.Entity.PrivacySettingsEntity;
import com.SerenityBuilders.SerenityAI.Service.PrivacySettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.NameNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/privacySettings")
@CrossOrigin(origins = "http://localhost:5173")
public class PrivacySettingsController {

    @Autowired
    private PrivacySettingsService privacySettingsService;

    @PostMapping("/post")
    public ResponseEntity<PrivacySettingsEntity> postPrivacySettings(@RequestBody PrivacySettingsEntity privacySettings) {
        PrivacySettingsEntity savedSettings = privacySettingsService.savePrivacySettings(privacySettings);
        return new ResponseEntity<>(savedSettings, HttpStatus.CREATED);
    }

    @GetMapping("/get")
    public ResponseEntity<List<PrivacySettingsEntity>> getAllPrivacySettings() {
        List<PrivacySettingsEntity> privacySettings = privacySettingsService.getAllPrivacySettings();
        return new ResponseEntity<>(privacySettings, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<PrivacySettingsEntity> getPrivacySettingsById(@PathVariable int id) throws NameNotFoundException {
        PrivacySettingsEntity privacySettings = privacySettingsService.getPrivacySettingsById(id);
        return new ResponseEntity<>(privacySettings, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePrivacySettings(@PathVariable int id) {
        String responseMessage = privacySettingsService.deletePrivacySettings(id);
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }
}