package com.nexusgov.repository;

import com.nexusgov.entity.Issue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    Page<Issue> findByStatus(String status, Pageable pageable);

    Page<Issue> findByCategory(String category, Pageable pageable);

    Page<Issue> findByStatusAndCategory(String status, String category, Pageable pageable);

    @Query("SELECT i FROM Issue i WHERE " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:search IS NULL OR LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Issue> findAllWithFilters(
        @Param("status") String status,
        @Param("category") String category,
        @Param("search") String search,
        Pageable pageable
    );

    long countByStatus(String status);

    @Query("SELECT i.category, COUNT(i) FROM Issue i GROUP BY i.category")
    List<Object[]> countGroupedByCategory();
}
