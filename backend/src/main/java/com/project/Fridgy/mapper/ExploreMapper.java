package com.project.Fridgy.mapper;

import com.project.Fridgy.dto.ExploreDTO;
import com.project.Fridgy.model.Recipe;

import java.util.stream.Collectors;

public class ExploreMapper {

    public static ExploreDTO recipeToExploreDTO(Recipe recipe) {
        ExploreDTO dto = new ExploreDTO();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());

        String instructions = recipe.getInstructions() != null ? recipe.getInstructions() : "";
        dto.setDescription(instructions.length() > 100 ? instructions.substring(0, 100) + "..." : instructions);

        dto.setAuthorName(recipe.getUser() != null ? recipe.getUser().getName() : "Unknown");

        dto.setIngredients(
                recipe.getIngredientList() != null
                        ? recipe.getIngredientList().stream().map(i -> i.getName()).collect(Collectors.toList())
                        : null
        );

        return dto;
    }
}
