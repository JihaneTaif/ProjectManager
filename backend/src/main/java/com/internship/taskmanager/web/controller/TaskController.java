package com.internship.taskmanager.web.controller;

import com.internship.taskmanager.application.service.TaskService;
import com.internship.taskmanager.domain.entity.Task;
import com.internship.taskmanager.domain.entity.TaskStatus;
import com.internship.taskmanager.web.dto.task.CreateTaskRequest;
import com.internship.taskmanager.web.dto.task.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @RequestParam Long projectId
    ) {
        Task task = taskService.createTask(
                request.getTitle(),
                request.getDescription(),
                request.getDueDate(),
                projectId
        );

        return ResponseEntity.ok(new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus()
        ));
    }

    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable Long taskId) {
        Task task = taskService.completeTask(taskId);

        return ResponseEntity.ok(new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getStatus()
        ));
    }

    // New endpoint: pagination + filtering + search
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getTasks(
            @RequestParam Long projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Task> tasksPage = taskService.getTasksByProjectWithFilters(
                projectId, status, title, page, size
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
}
