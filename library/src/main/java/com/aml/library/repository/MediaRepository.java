package com.aml.library.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aml.library.Entity.Media;
import com.aml.library.Entity.User;

public interface MediaRepository extends JpaRepository<Media, Long> {
	
	//List<Media> findAll();
	
    List<Media> findByTitleContainingIgnoreCase(String title);
    
    @Query("SELECT m FROM Media m WHERE " +
            "(m.title LIKE %:searchTerm% OR " +
            "m.author LIKE %:searchTerm% OR " +
            "m.genre LIKE %:searchTerm%)")
     List<Media> searchMedia(@Param("searchTerm") String searchTerm);
    
    // This method is now explicitly defined
//    List<Media> findByUserAndStatus(User user, String status);
    
//    List<Media> findByBranchCity(String city);
//    long count();
//    long countByStatus(String status); 
}

