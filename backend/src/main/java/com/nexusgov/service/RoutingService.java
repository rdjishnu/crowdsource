// File: backend/src/main/java/com/nexusgov/service/RoutingService.java
package com.nexusgov.service;

import com.nexusgov.entity.Issue;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {

    /**
     * Determines municipal department based on issue category.
     */
    public String determineDepartment(String category) {
        if (category == null) return "Municipal General";
        String cat = category.toLowerCase().trim();

        if (cat.contains("pothole") || cat.contains("road") || cat.contains("bridge")) {
            return "Public Works";
        } else if (cat.contains("garbage") || cat.contains("sanitation") || cat.contains("waste")) {
            return "Sanitation";
        } else if (cat.contains("water") || cat.contains("sewage") || cat.contains("drain")) {
            return "Water & Sanitation";
        } else if (cat.contains("light") || cat.contains("street") || cat.contains("electric") || cat.contains("power")) {
            return "Electrical";
        }
        return "Municipal General";
    }

    /**
     * AI Microservice Plugin Hook:
     * Predicts department using NLP classification. Currently returns rule-based result.
     */
    public String predictDepartment(Issue issue) {
        if (issue == null) return "Municipal General";
        return determineDepartment(issue.getCategory());
    }
}
