package com.internship.taskmanager.web.dto.project;


public class ProjectResponse {

    private Long id;
    private String title;
    private String description;
    private int progressPercentage;

    public ProjectResponse(Long id, String title, String description, int progressPercentage) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.progressPercentage = progressPercentage;
    }

    // getters only (read-only DTO)
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getProgressPercentage() { return progressPercentage; }
}
