package com.project.Fridgy.dto;

import lombok.Data;

@Data
public class IngredientRequestDTO {
    private String name;
    private String symbol;
    private String email;

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
