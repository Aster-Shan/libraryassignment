package com.aml.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aml.library.Entity.MediaCirculation;

@Repository
public interface MediaCirculationRepository extends JpaRepository<MediaCirculation, Long>{

}
