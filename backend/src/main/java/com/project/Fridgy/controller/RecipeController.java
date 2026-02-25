package com.project.Fridgy.controller;


import com.project.Fridgy.dto.RecipeDTO;
import com.project.Fridgy.mapper.RecipeMapper;
import com.project.Fridgy.model.Recipe;
import com.project.Fridgy.model.User;
import com.project.Fridgy.service.JwtService;
import com.project.Fridgy.service.RecipeService;
import com.project.Fridgy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<List<RecipeDTO>> getUserRecipes(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);

        String email = jwtService.extractEmail(token);

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Recipe> recipeList = recipeService.getAllUSerRecipes(user.getId());
        List<RecipeDTO> recipes = new ArrayList<>();

        for (Recipe recipe : recipeList) {
            recipes.add(RecipeMapper.toDTO(recipe));
        }

        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/all")
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @DeleteMapping("/delete/{recipeId}")
    public ResponseEntity<String> deleteRecipe(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("recipeId") long recipeId) {

        String email = jwtService.extractEmailFromAuthHeader(authHeader);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user = userService.getUserByEmail(email).orElse(null);
        Optional<Recipe> recipeOpt = recipeService.getRecipe(recipeId);

        if (user == null || recipeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Recipe not found.");
        }
        Recipe recipe = recipeOpt.get();

        if (recipe.getUser() == null || recipe.getUser().getId() != user.getId()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this recipe.");
        }

        recipeService.deleteRecipe(recipeId);

        return ResponseEntity.ok("Recipe deleted successfully.");
    }

    @GetMapping("/{recipeId}")
    public Recipe getRecipe(@PathVariable Long recipeId) {
        Optional<Recipe> recipe = recipeService.getRecipe(recipeId);
        if (recipe.isEmpty()) return null;
        return recipe.get();
    }
}

