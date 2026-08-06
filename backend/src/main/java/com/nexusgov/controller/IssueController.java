package com.nexusgov.controller;

import com.nexusgov.dto.IssueCreateDTO;
import com.nexusgov.dto.IssueResponseDTO;
import com.nexusgov.dto.StatsDTO;
import com.nexusgov.dto.StatusUpdateDTO;
import com.nexusgov.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    /**
     * REPORT ISSUE API
     * Multipart Form Data
     * Fields: category, description, latitude, longitude, photo
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IssueResponseDTO> createIssue(@Valid @ModelAttribute IssueCreateDTO createDTO) {
        IssueResponseDTO created = issueService.createIssue(createDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * GET ISSUE BY ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<IssueResponseDTO> getIssueById(@PathVariable Long id) {
        IssueResponseDTO issue = issueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }

    /**
     * LIST ISSUES WITH PAGINATION, SORTING AND FILTERS
     */
    @GetMapping
    public ResponseEntity<Page<IssueResponseDTO>> getAllIssues(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<IssueResponseDTO> issues = issueService.getAllIssues(status, category, search, pageable);
        return ResponseEntity.ok(issues);
    }

    /**
     * CHANGE STATUS
     * Status Values: Reported, In Progress, Resolved, Rejected
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<IssueResponseDTO> updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody StatusUpdateDTO statusUpdateDTO
    ) {
        IssueResponseDTO updated = issueService.updateIssueStatus(id, statusUpdateDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * DASHBOARD STATISTICS
     */
    @GetMapping("/stats")
    public ResponseEntity<StatsDTO> getStats() {
        StatsDTO stats = issueService.getIssueStats();
        return ResponseEntity.ok(stats);
    }
}
