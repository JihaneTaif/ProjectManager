package com.internship.taskmanager.application.service;

import com.internship.taskmanager.domain.entity.Project;
import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.domain.repository.ProjectRepository;
import com.internship.taskmanager.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // ✅ CREATE project (user from JWT)
    public Project createProject(
            String title,
            String description,
            Long authenticatedUserId
    ) {
        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found with id: " + authenticatedUserId));

        Project project = new Project(title, description);
        project.assignToUser(user);

        return projectRepository.save(project);
    }

    // ✅ GET projects of authenticated user ONLY
    public List<Project> getProjectsByUser(Long authenticatedUserId) {
        return projectRepository.findByUserId(authenticatedUserId);
    }

    // ✅ GET project with ownership check
    public Project getProject(Long projectId, Long authenticatedUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Project not found with id: " + projectId));

        if (!project.getUser().getId().equals(authenticatedUserId)) {
            throw new SecurityException("You do not own this project");
        }

        return project;
    }

    // ✅ DELETE project with ownership check
    public void deleteProject(Long projectId, Long authenticatedUserId) {
        Project project = getProject(projectId, authenticatedUserId);
        projectRepository.delete(project);
    }
}
