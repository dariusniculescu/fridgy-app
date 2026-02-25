package com.project.Fridgy.controller;

import com.project.Fridgy.dto.ReviewDTO;
import com.project.Fridgy.dto.ReviewResponseDTO;
import com.project.Fridgy.model.Review;
import com.project.Fridgy.model.User;
import com.project.Fridgy.service.ReviewsService;
import com.project.Fridgy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class ReviewsController {

    @Autowired
    private ReviewsService reviewsService;

    @Autowired
    private UserService userService;

    @GetMapping("/{id}/reviews")
    public List<ReviewResponseDTO> getReviews(@PathVariable Long id) {
        return reviewsService.getReviewsByRecipeId(id)
                .stream()
                .map(ReviewResponseDTO::new)
                .toList();
    }

    @PostMapping("/{id}/reviews")
    public Review postReview(@PathVariable Long id, @RequestBody ReviewDTO reviewDTO) {
        User user = userService.getUserByEmail(reviewDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reviewsService.addReview(
                id,
                user,
                reviewDTO.getRating(),
                reviewDTO.getComment()
        );
    }
}
