package com.project.Fridgy.service;

import com.project.Fridgy.model.Review;
import com.project.Fridgy.model.Recipe;
import com.project.Fridgy.model.User;
import com.project.Fridgy.repository.ReviewRepository;
import com.project.Fridgy.repository.RecipeRepository;
import com.project.Fridgy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewsService {

    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReviewsService(ReviewRepository reviewRepository, RecipeRepository recipeRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    public List<Review> getReviewsByRecipeId(Long recipeId) {
        return reviewRepository.findByRecipeId(recipeId);
    }

    public Review addReview(Long recipeId, User user, int rating, String comment) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        Review review = new Review(recipe, user, rating, comment);
        return reviewRepository.save(review);
    }


}
