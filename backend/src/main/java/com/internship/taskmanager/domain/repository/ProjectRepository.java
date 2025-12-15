package com.internship.taskmanager.domain.repository;

import com.internship.taskmanager.domain.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUserId(Long userId);
}
