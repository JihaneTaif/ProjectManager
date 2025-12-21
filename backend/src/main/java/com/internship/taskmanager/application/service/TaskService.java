
package com.internship.taskmanager.application.service;
import com.internship.taskmanager.domain.entity.*;
import com.internship.taskmanager.domain.repository.*;
import org.springframework.data.domain.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;




@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    // ✅ CREATE task (with ownership check)
    public Task createTask(
            String title,
            String description,
            LocalDate dueDate,
            Long projectId,
            Long userId
    ) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Project not found with id: " + projectId));

        // 🔐 Ownership check
        if (!project.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not own this project");
        }

        Task task = new Task(title, description, dueDate);
        task.assignToProject(project);

        return taskRepository.save(task);
    }

    // ✅ GET tasks (pagination + filters + ownership)
    public Page<Task> getTasksByProjectWithFilters(
            Long projectId,
            TaskStatus status,
            String title,
            int page,
            int size,
            Long userId
    ) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Project not found with id: " + projectId));

        // 🔐 Ownership check
        Long projectOwnerId = project.getUser().getId();
        System.out.println("DEBUG: Task fetch for projectId=" + projectId + " | projectOwnerId=" + projectOwnerId + " | requestUserId=" + userId);
        
        if (!projectOwnerId.equals(userId)) {
            System.out.println("DEBUG: Ownership mismatch! projectOwnerId=" + projectOwnerId + " != requestUserId=" + userId);
            throw new SecurityException("You do not own this project (ID: " + projectId + "). Access denied.");
        }

        Pageable pageable = PageRequest.of(page, size);
        String searchTitle = (title != null && !title.isEmpty()) ? "%" + title.toLowerCase() + "%" : null;
        
        return taskRepository.findByProjectIdWithFilters(
                projectId, status, searchTitle, pageable);
    }

    // ✅ COMPLETE task (ownership via project)
    public Task completeTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Task not found with id: " + taskId));

        Project project = task.getProject();

        // 🔐 Ownership check
        if (!project.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not own this task");
        }

        task.markAsCompleted();
        return taskRepository.save(task);
    }

    // (Optional) DELETE task
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Task not found with id: " + taskId));

        if (!task.getProject().getUser().getId().equals(userId)) {
            throw new SecurityException("You do not own this task");
        }

        taskRepository.delete(task);
    }
}
