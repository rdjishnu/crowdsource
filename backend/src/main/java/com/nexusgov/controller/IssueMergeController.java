// File: backend/src/main/java/com/nexusgov/controller/IssueMergeController.java
package com.nexusgov.controller;

import com.nexusgov.entity.Issue;
import com.nexusgov.entity.IssueDispatchData;
import com.nexusgov.repository.IssueRepository;
import com.nexusgov.service.SeverityScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/issues")
public class IssueMergeController {

    private final IssueRepository issueRepository;
    private final SeverityScoringService severityScoringService;

    public IssueMergeController(IssueRepository issueRepository, SeverityScoringService severityScoringService) {
        this.issueRepository = issueRepository;
        this.severityScoringService = severityScoringService;
    }

    /**
     * Upvotes / Supports an existing civic issue (Duplicate Prevention at source).
     * Increments supportCount and dynamically recalculates severity score.
     */
    @PostMapping("/{id}/support")
    public ResponseEntity<?> supportIssue(@PathVariable Long id) {
        Optional<Issue> issueOpt = issueRepository.findById(id);
        if (issueOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Issue issue = issueOpt.get();
        IssueDispatchData dispatchData = issue.getDispatchData();

        if (dispatchData == null) {
            dispatchData = IssueDispatchData.builder()
                    .issue(issue)
                    .assignedDepartment("Municipal General")
                    .severityScore(50)
                    .supportCount(1)
                    .build();
            issue.setDispatchData(dispatchData);
        }

        int currentSupport = dispatchData.getSupportCount() != null ? dispatchData.getSupportCount() : 1;
        int newSupport = currentSupport + 1;
        dispatchData.setSupportCount(newSupport);

        int trustScore = issue.getCitizenTrustScore() != null ? issue.getCitizenTrustScore() : 100;
        int newSeverity = severityScoringService.calculateSeverity(issue, trustScore, newSupport);
        dispatchData.setSeverityScore(newSeverity);
        dispatchData.setIsEmergency(severityScoringService.isEmergency(newSeverity));

        issueRepository.save(issue);
        return ResponseEntity.ok(issue);
    }
}
