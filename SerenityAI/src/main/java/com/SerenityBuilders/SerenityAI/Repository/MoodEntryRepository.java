package com.SerenityBuilders.SerenityAI.repository;


import com.SerenityBuilders.SerenityAI.entity.MoodEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntryEntity, Integer> {

}
