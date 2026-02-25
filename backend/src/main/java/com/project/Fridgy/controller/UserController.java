package com.project.Fridgy.controller;

import com.project.Fridgy.dto.UserDTO;
import com.project.Fridgy.mapper.UserMapper;
import com.project.Fridgy.model.Recipe;
import com.project.Fridgy.model.User;
import com.project.Fridgy.service.JwtService;
import com.project.Fridgy.service.RecipeService;
import com.project.Fridgy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private  UserService userService;

    @Autowired
    private  JwtService jwtService;

    @Autowired
    private  RecipeService recipeService;

    @GetMapping("/{userId}")
    public Optional<User> getUser(@PathVariable int userId) throws  Exception{
        return userService.getUserById(userId);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getLoggedUser(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);

        if (jwtService.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtService.extractEmail(token);

        User user = userService.getUserByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        UserDTO dto = UserMapper.userToUserDTO(user);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/me/favorites/{recipeId}")
    public ResponseEntity<String> addFavoriteRecipe(@RequestHeader("Authorization") String authHeader,
                                                    @PathVariable Long recipeId) {
        String email = jwtService.extractEmailFromAuthHeader(authHeader);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String response = userService.addFavoriteRecipe(email, recipeId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me/favorites/{recipeId}")
    public ResponseEntity<String> removeFavoriteRecipe(@RequestHeader("Authorization") String authHeader,
                                                       @PathVariable Long recipeId) {
        String email = jwtService.extractEmailFromAuthHeader(authHeader);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String response = userService.removeFavoriteRecipe(email, recipeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/favorites")
    public ResponseEntity<List<Recipe>> getFavoriteRecipes(@RequestHeader("Authorization") String authHeader) {
        String email = jwtService.extractEmailFromAuthHeader(authHeader);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Recipe> favorites = userService.getFavoriteRecipes(email);
        return ResponseEntity.ok(favorites);
    }


}