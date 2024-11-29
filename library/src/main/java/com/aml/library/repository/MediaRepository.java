package com.aml.library.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aml.library.Entity.Media;
import com.aml.library.Entity.User;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByTitleContainingIgnoreCase(String title);
    
    // This method is now explicitly defined
    List<Media> findByUserAndStatus(User user, String status);
    
    List<Media> findByBranchCity(String city);
    long count();
    long countByStatus(String status); 
}

