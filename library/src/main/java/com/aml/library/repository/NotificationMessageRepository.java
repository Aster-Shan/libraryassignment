package com.aml.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aml.library.Entity.NotificationMessage;

public interface NotificationMessageRepository extends JpaRepository<NotificationMessage, Long>{

}
