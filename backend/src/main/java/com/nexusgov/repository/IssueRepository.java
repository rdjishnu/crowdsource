// File: backend/src/main/java/com/nexusgov/repository/IssueRepository.java
package com.nexusgov.repository;

import com.nexusgov.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findAllByOrderByCreatedAtDesc();
    List<Issue> findByCitizenEmailOrderByCreatedAtDesc(String citizenEmail);
    Optional<Issue> findFirstByCitizenEmailOrderByCreatedAtDesc(String citizenEmail);
}
