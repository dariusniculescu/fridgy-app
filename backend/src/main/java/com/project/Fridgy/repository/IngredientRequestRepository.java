package com.project.Fridgy.repository;

import com.project.Fridgy.model.IngredientRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRequestRepository extends JpaRepository<IngredientRequest, Long> {
    List<IngredientRequest> findByStatus(String status);

    List<IngredientRequest> findByRequestedByEmail(String email);
}
