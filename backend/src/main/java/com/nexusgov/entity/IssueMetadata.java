// File: backend/src/main/java/com/nexusgov/entity/IssueMetadata.java
package com.nexusgov.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "issue_metadata")
public class IssueMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id")
    @JsonIgnore
    private Issue issue;

    private String fileHash;
    private Boolean isDuplicate = false;
    private Boolean isGpsSpoofed = false;
    private Integer authenticityScore = 100;
    private String statusFlag = "VERIFIED";

    public IssueMetadata() {}

    public IssueMetadata(Long id, Issue issue, String fileHash, Boolean isDuplicate, Boolean isGpsSpoofed, Integer authenticityScore, String statusFlag) {
        this.id = id;
        this.issue = issue;
        this.fileHash = fileHash;
        this.isDuplicate = isDuplicate != null ? isDuplicate : false;
        this.isGpsSpoofed = isGpsSpoofed != null ? isGpsSpoofed : false;
        this.authenticityScore = authenticityScore != null ? authenticityScore : 100;
        this.statusFlag = statusFlag != null ? statusFlag : "VERIFIED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Issue getIssue() { return issue; }
    public void setIssue(Issue issue) { this.issue = issue; }

    public String getFileHash() { return fileHash; }
    public void setFileHash(String fileHash) { this.fileHash = fileHash; }

    public Boolean getIsDuplicate() { return isDuplicate; }
    public void setIsDuplicate(Boolean duplicate) { isDuplicate = duplicate; }

    public Boolean getIsGpsSpoofed() { return isGpsSpoofed; }
    public void setIsGpsSpoofed(Boolean gpsSpoofed) { isGpsSpoofed = gpsSpoofed; }

    public Integer getAuthenticityScore() { return authenticityScore; }
    public void setAuthenticityScore(Integer authenticityScore) { this.authenticityScore = authenticityScore; }

    public String getStatusFlag() { return statusFlag; }
    public void setStatusFlag(String statusFlag) { this.statusFlag = statusFlag; }

    public static IssueMetadataBuilder builder() {
        return new IssueMetadataBuilder();
    }

    public static class IssueMetadataBuilder {
        private Long id;
        private Issue issue;
        private String fileHash;
        private Boolean isDuplicate = false;
        private Boolean isGpsSpoofed = false;
        private Integer authenticityScore = 100;
        private String statusFlag = "VERIFIED";

        IssueMetadataBuilder() {}

        public IssueMetadataBuilder id(Long id) { this.id = id; return this; }
        public IssueMetadataBuilder issue(Issue issue) { this.issue = issue; return this; }
        public IssueMetadataBuilder fileHash(String fileHash) { this.fileHash = fileHash; return this; }
        public IssueMetadataBuilder isDuplicate(Boolean isDuplicate) { this.isDuplicate = isDuplicate; return this; }
        public IssueMetadataBuilder isGpsSpoofed(Boolean isGpsSpoofed) { this.isGpsSpoofed = isGpsSpoofed; return this; }
        public IssueMetadataBuilder authenticityScore(Integer authenticityScore) { this.authenticityScore = authenticityScore; return this; }
        public IssueMetadataBuilder statusFlag(String statusFlag) { this.statusFlag = statusFlag; return this; }

        public IssueMetadata build() {
            return new IssueMetadata(id, issue, fileHash, isDuplicate, isGpsSpoofed, authenticityScore, statusFlag);
        }
    }
}
