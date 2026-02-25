package com.project.Fridgy.mapper;

import com.project.Fridgy.dto.RecipeDTO;
import com.project.Fridgy.model.Recipe;

public class RecipeMapper {

    public static RecipeDTO toDTO(Recipe recipe) {
        RecipeDTO recipeDTO = new RecipeDTO();
        recipeDTO.setId(recipe.getId());
        recipeDTO.setTitle(recipe.getTitle());
        recipeDTO.setInstructions(recipe.getInstructions());
        recipeDTO.setAuthorName(recipe.getAuthorName());
        return recipeDTO;
    }
}
