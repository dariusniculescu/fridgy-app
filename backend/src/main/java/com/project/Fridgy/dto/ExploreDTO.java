package com.project.Fridgy.dto;

import java.util.List;

public class ExploreDTO {

    private Long id;
    private String title;
    private String description;

    public void setId(Long id) {
        this.id = id;
    }

    private String authorName;
    private List<String> ingredients;


    public Long getId(){
        return id;
    }
    public void setId(long id){
        this.id = id;
    }

    public String getTitle() {
        return title;
    }


    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }
}
