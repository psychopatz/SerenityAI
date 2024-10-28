package com.SerenityBuilders.SerenityAI.Service;


import com.SerenityBuilders.SerenityAI.Entity.UserEntity;
import com.SerenityBuilders.SerenityAI.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; // Autowire the correct repository


  /*  @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder; // Use PasswordEncoder here*/


    /* @Autowired
     public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
         this.passwordEncoder = passwordEncoder;
     }*/
    // Create a new user
    public UserEntity postUser(UserEntity user) {
        return userRepository.save(user); // Save the user entity
    }

    // Get all users
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll(); // Fetch all user records
    }

    // Update user details by ID
    public UserEntity updatedUser(int id, UserEntity newUserDetails) throws NameNotFoundException {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NameNotFoundException("User " + id + " not found"));

        // Update user details
        user.setName(newUserDetails.getName());
        user.setEmail(newUserDetails.getEmail());
        //   user.setPassword(passwordEncoder.encode(newUserDetails.getPassword())); // Ensure password is encoded
        user.setDateOfBirth(newUserDetails.getDateOfBirth());
        user.setGender(newUserDetails.getGender());
        user.setSignUpDate(newUserDetails.getSignUpDate());
        user.setLastLogin(newUserDetails.getLastLogin());
        user.setLocation(newUserDetails.getLocation());

        return userRepository.save(user); // Save updated user
    }

    // Delete user by ID
    public String deleteUser(int id) {
        if (userRepository.existsById(id)) { // Check if user exists by ID
            userRepository.deleteById(id); // Delete the user
            return "User record has been successfully deleted";
        } else {
            return "User with ID " + id + " not found"; // Return a message indicating not found
        }
    }

  /*  public void registerUser(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode the password
        userRepository.save(user);
    }

    public UserEntity findByUsername(String name) {
        return userRepository.findByUsername(name).orElse(null); // Return user or null
    }*/
}
