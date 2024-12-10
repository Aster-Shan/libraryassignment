package com.aml.library.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aml.library.Entity.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {
}

