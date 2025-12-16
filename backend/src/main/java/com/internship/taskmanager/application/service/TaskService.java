package com.internship.taskmanager.application.service;

import com.internship.taskmanager.domain.entity.Project;
import com.internship.taskmanager.domain.entity.Task;
import com.internship.taskmanager.domain.entity.TaskStatus;
import com.internship.taskmanager.domain.repository.ProjectRepository;
import com.internship.taskmanager.domain.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    // Create a task
    public Task createTask(String title, String description, LocalDate dueDate, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));

        Task task = new Task(title, description, dueDate);
        task.assignToProject(project);

        return taskRepository.save(task);
    }

    // Get all tasks for a project
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    // Pagination + filtering + search
    public Page<Task> getTasksByProjectWithFilters(
            Long projectId,
            TaskStatus status,
            String title,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findByProjectIdWithFilters(projectId, status, title, pageable);
    }

    // Complete a task
    public Task completeTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        task.markAsCompleted();
        return taskRepository.save(task);
    }

    // Delete a task
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));
        taskRepository.delete(task);
    }
}
