package com.aml.library.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.Inventory;



public interface InventoryRepository extends JpaRepository<Inventory, Long>{
	@Query("SELECT DISTINCT i.branch FROM Inventory i WHERE i.media.id = :mediaId AND i.status = 'available'")
     List<Branch> searchBranchByMediaId(@Param("mediaId") Long mediaId);
	
	@Query("SELECT i FROM Inventory i WHERE i.media.id = :mediaId AND i.branch.id = :branchId AND i.status = 'available'")
    List<Inventory> searchByMediaIdAndBranchId(@Param("mediaId") Long mediaId,@Param("branchId") Long branchId);
}
