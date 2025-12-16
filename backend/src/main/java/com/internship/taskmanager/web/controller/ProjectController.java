package com.internship.taskmanager.web.controller;



import com.internship.taskmanager.web.dto.project.*;
import com.internship.taskmanager.application.service.ProjectService;
import com.internship.taskmanager.domain.entity.Project;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // CREATE project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @RequestParam Long userId
    ) {
        Project project = projectService.createProject(
                request.getTitle(),
                request.getDescription(),
                userId
        );

        ProjectResponse response = new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getProgressPercentage()
        );

        return ResponseEntity.ok(response);
    }

    // GET projects by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectResponse>> getProjects(@PathVariable Long userId) {
        List<ProjectResponse> responses = projectService.getProjectsByUser(userId)
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
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}
