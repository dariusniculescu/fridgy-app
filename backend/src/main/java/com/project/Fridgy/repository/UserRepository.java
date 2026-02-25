package com.project.Fridgy.repository;

import com.project.Fridgy.model.Role;
import com.project.Fridgy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByName(String name);

    long countByRole(Role role);


    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

}
