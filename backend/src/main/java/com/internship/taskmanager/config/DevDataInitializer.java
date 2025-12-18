package com.internship.taskmanager.config;


import com.internship.taskmanager.domain.entity.User;
import com.internship.taskmanager.domain.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile({"local", "docker"})
public class DevDataInitializer {

    @Bean
    CommandLineRunner initUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.findByEmail("user@gmail.com").isEmpty()) {
                userRepository.save(
                    new User(
                        "user@gmail.com",
                        passwordEncoder.encode("7894")
                    )
                );
            }
        };
    }
}
