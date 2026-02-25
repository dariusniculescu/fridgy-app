package com.project.Fridgy.service;

import com.project.Fridgy.dto.DashboardStatsDTO;
import com.project.Fridgy.model.Role;
import com.project.Fridgy.repository.IngredientRepository;
import com.project.Fridgy.repository.UserRepository;
import com.project.Fridgy.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AdminStatsService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final RecipeRepository recipeRepository;

    @Autowired
    private final IngredientRepository ingredientRepository;

    public AdminStatsService(UserRepository userRepository,
                             RecipeRepository recipeRepository,
                             IngredientRepository ingredientRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
    }

    public DashboardStatsDTO getStats() {

        DashboardStatsDTO dto = new DashboardStatsDTO();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalAdmins(userRepository.countByRole(Role.ADMIN));
        dto.setTotalNormalUsers(userRepository.countByRole(Role.REGULAR));


        dto.setTotalRecipes(recipeRepository.count());
        dto.setTotalFavorites(recipeRepository.countTotalFavorites());
        dto.setTotalIngredients(ingredientRepository.count());


        dto.setTopFavoritedRecipes(
                recipeRepository.getMostFavoritedRecipes()
        );

        dto.setTopRecipeCreators(
                recipeRepository.getTopRecipeCreators()
        );

        return dto;
    }
}
