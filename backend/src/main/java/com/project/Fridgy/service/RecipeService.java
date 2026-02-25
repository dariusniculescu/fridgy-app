package com.project.Fridgy.service;

import com.project.Fridgy.model.Recipe;
import com.project.Fridgy.model.User;
import com.project.Fridgy.repository.RecipeRepository;
import com.project.Fridgy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;


    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Recipe addRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public Recipe updateRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public Optional<Recipe> getRecipe(Long id) {
        return recipeRepository.findById(id);
    }

    public void deleteRecipe(Long id) {
        Optional<Recipe> recipeOpt = recipeRepository.findById(id);

        if (recipeOpt.isPresent()) {
            Recipe recipe = recipeOpt.get();

            List<User> usersToUpdate = recipe.getFavoritedBy();
            if (usersToUpdate != null) {
                for (User user : usersToUpdate) {
                    user.getFavoriteRecipes().remove(recipe);
                    userRepository.save(user);
                }
            }

            recipeRepository.deleteById(id);
        }
    }

    public List<Recipe> getAllUSerRecipes(int id){
        return recipeRepository.findByUserId(id);
    }

}
