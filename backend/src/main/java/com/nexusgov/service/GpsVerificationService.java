// File: backend/src/main/java/com/nexusgov/service/GpsVerificationService.java
package com.nexusgov.service;

import com.nexusgov.entity.Issue;
import com.nexusgov.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class GpsVerificationService {

    private final IssueRepository issueRepository;

    public GpsVerificationService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    /**
     * Verifies location accuracy and detects GPS spoofing based on speed/distance heuristics.
     * Returns true if GPS is determined to be spoofed (impossible speed > 1000 km/h).
     */
    public boolean verifyLocationAccuracy(String citizenEmail, double newLat, double newLong) {
        if (citizenEmail == null || citizenEmail.isEmpty()) {
            return false;
        }

        Optional<Issue> lastIssueOpt = issueRepository.findFirstByCitizenEmailOrderByCreatedAtDesc(citizenEmail);
        if (lastIssueOpt.isEmpty()) {
            return false; // First issue reported, cannot calculate trajectory
        }

        Issue lastIssue = lastIssueOpt.get();
        if (lastIssue.getLatitude() == null || lastIssue.getLongitude() == null || lastIssue.getCreatedAt() == null) {
            return false;
        }

        double distanceKm = calculateHaversineDistance(
                lastIssue.getLatitude(), lastIssue.getLongitude(),
                newLat, newLong
        );

        long secondsDiff = Duration.between(lastIssue.getCreatedAt(), LocalDateTime.now()).getSeconds();
        if (secondsDiff <= 0) {
            secondsDiff = 1; // Prevent divide-by-zero
        }

        double hoursDiff = secondsDiff / 3600.0;
        double speedKmh = distanceKm / hoursDiff;

        // Speed heuristic check (> 1000 km/h is physically impossible for ground reporting)
        return speedKmh > 1000.0 && distanceKm > 10.0;
    }

    /**
     * Haversine formula to calculate geographical distance between two lat/lng coordinates in km.
     */
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
