package com.internship.taskmanager.web.controller;

import com.internship.taskmanager.application.service.ProjectService;
import com.internship.taskmanager.domain.repository.UserRepository;
import com.internship.taskmanager.domain.entity.Project;
import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.web.dto.project.*;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    // CREATE project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            Authentication authentication
    ) {
        // Get user email from JWT
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Project project = projectService.createProject(
                request.getTitle(),
                request.getDescription(),
                user.getId()
        );

        return ResponseEntity.ok(new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getProgressPercentage()
        ));
    }

    // GET all my projects
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<ProjectResponse> responses = projectService.getProjectsByUser(user.getId())
                .stream()
                .map(p -> new ProjectResponse(
                        p.getId(),
                        p.getTitle(),
                        p.getDescription(),
                        p.getProgressPercentage()
                ))
                .toList();

        return ResponseEntity.ok(responses);
    }

    // DELETE project
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        projectService.deleteProject(projectId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
