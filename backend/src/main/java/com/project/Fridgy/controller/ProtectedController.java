package com.project.Fridgy.controller;

import com.project.Fridgy.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProtectedController {

    @Autowired
    private JwtService jwtService;


    @GetMapping("/secret")
    public ResponseEntity<String> getSecret(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token provided");
            }
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);

            if (!jwtService.isTokenExpired(token)) {
                return ResponseEntity.ok("Welcome, " + email + ".");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
        }
    }
}
