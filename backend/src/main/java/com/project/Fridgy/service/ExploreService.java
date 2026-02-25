package com.project.Fridgy.service;

import com.project.Fridgy.model.Recipe;
import com.project.Fridgy.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExploreService {

    private final RecipeRepository recipeRepository;

    public ExploreService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }
    public List<Recipe> getFavoritedRecipes() {
        return recipeRepository.getFavoritedRecipes();
    }
}
