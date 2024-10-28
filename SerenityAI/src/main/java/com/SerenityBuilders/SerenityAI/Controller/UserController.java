package com.SerenityBuilders.SerenityAI.controller;

import com.SerenityBuilders.SerenityAI.entity.UserEntity;
import com.SerenityBuilders.SerenityAI.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.naming.NameNotFoundException;
import java.util.List;

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

 /*   @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserEntity(
        ));
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute("user") UserEntity user) {
        userService.registerUser(user);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }*/
}
