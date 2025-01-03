package com.SerenityBuilders.SerenityAI.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "User")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int user_id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "dateOfBirth")
    private String dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "lastLogin")
    private String lastLogin;

    @Column(name = "location")
    private String location;

    @Column(name = "memoryID")
    private int memoryID;

    @Column(name = "privacy_id")
    private int privacy_id;

    @Column(name = "profilephoto_id")
    private int profilephoto_id;

    @Column(name = "previousPhoto")
    private int[] previousPhoto;

    // Constructors
    public UserEntity() {}

    public UserEntity(int user_id, String firstName, String lastName, String email, String password,
                      String dateOfBirth, String gender, String lastLogin, String location, int memoryID, int privacy_id, int profilephoto_id, int[] previousPhoto) {
        this.user_id = user_id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.lastLogin = lastLogin;
        this.location = location;
        this.memoryID = memoryID;
        this.privacy_id = privacy_id;
        this.profilephoto_id = profilephoto_id;
        this.previousPhoto = previousPhoto;
    }

    // Getters and Setters
    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(String lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setMemoryID(int memoryID){this.memoryID = memoryID;}

    public int getMemoryID(){return memoryID;}

    public void setPrivacy_id(int privacyId){this.privacy_id = privacyId;}

    public int getPrivacy_id(){return privacy_id;}

    public int getProfilephoto_id() {
        return profilephoto_id;
    }

    public void setProfilephoto_id(int profilephoto_id) {
        this.profilephoto_id = profilephoto_id;
    }

    public int[] getPreviousPhoto() {
        return previousPhoto;
    }

    public void setPreviousPhoto(int[] previousPhoto) {
        this.previousPhoto = previousPhoto;
    }
}
