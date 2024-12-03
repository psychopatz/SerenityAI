package com.SerenityBuilders.SerenityAI.Repository;

import com.SerenityBuilders.SerenityAI.Entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
}