package com.internship.taskmanager.web.dto.project;


public class ProjectResponse {

    private Long id;
    private String title;
    private String description;
    private int progress;

    public ProjectResponse(Long id, String title, String description, int progress) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.progress = progress;
    }

    // getters only (read-only DTO)
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getProgress() { return progress; }
}
