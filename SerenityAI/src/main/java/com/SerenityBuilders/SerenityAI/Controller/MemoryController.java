package com.SerenityBuilders.SerenityAI.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.SerenityBuilders.SerenityAI.Entity.Memory;
import com.SerenityBuilders.SerenityAI.Repository.MemoryRepository;




@RestController
@RequestMapping("/api/memories")
@CrossOrigin(origins = "http://localhost:5173")
public class MemoryController {

    private final MemoryRepository memoryRepository;

    @Autowired
    public MemoryController(MemoryRepository memoryRepository) {
        this.memoryRepository = memoryRepository;
    }

    // Create Memory
    @PostMapping(value = "/post")
    public ResponseEntity<String> createMemory(@RequestBody Memory memory) {
        try {
            memoryRepository.save(memory);
            return ResponseEntity.ok("Memory created successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Get All Memories
    @GetMapping(value = "/get")
    public ResponseEntity<List<Memory>> getAllMemories() {
        try {
            List<Memory> memories = memoryRepository.findAll();
            return ResponseEntity.ok(memories);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get Memory by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<Memory> getMemoryById(@PathVariable int id) {
        try {
            return memoryRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update Memory by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateMemory(@PathVariable int id, @RequestBody Memory updatedMemory) {
        try {
            return memoryRepository.findById(id).map(memory -> {
                memory.setLikes(updatedMemory.getLikes());
                memory.setDislikes(updatedMemory.getDislikes());
                memory.setMemories(updatedMemory.getMemories());
                memory.setMoodType(updatedMemory.getMoodType());
                memoryRepository.save(memory);
                return ResponseEntity.ok("Memory updated successfully.");
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Delete Memory by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMemory(@PathVariable int id) {
        try {
            if (memoryRepository.existsById(id)) {
                memoryRepository.deleteById(id);
                return ResponseEntity.ok("Memory deleted successfully.");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
