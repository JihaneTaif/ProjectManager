package com.internship.taskmanager.web.controller;

import com.internship.taskmanager.application.service.TaskService;
import com.internship.taskmanager.domain.entity.Task;
import com.internship.taskmanager.domain.entity.TaskStatus;
import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.web.dto.task.CreateTaskRequest;
import com.internship.taskmanager.web.dto.task.TaskResponse;
import com.internship.taskmanager.domain.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    // CREATE task
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @RequestParam Long projectId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Task task = taskService.createTask(
                request.getTitle(),
                request.getDescription(),
                request.getDueDate(),
                projectId,
                user.getId()
        );

        return ResponseEntity.ok(new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus()
        ));
    }

    // GET tasks (pagination + filters)
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getTasks(
            @RequestParam Long projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Page<Task> tasksPage = taskService.getTasksByProjectWithFilters(
                projectId, status, title, page, size, user.getId()
        );

        Page<TaskResponse> responsePage = tasksPage.map(task -> new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus()
        ));

        return ResponseEntity.ok(responsePage);
    }

    // COMPLETE task
    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> completeTask(
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Task task = taskService.completeTask(taskId, user.getId());

        return ResponseEntity.ok(new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus()
        ));
    }

    // DELETE project
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        taskService.deleteTask(taskId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
