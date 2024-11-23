package com.SerenityBuilders.SerenityAI.Service;

import java.util.List;
import java.util.Optional;

import javax.naming.NameNotFoundException;

import org.apache.hc.client5.http.auth.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.SerenityBuilders.SerenityAI.Entity.UserEntity;
import com.SerenityBuilders.SerenityAI.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Create a new user with encoded password
    public UserEntity postUser(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Get all users
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity updatedUser(int id, UserEntity newUserDetails) throws NameNotFoundException {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NameNotFoundException("User " + id + " not found"));

        // Update user details
        user.setFirstName(newUserDetails.getFirstName());
        user.setLastName(newUserDetails.getLastName());
        user.setEmail(newUserDetails.getEmail());

        if (newUserDetails.getPassword() != null && !newUserDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newUserDetails.getPassword()));
        }

        user.setDateOfBirth(newUserDetails.getDateOfBirth());
        user.setGender(newUserDetails.getGender());
        user.setLastLogin(newUserDetails.getLastLogin());
        user.setLocation(newUserDetails.getLocation());

        // Update memoryID and privacy_id if provided
        // Assuming 0 is not a valid value; adjust as per your business logic
        if (newUserDetails.getMemoryID() != 0) {
            user.setMemoryID(newUserDetails.getMemoryID());
        }

        if (newUserDetails.getPrivacy_id() != 0) {
            user.setPrivacy_id(newUserDetails.getPrivacy_id());
        }

        return userRepository.save(user);
    }


    // Delete user by ID
    public String deleteUser(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return "User record has been successfully deleted";
        } else {
            return "User with ID " + id + " not found";
        }
    }

    public UserEntity getUserById(int id) {
        Optional<UserEntity> user = userRepository.findById(id);
        return user.orElse(null);
    }

    // Register a new user with unique email and encoded password
    public UserEntity registerUser(UserEntity user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DataIntegrityViolationException("Email already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Authenticate user during login
    public UserEntity loginUser(UserEntity user) throws InvalidCredentialsException {
        Optional<UserEntity> foundUser = userRepository.findByEmail(user.getEmail());
        if (foundUser.isEmpty() || !passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        return foundUser.get();
    }
    public UserEntity getUserByEmail(String email) throws NameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NameNotFoundException("User not found"));
    }
    
    public UserEntity updateUserByEmail(String email, UserEntity newUserDetails) throws NameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NameNotFoundException("User not found"));
        
        user.setFirstName(newUserDetails.getFirstName());
        user.setLastName(newUserDetails.getLastName());
        user.setDateOfBirth(newUserDetails.getDateOfBirth());
        user.setGender(newUserDetails.getGender());
        user.setLocation(newUserDetails.getLocation());
        if (newUserDetails.getPassword() != null && !newUserDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newUserDetails.getPassword()));
        }
    
        return userRepository.save(user); // Save the updated user
    }
    
}

