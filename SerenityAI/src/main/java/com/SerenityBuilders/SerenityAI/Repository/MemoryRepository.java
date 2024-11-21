package com.SerenityBuilders.SerenityAI.Repository;

import com.SerenityBuilders.SerenityAI.Entity.Memory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, Integer> {}
