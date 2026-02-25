package com.project.Fridgy.repository;

import com.project.Fridgy.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Ingredient findByName(String name);


    @Query("SELECT i.name FROM Ingredient i ORDER BY i.usageCount DESC LIMIT 5")
    List<String> getTopIngredients();

    @Query("""
       SELECT i.name
       FROM Ingredient i
       ORDER BY COUNT(i) DESC
       """)
    long CountIngredients();
}
