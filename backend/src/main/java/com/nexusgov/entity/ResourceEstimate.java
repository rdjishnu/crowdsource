// File: backend/src/main/java/com/nexusgov/entity/ResourceEstimate.java
package com.nexusgov.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "resource_estimates")
public class ResourceEstimate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id")
    @JsonIgnore
    private Issue issue;

    private Double estimatedCost = 5000.0;
    private Integer estimatedDaysToFix = 3;
    private String allocatedTeam = "Pending Dispatch";
    private Integer suggestedTeamSize = 3;

    public ResourceEstimate() {}

    public ResourceEstimate(Long id, Issue issue, Double estimatedCost, Integer estimatedDaysToFix, String allocatedTeam, Integer suggestedTeamSize) {
        this.id = id;
        this.issue = issue;
        this.estimatedCost = estimatedCost != null ? estimatedCost : 5000.0;
        this.estimatedDaysToFix = estimatedDaysToFix != null ? estimatedDaysToFix : 3;
        this.allocatedTeam = allocatedTeam != null ? allocatedTeam : "Pending Dispatch";
        this.suggestedTeamSize = suggestedTeamSize != null ? suggestedTeamSize : 3;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Issue getIssue() { return issue; }
    public void setIssue(Issue issue) { this.issue = issue; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public Integer getEstimatedDaysToFix() { return estimatedDaysToFix; }
    public void setEstimatedDaysToFix(Integer estimatedDaysToFix) { this.estimatedDaysToFix = estimatedDaysToFix; }

    public String getAllocatedTeam() { return allocatedTeam; }
    public void setAllocatedTeam(String allocatedTeam) { this.allocatedTeam = allocatedTeam; }

    public Integer getSuggestedTeamSize() { return suggestedTeamSize; }
    public void setSuggestedTeamSize(Integer suggestedTeamSize) { this.suggestedTeamSize = suggestedTeamSize; }

    public static ResourceEstimateBuilder builder() {
        return new ResourceEstimateBuilder();
    }

    public static class ResourceEstimateBuilder {
        private Long id;
        private Issue issue;
        private Double estimatedCost = 5000.0;
        private Integer estimatedDaysToFix = 3;
        private String allocatedTeam = "Pending Dispatch";
        private Integer suggestedTeamSize = 3;

        ResourceEstimateBuilder() {}

        public ResourceEstimateBuilder id(Long id) { this.id = id; return this; }
        public ResourceEstimateBuilder issue(Issue issue) { this.issue = issue; return this; }
        public ResourceEstimateBuilder estimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; return this; }
        public ResourceEstimateBuilder estimatedDaysToFix(Integer estimatedDaysToFix) { this.estimatedDaysToFix = estimatedDaysToFix; return this; }
        public ResourceEstimateBuilder allocatedTeam(String allocatedTeam) { this.allocatedTeam = allocatedTeam; return this; }
        public ResourceEstimateBuilder suggestedTeamSize(Integer suggestedTeamSize) { this.suggestedTeamSize = suggestedTeamSize; return this; }

        public ResourceEstimate build() {
            return new ResourceEstimate(id, issue, estimatedCost, estimatedDaysToFix, allocatedTeam, suggestedTeamSize);
        }
    }
}
