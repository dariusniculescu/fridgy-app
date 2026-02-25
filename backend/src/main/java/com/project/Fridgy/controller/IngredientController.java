package com.project.Fridgy.controller;

import com.project.Fridgy.model.Ingredient;
import com.project.Fridgy.service.IngredientSercive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {

    @Autowired
    private IngredientSercive ingredientSercive;

    @GetMapping
    public List<Ingredient> getAllIngredients(){
        return ingredientSercive.getAllIngredients();
    }

    @PostMapping
    public Ingredient addIngredient(@RequestBody Ingredient ingredient){
        return ingredientSercive.addIngredient(ingredient);
    }

    @GetMapping("/{id}")
    public Optional<Ingredient> find(@PathVariable long id){
        return ingredientSercive.findById(id);
    }

    @PutMapping("/{id}")
    public Ingredient updateIngredient(@PathVariable long id, @RequestBody Ingredient ingredient) {
        ingredient.setId(id);
        return ingredientSercive.updateIngredient(ingredient);
    }

    @DeleteMapping("/{id}")
    public void deleteIngredient(@PathVariable long id) {
        ingredientSercive.deleteIngredient(id);
    }

}
