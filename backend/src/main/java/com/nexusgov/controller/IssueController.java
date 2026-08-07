// File: backend/src/main/java/com/nexusgov/controller/IssueController.java
package com.nexusgov.controller;

import com.nexusgov.entity.Issue;
import com.nexusgov.entity.IssueDispatchData;
import com.nexusgov.entity.IssueMetadata;
import com.nexusgov.entity.OfflineSyncData;
import com.nexusgov.entity.ResourceEstimate;
import com.nexusgov.entity.User;
import com.nexusgov.repository.IssueRepository;
import com.nexusgov.repository.UserRepository;
import com.nexusgov.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ImageAuthenticityService imageAuthenticityService;
    private final GpsVerificationService gpsVerificationService;
    private final TrustScoreService trustScoreService;
    private final RoutingService routingService;
    private final SeverityScoringService severityScoringService;
    private final ResourceAllocationService resourceAllocationService;

    public IssueController(
            IssueRepository issueRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService,
            ImageAuthenticityService imageAuthenticityService,
            GpsVerificationService gpsVerificationService,
            TrustScoreService trustScoreService,
            RoutingService routingService,
            SeverityScoringService severityScoringService,
            ResourceAllocationService resourceAllocationService
    ) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.imageAuthenticityService = imageAuthenticityService;
        this.gpsVerificationService = gpsVerificationService;
        this.trustScoreService = trustScoreService;
        this.routingService = routingService;
        this.severityScoringService = severityScoringService;
        this.resourceAllocationService = resourceAllocationService;
    }

    @PostMapping
    public ResponseEntity<?> createIssue(
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "severityScore", required = false) Integer severityScoreParam,
            @RequestParam(value = "citizenName", required = false) String citizenName,
            @RequestParam(value = "citizenEmail", required = false) String citizenEmailParam,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "isOfflineSynced", required = false) Boolean isOfflineSynced,
            @RequestParam(value = "originalCaptureTime", required = false) String originalCaptureTimeStr
    ) {
        String citizenEmail = "anonymous@citizen.gov";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            citizenEmail = auth.getName();
        } else if (citizenEmailParam != null && !citizenEmailParam.isEmpty()) {
            citizenEmail = citizenEmailParam;
        }

        String resolvedName = citizenName;
        if (resolvedName == null || resolvedName.isEmpty()) {
            Optional<User> userOpt = userRepository.findByEmail(citizenEmail);
            if (userOpt.isPresent()) {
                resolvedName = userOpt.get().getFullName();
            } else {
                resolvedName = "Verified Citizen";
            }
        }

        int currentTrustScore = trustScoreService.getTrustScore(citizenEmail);
        String filename = fileStorageService.storeFile(photo);

        // Offline Timestamp Sync (Module 9)
        LocalDateTime createdTime = LocalDateTime.now();
        LocalDateTime captureTime = createdTime;
        boolean wasOfflineSynced = Boolean.TRUE.equals(isOfflineSynced);

        if (originalCaptureTimeStr != null && !originalCaptureTimeStr.isEmpty()) {
            try {
                captureTime = LocalDateTime.parse(originalCaptureTimeStr);
                createdTime = captureTime; // Preserve original SLA creation time
                wasOfflineSynced = true;
            } catch (Exception ignored) {}
        }

        // Integrity & Authenticity Analysis (Module 5)
        String fileHash = (photo != null) ? imageAuthenticityService.calculateFileHash(photo) : null;
        boolean isDuplicate = (fileHash != null) && imageAuthenticityService.isDuplicateImage(fileHash);
        boolean isGpsSpoofed = gpsVerificationService.verifyLocationAccuracy(citizenEmail, latitude, longitude);
        boolean isLowTrust = trustScoreService.isLowTrustUser(citizenEmail);

        int authenticityScore = 100;
        String statusFlag = "VERIFIED";

        if (isGpsSpoofed) {
            authenticityScore -= 50;
            statusFlag = "GPS_SPOOFED";
        } else if (isDuplicate) {
            authenticityScore -= 40;
            statusFlag = "DUPLICATE_IMAGE";
        } else if (isLowTrust) {
            authenticityScore -= 30;
            statusFlag = "LOW_TRUST_SPAM";
        }

        // Dispatch & Severity Analysis (Module 6 & 10.2)
        String assignedDepartment = routingService.determineDepartment(category);
        int finalSeverity = (severityScoreParam != null && severityScoreParam > 0)
                ? severityScoreParam
                : severityScoringService.calculateSeverity(null, currentTrustScore, 1);

        boolean isEmergency = severityScoringService.isEmergency(finalSeverity);

        String resolvedAddress = (address != null && !address.trim().isEmpty())
                ? address.trim()
                : String.format("Lat: %.4f, Long: %.4f", latitude, longitude);

        Issue issue = Issue.builder()
                .citizenEmail(citizenEmail)
                .citizenName(resolvedName)
                .category(category)
                .description(description)
                .address(resolvedAddress)
                .photoPath(filename)
                .latitude(latitude)
                .longitude(longitude)
                .status("Reported")
                .createdAt(createdTime)
                .severityScore(finalSeverity)
                .citizenTrustScore(currentTrustScore)
                .build();

        IssueMetadata metadata = IssueMetadata.builder()
                .issue(issue)
                .fileHash(fileHash)
                .isDuplicate(isDuplicate)
                .isGpsSpoofed(isGpsSpoofed)
                .authenticityScore(authenticityScore)
                .statusFlag(statusFlag)
                .build();

        IssueDispatchData dispatchData = IssueDispatchData.builder()
                .issue(issue)
                .assignedDepartment(assignedDepartment)
                .severityScore(finalSeverity)
                .isEmergency(isEmergency)
                .supportCount(1)
                .build();

        // Resource Allocation & Cost Estimation (Module 7)
        ResourceEstimate resourceEstimate = resourceAllocationService.calculateEstimates(issue, dispatchData);

        // Offline Resilience Tracking (Module 9)
        OfflineSyncData offlineSyncData = OfflineSyncData.builder()
                .issue(issue)
                .isOfflineSynced(wasOfflineSynced)
                .originalCaptureTime(captureTime)
                .build();

        issue.setMetadata(metadata);
        issue.setDispatchData(dispatchData);
        issue.setResourceEstimate(resourceEstimate);
        issue.setOfflineSyncData(offlineSyncData);

        Issue savedIssue = issueRepository.save(issue);
        return ResponseEntity.ok(savedIssue);
    }

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {
        List<Issue> issues = issueRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(issues);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Issue> issueOpt = issueRepository.findById(id);
        if (issueOpt.isPresent()) {
            Issue issue = issueOpt.get();
            String newStatus = body.getOrDefault("status", "In Progress");
            issue.setStatus(newStatus);

            // Update user trust score based on official action
            if (issue.getCitizenEmail() != null) {
                int newTrustScore = trustScoreService.updateTrustScoreForStatus(issue.getCitizenEmail(), newStatus);
                issue.setCitizenTrustScore(newTrustScore);
            }

            issueRepository.save(issue);
            return ResponseEntity.ok(issue);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/team")
    public ResponseEntity<?> assignTeam(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Issue> issueOpt = issueRepository.findById(id);
        if (issueOpt.isPresent()) {
            Issue issue = issueOpt.get();
            String teamName = body.getOrDefault("allocatedTeam", "Municipal Rapid Response");

            ResourceEstimate estimate = issue.getResourceEstimate();
            if (estimate == null) {
                estimate = resourceAllocationService.calculateEstimates(issue, issue.getDispatchData());
            }
            estimate.setAllocatedTeam(teamName);
            issue.setResourceEstimate(estimate);

            issueRepository.save(issue);
            return ResponseEntity.ok(issue);
        }
        return ResponseEntity.notFound().build();
    }
}
