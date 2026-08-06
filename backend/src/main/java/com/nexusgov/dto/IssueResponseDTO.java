package com.nexusgov.dto;

import com.nexusgov.entity.Issue;
import java.time.LocalDateTime;

public class IssueResponseDTO {

    private Long id;
    private String category;
    private String description;
    private String photoPath;
    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime createdAt;

    public IssueResponseDTO() {
    }

    public IssueResponseDTO(Long id, String category, String description, String photoPath, Double latitude, Double longitude, String status, LocalDateTime createdAt) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.photoPath = photoPath;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static IssueResponseDTO fromEntity(Issue issue) {
        if (issue == null) return null;
        return new IssueResponseDTO(
            issue.getId(),
            issue.getCategory(),
            issue.getDescription(),
            issue.getPhotoPath(),
            issue.getLatitude(),
            issue.getLongitude(),
            issue.getStatus(),
            issue.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
