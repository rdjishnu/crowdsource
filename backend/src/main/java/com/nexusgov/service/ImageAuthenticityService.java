// File: backend/src/main/java/com/nexusgov/service/ImageAuthenticityService.java
package com.nexusgov.service;

import com.nexusgov.repository.IssueMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;

@Service
public class ImageAuthenticityService {

    private final IssueMetadataRepository issueMetadataRepository;

    public ImageAuthenticityService(IssueMetadataRepository issueMetadataRepository) {
        this.issueMetadataRepository = issueMetadataRepository;
    }

    /**
     * Calculates SHA-256 hash of a file for image duplicate detection.
     */
    public String calculateFileHash(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = file.getBytes();
            byte[] hash = digest.digest(bytes);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Checks if the exact file hash has been uploaded previously.
     */
    public boolean isDuplicateImage(String fileHash) {
        if (fileHash == null || fileHash.isEmpty()) {
            return false;
        }
        return issueMetadataRepository.existsByFileHash(fileHash);
    }

    /**
     * AI Microservice Plugin Hook:
     * Currently returns true (valid). Interface ready for future Python AI microservice integration.
     */
    public boolean detectManipulation(MultipartFile file) {
        // AI model hook (e.g. Forgery / Error Level Analysis detection)
        return true;
    }
}
