package com.internship.taskmanager;

import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.domain.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }

    /**
     * This runs ONCE when the application starts.
     * Used to insert a default user with a HASHED password.
     */
    @Bean
CommandLineRunner initUsers(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder) {

    return args -> {

        if (userRepository.findByEmail("user@mail.com").isEmpty()) {

            String hashedPassword =
                    passwordEncoder.encode("1234");

            User user = new User(
                    "user@mail.com",
                    hashedPassword
            );

            userRepository.save(user);
        }
    };
}

}
