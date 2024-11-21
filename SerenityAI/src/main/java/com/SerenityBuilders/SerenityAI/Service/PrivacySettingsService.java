package com.SerenityBuilders.SerenityAI.Service;

import com.SerenityBuilders.SerenityAI.Entity.PrivacySettingsEntity;
import com.SerenityBuilders.SerenityAI.Repository.PrivacySettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;

@Service
public class PrivacySettingsService {

    @Autowired
    private PrivacySettingsRepository privacySettingsRepository;

    public PrivacySettingsEntity savePrivacySettings(PrivacySettingsEntity privacySettings) {
        return privacySettingsRepository.save(privacySettings);
    }

    public List<PrivacySettingsEntity> getAllPrivacySettings() {
        return privacySettingsRepository.findAll();
    }

    public PrivacySettingsEntity getPrivacySettingsById(int id) throws NameNotFoundException {
        return privacySettingsRepository.findById(id)
                .orElseThrow(() -> new NameNotFoundException("Privacy settings with ID " + id + " not found"));
    }

    public String deletePrivacySettings(int id) {
        if (privacySettingsRepository.existsById(id)) {
            privacySettingsRepository.deleteById(id);
            return "Privacy settings record has been successfully deleted";
        } else {
            return "Privacy settings with ID " + id + " not found";
        }
    }
}
