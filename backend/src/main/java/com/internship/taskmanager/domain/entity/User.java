package com.internship.taskmanager.domain.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
public class User extends BaseEntity {


    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // A user owns many projects
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Project> projects = new ArrayList<>();

    // ===== Constructors =====
    protected User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // ===== Getters =====

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public List<Project> getProjects() {
        return projects;
    }
}
