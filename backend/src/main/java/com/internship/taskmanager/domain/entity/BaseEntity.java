package com.internship.taskmanager.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Base class for all entities.
 * Contains common fields shared across the domain.
 */
@MappedSuperclass
public abstract class BaseEntity {

    /**
     * Primary key for all entities.
     * Generated automatically by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Date when the record was created.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Date when the record was last updated.
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Automatically sets timestamps before insert.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Automatically updates timestamp before update.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters only (setters are usually not needed for id & timestamps)

    public Long getId() {
        return id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
