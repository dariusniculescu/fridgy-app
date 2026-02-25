package com.project.Fridgy;

import com.project.Fridgy.model.User;
import com.project.Fridgy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoderRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking for unencoded passwords...");

        for (User user : userRepository.findAll()) {
            String password = user.getPassword();
            if (!password.startsWith("$2a$") && !password.startsWith("$2b$") && !password.startsWith("$2y$")) {
                String encoded = encoder.encode(password);
                user.setPassword(encoded);
                userRepository.save(user);
            }
        }

        System.out.println("Password re-encoding complete!");
    }
}
