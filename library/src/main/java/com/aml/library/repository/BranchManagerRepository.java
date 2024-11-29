package com.aml.library.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aml.library.Entity.BranchManager;

public interface BranchManagerRepository extends JpaRepository<BranchManager, Long> {
   Optional <BranchManager> findByUserId(Long userId);
}

