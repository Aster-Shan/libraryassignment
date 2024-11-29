package com.aml.library.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aml.library.Entity.Notification;
import com.aml.library.Entity.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderBySentAtDesc(User user);
}
