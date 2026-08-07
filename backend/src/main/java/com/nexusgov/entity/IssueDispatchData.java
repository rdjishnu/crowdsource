// File: backend/src/main/java/com/nexusgov/entity/IssueDispatchData.java
package com.nexusgov.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "issue_dispatch_data")
public class IssueDispatchData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id")
    @JsonIgnore
    private Issue issue;

    private String assignedDepartment = "Municipal General";
    private Integer severityScore = 50;
    private Boolean isEmergency = false;
    private Integer supportCount = 1;

    public IssueDispatchData() {}

    public IssueDispatchData(Long id, Issue issue, String assignedDepartment, Integer severityScore, Boolean isEmergency, Integer supportCount) {
        this.id = id;
        this.issue = issue;
        this.assignedDepartment = assignedDepartment != null ? assignedDepartment : "Municipal General";
        this.severityScore = severityScore != null ? severityScore : 50;
        this.isEmergency = isEmergency != null ? isEmergency : false;
        this.supportCount = supportCount != null ? supportCount : 1;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Issue getIssue() { return issue; }
    public void setIssue(Issue issue) { this.issue = issue; }

    public String getAssignedDepartment() { return assignedDepartment; }
    public void setAssignedDepartment(String assignedDepartment) { this.assignedDepartment = assignedDepartment; }

    public Integer getSeverityScore() { return severityScore; }
    public void setSeverityScore(Integer severityScore) { this.severityScore = severityScore; }

    public Boolean getIsEmergency() { return isEmergency; }
    public void setIsEmergency(Boolean emergency) { isEmergency = emergency; }

    public Integer getSupportCount() { return supportCount; }
    public void setSupportCount(Integer supportCount) { this.supportCount = supportCount; }

    public static IssueDispatchDataBuilder builder() {
        return new IssueDispatchDataBuilder();
    }

    public static class IssueDispatchDataBuilder {
        private Long id;
        private Issue issue;
        private String assignedDepartment = "Municipal General";
        private Integer severityScore = 50;
        private Boolean isEmergency = false;
        private Integer supportCount = 1;

        IssueDispatchDataBuilder() {}

        public IssueDispatchDataBuilder id(Long id) { this.id = id; return this; }
        public IssueDispatchDataBuilder issue(Issue issue) { this.issue = issue; return this; }
        public IssueDispatchDataBuilder assignedDepartment(String assignedDepartment) { this.assignedDepartment = assignedDepartment; return this; }
        public IssueDispatchDataBuilder severityScore(Integer severityScore) { this.severityScore = severityScore; return this; }
        public IssueDispatchDataBuilder isEmergency(Boolean isEmergency) { this.isEmergency = isEmergency; return this; }
        public IssueDispatchDataBuilder supportCount(Integer supportCount) { this.supportCount = supportCount; return this; }

        public IssueDispatchData build() {
            return new IssueDispatchData(id, issue, assignedDepartment, severityScore, isEmergency, supportCount);
        }
    }
}
