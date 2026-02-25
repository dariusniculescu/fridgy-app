package com.project.Fridgy.service;

import com.project.Fridgy.model.Ingredient;
import com.project.Fridgy.model.Recipe;
import com.project.Fridgy.model.User;
import com.project.Fridgy.repository.IngredientRepository;
import com.project.Fridgy.repository.RecipeIngredientRepository;
import com.project.Fridgy.repository.RecipeRepository;
import jakarta.transaction.Transactional;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiRecipeService {

    @Autowired
    private OpenAiChatModel chatModel;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private RecipeIngredientRepository recipeIngredientRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;


    public String generateRecipe(String promptText) {
        Prompt prompt = new Prompt(promptText);
        ChatResponse response = chatModel.call(prompt);
        return response.getResult().getOutput().getText();
    }

    public Recipe saveRecipe(String recipeText, String authHeader) {
        String[] lines = recipeText.split("\n", 2);
        String title = lines[0].replace("#", "").trim();
        String insturctions;
        if (lines.length > 1) {
            insturctions = lines[1].trim();
        } else {
            insturctions = "";
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized");
        }

        String token = authHeader.substring(7);

        if (jwtService.isTokenExpired(token)) {
            throw new RuntimeException("Token expired");
        }

        String email = jwtService.extractEmail(token);

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = new Recipe();
        recipe.setTitle(title);
        recipe.setInstructions(insturctions);
        recipe.setUser(user);

        return recipeRepository.save(recipe);
    }

    @Transactional
    public void linkRecipeWithIngredients(String ingredientString) {

        Recipe latestRecipe = recipeRepository.findTopByOrderByIdDesc();
        if (latestRecipe == null) {
            return;
        }

        Long recipeId = latestRecipe.getId();

        String[] names  = ingredientString.split(",");
        for (String name : names) {
            String ingredientName = name.trim();
            Ingredient ingredient = ingredientRepository.findByName(ingredientName);
            if (ingredient != null) {
                ingredient.incrementUsage();
                recipeIngredientRepository.insertRecipeIngredient(recipeId, ingredient.getId());
            }
        }

    }
}
