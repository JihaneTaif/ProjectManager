package com.internship.taskmanager.web.dto.task;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreateTaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    @Size(max = 1000)
    private String description;

    private LocalDate dueDate;

    // getters & setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    
}
