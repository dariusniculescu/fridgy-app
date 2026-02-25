package com.project.Fridgy.controller;

import com.project.Fridgy.dto.PasswordResetRequest;
import com.project.Fridgy.model.User;
import com.project.Fridgy.service.JwtService;
import com.project.Fridgy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String message = userService.registerUser(user);
        if (message.equals("User registered successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } else if (message.equals("User already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);

        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        String message = userService.loginUser(user.getEmail(), user.getPassword());

        if (message.equals("Logged in successfully")) {
            User loggedInUser = userService.getUserByEmail(user.getEmail()).get();
            String token = jwtService.generateToken(loggedInUser);

            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PutMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request,
                                                @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);

        String message = userService.resetPassword(email, request.getOldPassword(), request.getNewPassword());

        if (message.equals("Password changed successfully")) {
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
