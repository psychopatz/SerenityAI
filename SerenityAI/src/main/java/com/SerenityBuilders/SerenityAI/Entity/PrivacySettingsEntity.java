package com.SerenityBuilders.SerenityAI.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PrivacySettings")
public class PrivacySettingsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "privacy_id")
    private int privacyId;

    @Column(name = "data_sharing_consent")
    private Boolean dataSharingConsent;

    @Column(name = "email_notification_consent")
    private Boolean emailNotificationConsent;

    @Column(name = "profile_visibility")
    private Boolean profileVisibility;

    public PrivacySettingsEntity() {}

    public PrivacySettingsEntity(Boolean dataSharingConsent, Boolean emailNotificationConsent, Boolean profileVisibility) {
        this.dataSharingConsent = dataSharingConsent;
        this.emailNotificationConsent = emailNotificationConsent;
        this.profileVisibility = profileVisibility;
    }

    public int getPrivacyId() {
        return privacyId;
    }

    public void setPrivacyId(int privacyId) {
        this.privacyId = privacyId;
    }

    public Boolean getDataSharingConsent() {
        return dataSharingConsent;
    }

    public void setDataSharingConsent(Boolean dataSharingConsent) {
        this.dataSharingConsent = dataSharingConsent;
    }

    public Boolean getEmailNotificationConsent() {
        return emailNotificationConsent;
    }

    public void setEmailNotificationConsent(Boolean emailNotificationConsent) {
        this.emailNotificationConsent = emailNotificationConsent;
    }

    public Boolean getProfileVisibility() {
        return profileVisibility;
    }

    public void setProfileVisibility(Boolean profileVisibility) {
        this.profileVisibility = profileVisibility;
    }
}
