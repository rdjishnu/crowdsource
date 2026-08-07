// File: backend/src/main/java/com/nexusgov/service/ResourceAllocationService.java
package com.nexusgov.service;

import com.nexusgov.entity.Issue;
import com.nexusgov.entity.IssueDispatchData;
import com.nexusgov.entity.ResourceEstimate;
import org.springframework.stereotype.Service;

@Service
public class ResourceAllocationService {

    /**
     * Calculates mathematical repair cost (₹), ETA (days), and suggested team size.
     */
    public ResourceEstimate calculateEstimates(Issue issue, IssueDispatchData dispatchData) {
        double baseCost = 4000.0;
        int daysToFix = 3;
        int teamSize = 3;

        if (issue != null && issue.getCategory() != null) {
            String cat = issue.getCategory().toLowerCase();
            if (cat.contains("pothole") || cat.contains("road")) {
                baseCost = 5000.0;
                daysToFix = 3;
                teamSize = 4;
            } else if (cat.contains("light") || cat.contains("electric")) {
                baseCost = 2500.0;
                daysToFix = 1;
                teamSize = 2;
            } else if (cat.contains("water") || cat.contains("sewage") || cat.contains("drain")) {
                baseCost = 15000.0;
                daysToFix = 5;
                teamSize = 5;
            } else if (cat.contains("garbage") || cat.contains("sanitation")) {
                baseCost = 3000.0;
                daysToFix = 2;
                teamSize = 3;
            }
        }

        int severity = (dispatchData != null && dispatchData.getSeverityScore() != null)
                ? dispatchData.getSeverityScore()
                : 50;

        boolean isEmergency = (dispatchData != null && Boolean.TRUE.equals(dispatchData.getIsEmergency()));

        if (severity > 80) {
            baseCost *= 1.5; // Emergency rates surcharge
        }

        if (isEmergency && daysToFix > 1) {
            daysToFix -= 1; // Accelerated emergency dispatch
        }

        if (severity > 70) {
            teamSize = Math.max(teamSize, 4);
        }

        return ResourceEstimate.builder()
                .issue(issue)
                .estimatedCost(baseCost)
                .estimatedDaysToFix(daysToFix)
                .allocatedTeam("Pending Dispatch")
                .suggestedTeamSize(teamSize)
                .build();
    }

    /**
     * AI Microservice Plugin Hook:
     * Predicts material cost using linear regression. Currently returns calculated cost.
     */
    public Double predictMaterialCost(Issue issue) {
        ResourceEstimate estimate = calculateEstimates(issue, null);
        return estimate.getEstimatedCost();
    }
}
