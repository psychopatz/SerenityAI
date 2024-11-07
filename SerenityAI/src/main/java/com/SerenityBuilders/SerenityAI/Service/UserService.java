package com.SerenityBuilders.SerenityAI.Service;


import com.SerenityBuilders.SerenityAI.Entity.UserEntity;
import com.SerenityBuilders.SerenityAI.Repository.UserRepository;
import org.apache.hc.client5.http.auth.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; // Autowire the correct repository


   /* @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder; // Use PasswordEncoder here*/
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


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
        user.setPassword(passwordEncoder.encode(newUserDetails.getPassword())); // Ensure password is encoded
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
    public UserEntity registerUser(UserEntity user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DataIntegrityViolationException("Email already taken");
        }
        if (userRepository.existsByName(user.getName())) {
            throw new DataIntegrityViolationException("Name already taken");
        }
        return userRepository.save(user);
    }

    public UserEntity loginUser(UserEntity user) throws InvalidCredentialsException {
        // Create an instance of BCryptPasswordEncoder

        // Check if user exists in the database
        Optional<UserEntity> foundUser = userRepository.findByEmail(user.getEmail());
        if (foundUser.isEmpty() || !passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password"); // Custom exception
        }
        return foundUser.get(); // Return the authenticated user
    }

    /*

    public UserEntity findByUsername(String name) {
        return userRepository.findByUsername(name).orElse(null); // Return user or null
    }*/
}
