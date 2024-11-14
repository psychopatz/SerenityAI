package com.SerenityBuilders.SerenityAI.Controller;

import com.SerenityBuilders.SerenityAI.Entity.UserEntity;
import com.SerenityBuilders.SerenityAI.Service.UserService;
import org.apache.hc.client5.http.auth.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.naming.NameNotFoundException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService; // Autowire the project service

    // Create a new project
    @PostMapping("/post")
    public ResponseEntity<UserEntity> postUser(@RequestBody UserEntity user) {
        UserEntity savedUser = userService.postUser(user); // Use service to save project
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED); // Respond with CREATED status
    }

    // Get all projects
    @GetMapping("/get")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> user = userService.getAllUsers(); // Use service to fetch all projects
        return new ResponseEntity<>(user, HttpStatus.OK); // Respond with OK status and list of projects
    }
 
     // Get user by ID
     @GetMapping("/get/{id}")
     public ResponseEntity<UserEntity> getUserById(@PathVariable int id) {
         UserEntity user = userService.getUserById(id);
         if (user != null) {
             return new ResponseEntity<>(user, HttpStatus.OK);
         } else {
             return new ResponseEntity<>(HttpStatus.NOT_FOUND);
         }
     }

    // Update project by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable int id, @RequestBody UserEntity newUserDetails) throws NameNotFoundException {
        UserEntity updatedUser = userService.updatedUser(id, newUserDetails); // Use service to update project
        return new ResponseEntity<>(updatedUser, HttpStatus.OK); // Respond with OK status and updated project
    }

    // Delete a project by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        String responseMessage = userService.deleteUser(id); // Use service to delete project
        return new ResponseEntity<>(responseMessage, HttpStatus.OK); // Respond with OK status and success message
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserEntity user) {
        try {
            UserEntity registeredUser = userService.registerUser(user);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            String errorMessage = e.getMessage();
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", errorMessage));
        }
    }
/*

    @PostMapping("/register")
    public String registerUser(@ModelAttribute("user") UserEntity user) {
        userService.registerUser(user);
        return "redirect:/login";
    }
*/
@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody UserEntity user) {
    try {
        UserEntity authenticatedUser = userService.loginUser(user);
        return new ResponseEntity<>(authenticatedUser, HttpStatus.OK);
    } catch (InvalidCredentialsException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password")); // Send error message
    }
}
}
