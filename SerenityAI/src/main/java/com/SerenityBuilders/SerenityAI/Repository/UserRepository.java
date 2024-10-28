package com.SerenityBuilders.SerenityAI.repository;

import com.SerenityBuilders.SerenityAI.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
}
