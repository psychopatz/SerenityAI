package com.SerenityBuilders.SerenityAI.Controller;

import com.SerenityBuilders.SerenityAI.Entity.Photo;
import com.SerenityBuilders.SerenityAI.Repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class PhotoUploadController {

    // Maximum file size: 5MB
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Allowed image MIME types
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            MediaType.IMAGE_JPEG_VALUE,
            MediaType.IMAGE_PNG_VALUE,
            MediaType.IMAGE_GIF_VALUE
    );

    @Autowired
    private PhotoRepository photoRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file size
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                        .body("File size exceeds maximum limit of 5MB");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
                return ResponseEntity.badRequest().body("Invalid file type. Only JPEG, PNG, and GIF are allowed");
            }

            Photo photo = new Photo();
            photo.setData(file.getBytes());
            photo.setOriginalFileName(file.getOriginalFilename());
            photo.setContentType(contentType);
            photo.setUploadTimestamp(LocalDateTime.now());

            Photo savedPhoto = photoRepository.save(photo);
            return ResponseEntity.status(HttpStatus.OK).body(savedPhoto.getId());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }

    @GetMapping("/photo/{id}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable Long id) {
        return photoRepository.findById(id)
                .map(photo -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(photo.getContentType()))
                        .body(photo.getData()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping("/photo/{id}/metadata")
    public ResponseEntity<?> getPhotoMetadata(@PathVariable Long id) {
        Optional<Map<String, Object>> metadataOptional = photoRepository.findById(id)
                .map(photo -> {
                    Map<String, Object> metadata = new HashMap<>();
                    metadata.put("id", photo.getId());
                    metadata.put("originalFileName", photo.getOriginalFileName());
                    metadata.put("contentType", photo.getContentType());
                    metadata.put("uploadTimestamp", photo.getUploadTimestamp());
                    metadata.put("fileSize", photo.getData().length); // Size in bytes
                    return metadata;
                });

        if (metadataOptional.isPresent()) {
            return ResponseEntity.ok(metadataOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Photo not found");
        }
    }



    @GetMapping("/photos/metadata")
    public ResponseEntity<List<Map<String, Object>>> getAllPhotoMetadata() {
        List<Map<String, Object>> metadataList = photoRepository.findAll().stream()
                .map((Photo photo) -> {
                    Map<String, Object> metadata = new HashMap<>();
                    metadata.put("id", photo.getId());
                    metadata.put("originalFileName", photo.getOriginalFileName());
                    metadata.put("contentType", photo.getContentType());
                    metadata.put("uploadTimestamp", photo.getUploadTimestamp());
                    metadata.put("fileSize", photo.getData().length); // Size in bytes
                    return metadata;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(metadataList);
    }

    @DeleteMapping("/photo/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable Long id) {
        Optional<Photo> photoOptional = photoRepository.findById(id);
        if (photoOptional.isPresent()) {
            photoRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("Photo deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Photo not found");
        }
    }

}