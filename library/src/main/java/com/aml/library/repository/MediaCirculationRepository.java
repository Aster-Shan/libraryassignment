package com.aml.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aml.library.Entity.MediaCirculation;
import com.aml.library.Entity.User;

@Repository
public interface MediaCirculationRepository extends JpaRepository<MediaCirculation, Long>{
	
	@Query("SELECT m FROM MediaCirculation m WHERE m.user.id = :userId")
	List<MediaCirculation> searchByUserId(@Param("userId")Long userId);

	List<MediaCirculation> findByUser(User user);

}
