package com.internship.taskmanager.application.service;

import com.internship.taskmanager.domain.entity.Project;
import com.internship.taskmanager.domain.entity.Task;
import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.domain.repository.ProjectRepository;
import com.internship.taskmanager.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    private ProjectRepository projectRepository;
    private UserRepository userRepository;
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        projectRepository = mock(ProjectRepository.class);
        userRepository = mock(UserRepository.class);
        projectService = new ProjectService(projectRepository, userRepository);
    }

    @Test
    void testCreateProject() {
        User user = new User("user@example.com", "pass");

        // Mock repository behavior
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(projectRepository.save(any(Project.class)))
                .thenAnswer(invocation -> invocation.getArgument(0)); // return the project passed in

        Project created = projectService.createProject(
                "Project A",
                "Desc",
                1L
        );

        assertEquals("Project A", created.getTitle());
        assertEquals(user, created.getUser());
    }

    @Test
    void testProgressPercentage() {
        User user = new User("user@example.com", "pass");
        Project project = new Project("Project A", "Desc");
        project.assignToUser(user); // assign user since constructor no longer does it

        // Create tasks and assign them to project
        Task t1 = new Task("Task 1", "Desc", null);
        t1.assignToProject(project);

        Task t2 = new Task("Task 2", "Desc", null);
        t2.assignToProject(project);

        // Mark one task as completed
        t1.markAsCompleted();

        // Add tasks to project
        project.getTasks().add(t1);
        project.getTasks().add(t2);

        // Check progress
        assertEquals(50, project.getProgressPercentage());
    }
}
