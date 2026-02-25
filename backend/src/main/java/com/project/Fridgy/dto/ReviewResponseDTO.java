package com.project.Fridgy.dto;

import com.project.Fridgy.model.Review;
import lombok.Data;

@Data
public class ReviewResponseDTO {
    private int rating;
    private String comment;
    private String userName;

    public ReviewResponseDTO(Review review) {
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.userName = review.getUser() != null ? review.getUser().getName() : "Anonymous";
    }
}
