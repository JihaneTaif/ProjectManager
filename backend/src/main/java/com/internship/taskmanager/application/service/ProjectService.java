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

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create a new project for a given user.
     */
    public Project createProject(String title, String description, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Project project = new Project(title, description);
        project.assignToUser(user);

        return projectRepository.save(project);
    }

    /**
     * Fetch all projects for a user.
     */
    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    /**
     * Fetch a project by its ID.
     */
    public Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));
    }

    /**
     * Delete a project by ID.
     */
    public void deleteProject(Long projectId) {
        Project project = getProject(projectId);
        projectRepository.delete(project);
    }
}
