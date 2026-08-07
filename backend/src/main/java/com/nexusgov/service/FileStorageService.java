// File: backend/src/main/java/com/nexusgov/service/FileStorageService.java
package com.nexusgov.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path storageLocation;

    public FileStorageService() {
        this.storageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create directory for uploaded files.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            fileExtension = ".jpg";
        }

        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        try {
            Path targetLocation = this.storageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return uniqueFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + uniqueFilename + ". Please try again!", ex);
        }
    }
}
