// File: backend/src/main/java/com/nexusgov/repository/IssueMetadataRepository.java
package com.nexusgov.repository;

import com.nexusgov.entity.IssueMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IssueMetadataRepository extends JpaRepository<IssueMetadata, Long> {
    Optional<IssueMetadata> findByIssueId(Long issueId);
    Optional<IssueMetadata> findByFileHash(String fileHash);
    boolean existsByFileHash(String fileHash);
}
