// File: backend/src/main/java/com/nexusgov/service/SeverityScoringService.java
package com.nexusgov.service;

import com.nexusgov.entity.Issue;
import org.springframework.stereotype.Service;

@Service
public class SeverityScoringService {

    /**
     * Calculates mathematical severity score (0-100 scale).
     * Score > 85 flags issue as Emergency.
     */
    public int calculateSeverity(Issue issue, int reporterTrustScore, int supportCount) {
        int baseScore = 35;
        if (issue != null && issue.getCategory() != null) {
            String cat = issue.getCategory().toLowerCase();
            if (cat.contains("sewage") || cat.contains("water")) {
                baseScore = 70;
            } else if (cat.contains("pothole") || cat.contains("road")) {
                baseScore = 50;
            } else if (cat.contains("garbage") || cat.contains("sanitation")) {
                baseScore = 35;
            } else if (cat.contains("light") || cat.contains("electric")) {
                baseScore = 25;
            }
        }

        int bonusFromUpvotes = Math.min(supportCount * 5, 25);
        int trustBonus = (reporterTrustScore > 120) ? 10 : 0;

        int finalScore = baseScore + bonusFromUpvotes + trustBonus;
        if (finalScore > 100) finalScore = 100;
        if (finalScore < 10) finalScore = 10;

        return finalScore;
    }

    /**
     * Checks if score exceeds emergency threshold (> 85).
     */
    public boolean isEmergency(int severityScore) {
        return severityScore > 85;
    }
}
