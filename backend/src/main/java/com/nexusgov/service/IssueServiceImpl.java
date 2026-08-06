package com.nexusgov.service;

import com.nexusgov.dto.IssueCreateDTO;
import com.nexusgov.dto.IssueResponseDTO;
import com.nexusgov.dto.StatsDTO;
import com.nexusgov.dto.StatusUpdateDTO;
import com.nexusgov.entity.Issue;
import com.nexusgov.exception.ResourceNotFoundException;
import com.nexusgov.repository.IssueRepository;
import com.nexusgov.storage.FileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final FileStorageService storageService;

    public IssueServiceImpl(IssueRepository issueRepository, FileStorageService storageService) {
        this.issueRepository = issueRepository;
        this.storageService = storageService;
    }

    @Override
    public IssueResponseDTO createIssue(IssueCreateDTO createDTO) {
        String photoPath = storageService.storeFile(createDTO.getPhoto());

        Issue issue = new Issue();
        issue.setCategory(createDTO.getCategory());
        issue.setDescription(createDTO.getDescription());
        issue.setLatitude(createDTO.getLatitude());
        issue.setLongitude(createDTO.getLongitude());
        issue.setPhotoPath(photoPath);
        issue.setStatus("Reported");

        Issue savedIssue = issueRepository.save(issue);
        return IssueResponseDTO.fromEntity(savedIssue);
    }

    @Override
    @Transactional(readOnly = true)
    public IssueResponseDTO getIssueById(Long id) {
        Issue issue = issueRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));
        return IssueResponseDTO.fromEntity(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IssueResponseDTO> getAllIssues(String status, String category, String search, Pageable pageable) {
        Page<Issue> issues = issueRepository.findAllWithFilters(status, category, search, pageable);
        return issues.map(IssueResponseDTO::fromEntity);
    }

    @Override
    public IssueResponseDTO updateIssueStatus(Long id, StatusUpdateDTO statusUpdateDTO) {
        Issue issue = issueRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        issue.setStatus(statusUpdateDTO.getStatus());
        Issue updatedIssue = issueRepository.save(issue);
        return IssueResponseDTO.fromEntity(updatedIssue);
    }

    @Override
    @Transactional(readOnly = true)
    public StatsDTO getIssueStats() {
        long total = issueRepository.count();
        long reported = issueRepository.countByStatus("Reported");
        long inProgress = issueRepository.countByStatus("In Progress");
        long resolved = issueRepository.countByStatus("Resolved");
        long rejected = issueRepository.countByStatus("Rejected");

        List<Object[]> categoryCounts = issueRepository.countGroupedByCategory();
        Map<String, Long> breakdown = new HashMap<>();
        for (Object[] obj : categoryCounts) {
            String cat = (String) obj[0];
            Long cnt = (Long) obj[1];
            breakdown.put(cat, cnt);
        }

        return new StatsDTO(total, reported, inProgress, resolved, rejected, breakdown);
    }
}
