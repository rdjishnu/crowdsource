// File: backend/src/main/java/com/nexusgov/entity/Issue.java
package com.nexusgov.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String citizenEmail;
    private String citizenName;
    private String category;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String address;

    private String photoPath;
    private Double latitude;
    private Double longitude;
    private String status; // 'Reported', 'In Progress', 'Resolved', 'Rejected'
    private LocalDateTime createdAt;
    private Integer severityScore = 50;

    @OneToOne(mappedBy = "issue", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private IssueMetadata metadata;

    @OneToOne(mappedBy = "issue", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private IssueDispatchData dispatchData;

    @OneToOne(mappedBy = "issue", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ResourceEstimate resourceEstimate;

    @OneToOne(mappedBy = "issue", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private OfflineSyncData offlineSyncData;

    private Integer citizenTrustScore = 100;

    public Issue() {}

    public Issue(Long id, String citizenEmail, String citizenName, String category, String description, String address, String photoPath, Double latitude, Double longitude, String status, LocalDateTime createdAt, Integer severityScore, IssueMetadata metadata, IssueDispatchData dispatchData, ResourceEstimate resourceEstimate, OfflineSyncData offlineSyncData, Integer citizenTrustScore) {
        this.id = id;
        this.citizenEmail = citizenEmail;
        this.citizenName = citizenName;
        this.category = category;
        this.description = description;
        this.address = (address != null && !address.isEmpty()) ? address : "Location Address Pending GPS Geocode";
        this.photoPath = photoPath;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.createdAt = createdAt;
        this.severityScore = (severityScore != null) ? severityScore : 50;
        this.metadata = metadata;
        this.dispatchData = dispatchData;
        this.resourceEstimate = resourceEstimate;
        this.offlineSyncData = offlineSyncData;
        this.citizenTrustScore = (citizenTrustScore != null) ? citizenTrustScore : 100;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCitizenEmail() { return citizenEmail; }
    public void setCitizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getSeverityScore() { return severityScore; }
    public void setSeverityScore(Integer severityScore) { this.severityScore = severityScore; }

    public IssueMetadata getMetadata() { return metadata; }
    public void setMetadata(IssueMetadata metadata) {
        this.metadata = metadata;
        if (metadata != null) {
            metadata.setIssue(this);
        }
    }

    public IssueDispatchData getDispatchData() { return dispatchData; }
    public void setDispatchData(IssueDispatchData dispatchData) {
        this.dispatchData = dispatchData;
        if (dispatchData != null) {
            dispatchData.setIssue(this);
        }
    }

    public ResourceEstimate getResourceEstimate() { return resourceEstimate; }
    public void setResourceEstimate(ResourceEstimate resourceEstimate) {
        this.resourceEstimate = resourceEstimate;
        if (resourceEstimate != null) {
            resourceEstimate.setIssue(this);
        }
    }

    public OfflineSyncData getOfflineSyncData() { return offlineSyncData; }
    public void setOfflineSyncData(OfflineSyncData offlineSyncData) {
        this.offlineSyncData = offlineSyncData;
        if (offlineSyncData != null) {
            offlineSyncData.setIssue(this);
        }
    }

    public Integer getCitizenTrustScore() { return citizenTrustScore; }
    public void setCitizenTrustScore(Integer citizenTrustScore) { this.citizenTrustScore = citizenTrustScore; }

    public static IssueBuilder builder() {
        return new IssueBuilder();
    }

    public static class IssueBuilder {
        private Long id;
        private String citizenEmail;
        private String citizenName;
        private String category;
        private String description;
        private String address;
        private String photoPath;
        private Double latitude;
        private Double longitude;
        private String status;
        private LocalDateTime createdAt;
        private Integer severityScore = 50;
        private IssueMetadata metadata;
        private IssueDispatchData dispatchData;
        private ResourceEstimate resourceEstimate;
        private OfflineSyncData offlineSyncData;
        private Integer citizenTrustScore = 100;

        IssueBuilder() {}

        public IssueBuilder id(Long id) { this.id = id; return this; }
        public IssueBuilder citizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; return this; }
        public IssueBuilder citizenName(String citizenName) { this.citizenName = citizenName; return this; }
        public IssueBuilder category(String category) { this.category = category; return this; }
        public IssueBuilder description(String description) { this.description = description; return this; }
        public IssueBuilder address(String address) { this.address = address; return this; }
        public IssueBuilder photoPath(String photoPath) { this.photoPath = photoPath; return this; }
        public IssueBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public IssueBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public IssueBuilder status(String status) { this.status = status; return this; }
        public IssueBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public IssueBuilder severityScore(Integer severityScore) { this.severityScore = severityScore; return this; }
        public IssueBuilder metadata(IssueMetadata metadata) { this.metadata = metadata; return this; }
        public IssueBuilder dispatchData(IssueDispatchData dispatchData) { this.dispatchData = dispatchData; return this; }
        public IssueBuilder resourceEstimate(ResourceEstimate resourceEstimate) { this.resourceEstimate = resourceEstimate; return this; }
        public IssueBuilder offlineSyncData(OfflineSyncData offlineSyncData) { this.offlineSyncData = offlineSyncData; return this; }
        public IssueBuilder citizenTrustScore(Integer citizenTrustScore) { this.citizenTrustScore = citizenTrustScore; return this; }

        public Issue build() {
            Issue issue = new Issue(id, citizenEmail, citizenName, category, description, address, photoPath, latitude, longitude, status, createdAt, severityScore, metadata, dispatchData, resourceEstimate, offlineSyncData, citizenTrustScore);
            if (metadata != null) {
                metadata.setIssue(issue);
            }
            if (dispatchData != null) {
                dispatchData.setIssue(issue);
            }
            if (resourceEstimate != null) {
                resourceEstimate.setIssue(issue);
            }
            if (offlineSyncData != null) {
                offlineSyncData.setIssue(issue);
            }
            return issue;
        }
    }
}
