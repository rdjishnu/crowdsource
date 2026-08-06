package com.nexusgov.service;

import com.nexusgov.dto.IssueCreateDTO;
import com.nexusgov.dto.IssueResponseDTO;
import com.nexusgov.dto.StatsDTO;
import com.nexusgov.dto.StatusUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IssueService {

    IssueResponseDTO createIssue(IssueCreateDTO createDTO);

    IssueResponseDTO getIssueById(Long id);

    Page<IssueResponseDTO> getAllIssues(String status, String category, String search, Pageable pageable);

    IssueResponseDTO updateIssueStatus(Long id, StatusUpdateDTO statusUpdateDTO);

    StatsDTO getIssueStats();
}
