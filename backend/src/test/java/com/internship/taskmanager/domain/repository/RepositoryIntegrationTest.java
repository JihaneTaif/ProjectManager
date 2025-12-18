package com.internship.taskmanager.domain.repository;

import com.internship.taskmanager.domain.entity.Project;
import com.internship.taskmanager.domain.entity.Task;
import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.domain.repository.ProjectRepository;
import com.internship.taskmanager.domain.repository.TaskRepository;
import com.internship.taskmanager.domain.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class RepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void testProjectAndTaskPersistence() {
        // --- Create and save a user ---
        User user = new User("test@example.com", "pass");
        userRepository.save(user);

        // --- Create and save a project ---
        Project project = new Project("Project A", "Project Desc");
        project.assignToUser(user);
        projectRepository.save(project);

        // --- Create and save tasks ---
        Task t1 = new Task("Task 1", "Desc 1", LocalDate.now());
        t1.assignToProject(project);
        Task t2 = new Task("Task 2", "Desc 2", LocalDate.now());
        t2.assignToProject(project);

        taskRepository.save(t1);
        taskRepository.save(t2);

        // --- Fetch and assert ---
        List<Project> userProjects = projectRepository.findByUserId(user.getId());
        assertThat(userProjects).hasSize(1);
        assertThat(userProjects.get(0).getTitle()).isEqualTo("Project A");

        List<Task> projectTasks = taskRepository.findByProjectId(project.getId());
        assertThat(projectTasks).hasSize(2);
        assertThat(projectTasks).extracting(Task::getTitle)
                                .containsExactlyInAnyOrder("Task 1", "Task 2");
    }
}
