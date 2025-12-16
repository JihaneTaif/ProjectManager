package com.internship.taskmanager.web.dto.task;


import com.internship.taskmanager.domain.entity.TaskStatus;

import java.time.LocalDate;

public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;

    public TaskResponse(Long id, String title, String description,
                        LocalDate dueDate, TaskStatus status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
    }

    // getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public  LocalDate getDueDate() { return dueDate; }
    public TaskStatus getStatus() { return status; }

}

