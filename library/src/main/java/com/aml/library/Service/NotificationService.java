package com.aml.library.Service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.Notification;
import com.aml.library.Entity.User;
import com.aml.library.repository.NotificationRepository;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    public void sendNotification(User user, String subject, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
        emailService.sendNotification(user, subject, message);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderBySentAtDesc(user);
    }
}


