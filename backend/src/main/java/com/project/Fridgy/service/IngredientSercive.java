package com.project.Fridgy.service;

import com.project.Fridgy.model.Ingredient;
import com.project.Fridgy.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientSercive {

    @Autowired
    private IngredientRepository ingredientRepository;

    public List<Ingredient> getAllIngredients(){
        return ingredientRepository.findAll();
    }

    public Optional<Ingredient> findById(long id){
        return ingredientRepository.findById(id);
    }

    public Ingredient addIngredient(Ingredient ingredient){
        return ingredientRepository.save(ingredient);
    }

    public Ingredient updateIngredient(Ingredient ingredient){
        return ingredientRepository.save(ingredient);
    }

    public void deleteIngredient(long id){
        ingredientRepository.deleteById(id);
    }

}
