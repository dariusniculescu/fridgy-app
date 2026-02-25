package com.project.Fridgy.controller;

import com.project.Fridgy.dto.IngredientRequestDTO;
import com.project.Fridgy.model.IngredientRequest;
import com.project.Fridgy.model.User;
import com.project.Fridgy.service.IngredientRequestService;
import com.project.Fridgy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingredient-request")
public class IngredientRequestController {

    @Autowired
    private IngredientRequestService ingredientRequestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public IngredientRequest create(@RequestBody IngredientRequestDTO dto) {
        User user = userService.getUserByEmail(dto.getEmail())
                .orElseThrow();

        return ingredientRequestService.createRequest(
                dto.getName(),
                dto.getSymbol(),
                user
        );
    }

    @GetMapping("/pending")
    public List<IngredientRequest> getPendingRequests() {
        return ingredientRequestService.getPendingRequests();
    }

    @PostMapping("/{id}/approve")
    public IngredientRequest approve(@PathVariable Long id, @RequestBody(required = false) String adminMessage) {
        return ingredientRequestService.acceptRequest(id, adminMessage);
    }

    @PostMapping("/{id}/reject")
    public IngredientRequest reject(@PathVariable Long id,  @RequestBody(required = false) String adminMessage) {
        return ingredientRequestService.rejectRequest(id, adminMessage);
    }

    @GetMapping("/my")
    public List<IngredientRequest> getMyRequests(@RequestParam String email){
        return ingredientRequestService.getRequestedByEmail(email);
    }

    @GetMapping("/all")
    public List<IngredientRequest> getAllRequests(){
        return ingredientRequestService.getAllRequested();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ingredientRequestService.deleteRequest(id);
    }
}
