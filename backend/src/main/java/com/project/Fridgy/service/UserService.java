package com.project.Fridgy.service;

import com.project.Fridgy.model.Recipe;
import com.project.Fridgy.model.User;
import com.project.Fridgy.repository.RecipeRepository;
import com.project.Fridgy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RecipeRepository recipeRepository;

    public String validatePassword(String password) {
        if (password == null || password.isBlank()) {
            return "Password is required";
        }

        if (password.contains(" ")) {
            return "Password must not contain spaces.";
        }

//        if (password.length() < 8) {
//            return "Password must be at least 8 characters.";
//        }

        return null;
    }

    public String registerUser(User user){
        if(userRepository.existsByEmail(user.getEmail()))
            return "User already exists";

        String validationMessage = validatePassword(user.getPassword());
        if (validationMessage != null) {
            return validationMessage;
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    public String loginUser(String email, String password){
        Optional<User> userOpt = userRepository.findByEmail(email);

        if(userOpt.isEmpty())
            return "User not found";

        User user = userOpt.get();

        // folosim PasswordEncoder.matches pentru a compara parola raw cu cea criptata
        if(passwordEncoder.matches(password, user.getPassword())){
            return "Logged in successfully";
        } else {
            return "Incorrect password";
        }
    }

    public String resetPassword(String email, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return "Invalid token";

        User user = userOpt.get();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return "Incorrect current password";
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            return "New password must be different";
        }

        String validationMessage = validatePassword(newPassword);
        if (validationMessage != null) {
            return validationMessage;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return "Password changed successfully";
    }

    public Optional<User> getUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String addFavoriteRecipe(String email, Long recipeId) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);

        if (userOpt.isEmpty() || recipeOpt.isEmpty()) {
            return "User or Recipe not found";
        }

        User user = userOpt.get();
        Recipe recipe = recipeOpt.get();

        if (!user.getFavoriteRecipes().contains(recipe)) {
            user.getFavoriteRecipes().add(recipe);
            userRepository.save(user);
            return "Recipe added to favorites";
        } else {
            return "Recipe already in favorites";
        }
    }

    public String removeFavoriteRecipe(String email, Long recipeId) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);

        if (userOpt.isEmpty() || recipeOpt.isEmpty()) {
            return "User or Recipe not found";
        }

        User user = userOpt.get();
        Recipe recipe = recipeOpt.get();

        if (user.getFavoriteRecipes().contains(recipe)) {
            user.getFavoriteRecipes().remove(recipe);
            userRepository.save(user);
            return "Recipe removed from favorites";
        } else {
            return "Recipe not in favorites";
        }
    }

    public List<Recipe> getFavoriteRecipes(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.map(User::getFavoriteRecipes).orElse(List.of());
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public Optional<User> getUserById(int userId) {
        return userRepository.findById(userId);
    }
}