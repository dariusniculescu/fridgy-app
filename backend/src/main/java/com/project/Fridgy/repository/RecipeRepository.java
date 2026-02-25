package com.project.Fridgy.repository;

import com.project.Fridgy.model.Recipe;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    Recipe findTopByOrderByIdDesc();
    List<Recipe> findByUserId(int id);

    @Query("""
       SELECT r.title 
       FROM Recipe r 
       LEFT JOIN r.favoritedBy u 
       GROUP BY r.id 
       ORDER BY COUNT(u) DESC
       """)
    List<String> getMostFavoritedRecipes();


    @Query("""
       SELECT r
       FROM Recipe r
       WHERE size(r.favoritedBy) > 0
       """)
    List<Recipe> getFavoritedRecipes();

    @Query("SELECT COUNT(f) FROM User u JOIN u.favoriteRecipes f")
    long countTotalFavorites();

    @Query("""
       SELECT u.name, COUNT(r.id)
       FROM User u
       JOIN Recipe r ON r.user = u
       GROUP BY u.id, u.name
       ORDER BY COUNT(r.id) DESC
       """)
    List<Object[]> getTopRecipeCreators();




}
