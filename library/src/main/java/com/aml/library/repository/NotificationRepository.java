package com.aml.library.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.aml.library.Entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	
	@Query("SELECT n FROM Notification n WHERE n.transaction.user.id = :userId")
    List<Notification> findByUserOrderBySentAtDesc(@Param("userId")Long userId);

	@Transactional
	@Modifying
	@Query(value = "DELETE FROM notifications WHERE media_circulation_id IN (SELECT id FROM media_circulation WHERE user_id = :userId)", nativeQuery = true)
	void deleteByUserID(@Param("userId")Long id);
	
	@Query("SELECT n FROM Notification n WHERE n.transaction.id = :transactionId")
	List<Notification> findByTransaction(@Param("transactionId")Long transactionId);
	
}
