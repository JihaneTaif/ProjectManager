package com.internship.taskmanager.domain.repository;

import com.internship.taskmanager.domain.entity.Task;
import com.internship.taskmanager.domain.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Original simple method
    List<Task> findByProjectId(Long projectId);

    // JPQL query for filtering and searching with pagination
    @Query("SELECT t FROM Task t " +
           "WHERE t.project.id = :projectId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%')))")
    Page<Task> findByProjectIdWithFilters(
            @Param("projectId") Long projectId,
            @Param("status") TaskStatus status,
            @Param("title") String title,
            Pageable pageable
    );
}
