package com.internship.taskmanager.domain.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project extends BaseEntity {



    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    // Many projects belong to one user
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // A project contains many tasks
    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Task> tasks = new ArrayList<>();

    // ===== Constructors =====
    protected Project() {}

    public Project(String title, String description) {
        this.title = title;
        this.description = description;
       
    }
     /** domain relation method */
    public void assignToUser(User user) {
        this.user = user;
    }

    // ===== Domain logic =====
    public int getTotalTasks() {
        return tasks.size();
    }

    public long getCompletedTasks() {
        return tasks.stream()
                .filter(Task::isCompleted)
                .count();
    }

    public int getProgressPercentage() {
        if (tasks.isEmpty()) {
            return 0;
        }
        return (int) ((getCompletedTasks() * 100) / tasks.size());
    }

    

    // ===== Getters =====

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public User getUser() {
        return user;
    }

    public List<Task> getTasks() {
        return tasks;
    }
}
