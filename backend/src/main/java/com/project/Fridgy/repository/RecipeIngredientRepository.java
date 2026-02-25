package com.project.Fridgy.repository;

import com.project.Fridgy.model.Recipe;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<Recipe, Long> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES (:recipeId, :ingredientId)", nativeQuery = true)
    void insertRecipeIngredient(@Param("recipeId") Long recipeId, @Param("ingredientId") Long ingredientId);
}
