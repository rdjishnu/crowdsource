// File: backend/src/main/java/com/nexusgov/entity/OfflineSyncData.java
package com.nexusgov.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "offline_sync_data")
public class OfflineSyncData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id")
    @JsonIgnore
    private Issue issue;

    private Boolean isOfflineSynced = false;
    private LocalDateTime originalCaptureTime;

    public OfflineSyncData() {}

    public OfflineSyncData(Long id, Issue issue, Boolean isOfflineSynced, LocalDateTime originalCaptureTime) {
        this.id = id;
        this.issue = issue;
        this.isOfflineSynced = isOfflineSynced != null ? isOfflineSynced : false;
        this.originalCaptureTime = originalCaptureTime != null ? originalCaptureTime : LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Issue getIssue() { return issue; }
    public void setIssue(Issue issue) { this.issue = issue; }

    public Boolean getIsOfflineSynced() { return isOfflineSynced; }
    public void setIsOfflineSynced(Boolean offlineSynced) { isOfflineSynced = offlineSynced; }

    public LocalDateTime getOriginalCaptureTime() { return originalCaptureTime; }
    public void setOriginalCaptureTime(LocalDateTime originalCaptureTime) { this.originalCaptureTime = originalCaptureTime; }

    public static OfflineSyncDataBuilder builder() {
        return new OfflineSyncDataBuilder();
    }

    public static class OfflineSyncDataBuilder {
        private Long id;
        private Issue issue;
        private Boolean isOfflineSynced = false;
        private LocalDateTime originalCaptureTime;

        OfflineSyncDataBuilder() {}

        public OfflineSyncDataBuilder id(Long id) { this.id = id; return this; }
        public OfflineSyncDataBuilder issue(Issue issue) { this.issue = issue; return this; }
        public OfflineSyncDataBuilder isOfflineSynced(Boolean isOfflineSynced) { this.isOfflineSynced = isOfflineSynced; return this; }
        public OfflineSyncDataBuilder originalCaptureTime(LocalDateTime originalCaptureTime) { this.originalCaptureTime = originalCaptureTime; return this; }

        public OfflineSyncData build() {
            return new OfflineSyncData(id, issue, isOfflineSynced, originalCaptureTime);
        }
    }
}
