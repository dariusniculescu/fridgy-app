package com.project.Fridgy.service;

import com.project.Fridgy.model.Ingredient;
import com.project.Fridgy.model.IngredientRequest;
import com.project.Fridgy.model.User;
import com.project.Fridgy.repository.IngredientRepository;
import com.project.Fridgy.repository.IngredientRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientRequestService {

    @Autowired
    private IngredientRequestRepository ingredientRequestRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    public IngredientRequest createRequest(String name, String symbol, User user){
        IngredientRequest ingredientRequest = new IngredientRequest();
        ingredientRequest.setName(name);
        ingredientRequest.setSymbol(symbol);
        ingredientRequest.setRequestedBy(user);
        ingredientRequest.setStatus("Pending");

        return ingredientRequestRepository.save(ingredientRequest);
    }

    public IngredientRequest acceptRequest(long idRequest, String adminMessage){
        IngredientRequest ingredientRequest = ingredientRequestRepository.findById(idRequest).orElseThrow();
        ingredientRequest.setStatus("Approved");
        ingredientRequest.setAdminMessage(adminMessage);
        ingredientRequestRepository.save(ingredientRequest);

        Ingredient ingredient = new  Ingredient();
        ingredient.setName(ingredientRequest.getName());
        ingredient.setSymbol(ingredientRequest.getSymbol());
        ingredientRepository.save(ingredient);

        return ingredientRequest;
    }

    public IngredientRequest rejectRequest(long idRequest, String adminMessage){
        IngredientRequest ingredientRequest = ingredientRequestRepository.findById(idRequest).orElseThrow();
        ingredientRequest.setStatus("Rejected");
        ingredientRequest.setAdminMessage(adminMessage);
        ingredientRequestRepository.save(ingredientRequest);

        return ingredientRequest;
    }

    public void deleteRequest(long idRequest) {
        IngredientRequest ingredientRequest = ingredientRequestRepository.findById(idRequest).orElseThrow();
        ingredientRequestRepository.delete(ingredientRequest);

    }

    public List<IngredientRequest> getPendingRequests(){
        return ingredientRequestRepository.findByStatus("Pending");
    }

    public List<IngredientRequest> getRequestedByEmail(String email){
        return ingredientRequestRepository.findByRequestedByEmail(email);
    }

    public List<IngredientRequest> getAllRequested(){
        return ingredientRequestRepository.findAll();
    }
}
