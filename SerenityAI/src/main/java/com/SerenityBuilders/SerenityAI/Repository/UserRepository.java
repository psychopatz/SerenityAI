package com.SerenityBuilders.SerenityAI.Repository;

import com.SerenityBuilders.SerenityAI.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUsername(String username);
    // No additional methods required for basic CRUD operations
}
