package com.project.Fridgy.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalAdmins;

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalNormalUsers() {
        return totalNormalUsers;
    }

    public void setTotalNormalUsers(long totalNormalUsers) {
        this.totalNormalUsers = totalNormalUsers;
    }

    public long getTotalRecipes() {
        return totalRecipes;
    }

    public void setTotalRecipes(long totalRecipes) {
        this.totalRecipes = totalRecipes;
    }

    public long getTotalFavorites() {
        return totalFavorites;
    }

    public void setTotalFavorites(long totalFavorites) {
        this.totalFavorites = totalFavorites;
    }

    public long getTotalIngredients() {
        return totalIngredients;
    }

    public void setTotalIngredients(long totalIngredients) {
        this.totalIngredients = totalIngredients;
    }

    public List<String> getTopFavoritedRecipes() {
        return topFavoritedRecipes;
    }

    public void setTopFavoritedRecipes(List<String> topFavoritedRecipes) {
        this.topFavoritedRecipes = topFavoritedRecipes;
    }

    public List<Object[]> getTopRecipeCreators() {
        return topRecipeCreators;
    }

    public void setTopRecipeCreators(List<Object[]> topRecipeCreators) {
        this.topRecipeCreators = topRecipeCreators;
    }

    private long totalNormalUsers;

    private long totalRecipes;
    private long totalFavorites;
    private long totalIngredients;

    private List<String> topFavoritedRecipes;
    private List<Object[]> topRecipeCreators;

}
