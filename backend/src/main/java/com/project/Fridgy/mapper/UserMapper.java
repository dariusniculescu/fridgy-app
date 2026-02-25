package com.project.Fridgy.mapper;

import com.project.Fridgy.dto.UserDTO;
import com.project.Fridgy.model.User;

public class UserMapper {

    public static UserDTO userToUserDTO(User user){
        if(user==null){
            return null;
        }
        UserDTO userDTO=new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setName(user.getName());
        userDTO.setPassword(user.getPassword());
        userDTO.setRole(user.getRole());
        userDTO.setRecipes(user.getRecipes());
        userDTO.setFavoriteRecipes(user.getFavoriteRecipes());
        return userDTO;
    }

}
