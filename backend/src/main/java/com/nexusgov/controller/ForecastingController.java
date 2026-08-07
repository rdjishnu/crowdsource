// File: backend/src/main/java/com/nexusgov/controller/ForecastingController.java
package com.nexusgov.controller;

import com.nexusgov.entity.Issue;
import com.nexusgov.repository.IssueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/forecasting")
public class ForecastingController {

    private final IssueRepository issueRepository;

    public ForecastingController(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    /**
     * GET /api/forecasting/seasonal-trends
     * Returns category issue distribution and seasonal forecasting metrics for budget planning.
     */
    @GetMapping("/seasonal-trends")
    public ResponseEntity<?> getSeasonalTrends() {
        List<Issue> issues = issueRepository.findAllByOrderByCreatedAtDesc();

        Map<String, Integer> categoryCounts = new HashMap<>();
        categoryCounts.put("Water & Sewage", 0);
        categoryCounts.put("Potholes & Roads", 0);
        categoryCounts.put("Sanitation", 0);
        categoryCounts.put("Electrical", 0);

        for (Issue issue : issues) {
            String cat = issue.getCategory() != null ? issue.getCategory().toLowerCase() : "";
            if (cat.contains("water") || cat.contains("sewage")) {
                categoryCounts.put("Water & Sewage", categoryCounts.get("Water & Sewage") + 1);
            } else if (cat.contains("pothole") || cat.contains("road")) {
                categoryCounts.put("Potholes & Roads", categoryCounts.get("Potholes & Roads") + 1);
            } else if (cat.contains("garbage") || cat.contains("sanitation")) {
                categoryCounts.put("Sanitation", categoryCounts.get("Sanitation") + 1);
            } else if (cat.contains("light") || cat.contains("electric")) {
                categoryCounts.put("Electrical", categoryCounts.get("Electrical") + 1);
            }
        }

        // Seasonal Monsoon Projections (July - Sept Spike Forecasts)
        List<Map<String, Object>> monthlyForecasts = new ArrayList<>();

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul (Monsoon Spike)", "Aug (Monsoon Spike)", "Sep", "Oct", "Nov", "Dec"};
        int[] waterMultipliers = {12, 14, 18, 22, 35, 65, 120, 145, 95, 40, 25, 15};
        int[] potholeMultipliers = {20, 18, 22, 25, 30, 50, 110, 130, 105, 60, 35, 22};

        for (int i = 0; i < months.length; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", months[i]);
            item.put("waterLeaks", waterMultipliers[i] + (categoryCounts.get("Water & Sewage") * 2));
            item.put("potholes", potholeMultipliers[i] + (categoryCounts.get("Potholes & Roads") * 2));
            monthlyForecasts.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRecordedIssues", issues.size());
        result.put("categoryBreakdown", categoryCounts);
        result.put("monthlyForecasts", monthlyForecasts);
        result.put("seasonalWarning", "⚠️ Monsoon Infrastructure Alert: Water Leakage & Pothole stress expected to spike 300% in July-August.");

        return ResponseEntity.ok(result);
    }
}
