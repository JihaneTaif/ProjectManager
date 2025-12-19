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
import static org.mockito.ArgumentMatchers.any;
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
    // GIVEN
    User user = mock(User.class);
    when(user.getId()).thenReturn(1L);

    Project project = new Project("Project A", "Desc");
    project.assignToUser(user);

    when(projectRepository.findById(1L))
            .thenReturn(Optional.of(project));

    when(taskRepository.save(any(Task.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    // WHEN
    Task created = taskService.createTask(
            "Task 1",
            "Desc",
            LocalDate.now(),
            1L,   // projectId
            1L    // userId
    );

    // THEN
    assertEquals("Task 1", created.getTitle());
    assertEquals(project, created.getProject());
}


   @Test
void testCompleteTask() {
    // GIVEN
    User user = mock(User.class);
    when(user.getId()).thenReturn(1L);

    Project project = new Project("Project A", "Desc");
    project.assignToUser(user);

    Task task = new Task("Task 1", "Desc", LocalDate.now());
    task.assignToProject(project);

    when(taskRepository.findById(1L))
            .thenReturn(Optional.of(task));

    when(taskRepository.save(any(Task.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    // WHEN
    Task completed = taskService.completeTask(1L, 1L);

    // THEN
    assertEquals(TaskStatus.DONE, completed.getStatus());
}

}
