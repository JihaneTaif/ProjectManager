package com.internship.taskmanager.application.service;

import com.internship.taskmanager.domain.entity.Project;
import com.internship.taskmanager.domain.entity.Task;
import com.internship.taskmanager.domain.entity.TaskStatus;
import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.domain.repository.ProjectRepository;
import com.internship.taskmanager.domain.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    private TaskRepository taskRepository;
    private ProjectRepository projectRepository;
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        projectRepository = mock(ProjectRepository.class);
        taskService = new TaskService(taskRepository, projectRepository);
    }

    @Test
    void testCreateTask() {
        User user = new User("u@mail.com", "pass");
        Project project = new Project("Project A", "Desc");
        project.assignToUser(user);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(taskRepository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Task created = taskService.createTask(
                "Task 1",
                "Desc",
                LocalDate.now(),
                1L
        );

        assertEquals("Task 1", created.getTitle());
        assertEquals(project, created.getProject());
    }

    @Test
    void testCompleteTask() {
        User user = new User("u@mail.com", "pass");
        Project project = new Project("Project A", "Desc");
        project.assignToUser(user);

        Task task = new Task("Task 1", "Desc", LocalDate.now());
        task.assignToProject(project);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Task completed = taskService.completeTask(1L);

        assertEquals(TaskStatus.DONE, completed.getStatus());
    }
}
