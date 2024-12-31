package com.aml.library.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.MediaCirculation;
import com.aml.library.Entity.Notification;
import com.aml.library.Entity.User;
import com.aml.library.repository.MediaCirculationRepository;
import com.aml.library.repository.NotificationMessageRepository;
import com.aml.library.repository.NotificationRepository;

@Service
public class NotificationService {
	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private MediaCirculationRepository medCirculationRepository;

	@Autowired
	private NotificationMessageRepository messageRepository;

	@Autowired
	private EmailService emailService;

	public void sendNotification(User user, String subject, String message) {
		Notification notification = new Notification();
		// notification.setUser(user);
		// notification.setMessage(message);
		notification.setSentAt(LocalDateTime.now());
		notificationRepository.save(notification);
		emailService.sendNotification(user, subject, message);
	}

	public List<Notification> getUserNotifications(User user) {
		return notificationRepository.findByUserOrderBySentAtDesc(user.getId());
	}

	public void generateNotification(User user) {

        //notificationRepository.deleteByUserID(user.getId());

        List<MediaCirculation> mediaCirculationList = medCirculationRepository.findByUser(user);

        mediaCirculationList.forEach(mediaCirculation -> {
            if (shouldGenerateNotification(mediaCirculation)) {
                createNotification(mediaCirculation);
            }
        });
    }

    private boolean shouldGenerateNotification(MediaCirculation mediaCirculation) {
        return !mediaCirculation.isReturned() &&
               notificationRepository.findByTransaction(mediaCirculation.getId()).isEmpty() &&
               (isOverdue(mediaCirculation) || isDueSoon(mediaCirculation));
    }

    private boolean isOverdue(MediaCirculation mediaCirculation) {
        return mediaCirculation.getDueDate().isBefore(LocalDate.now());
    }


    private boolean isDueSoon(MediaCirculation mediaCirculation) {
        return mediaCirculation.getDueDate().isBefore(LocalDate.now().plusDays(1));
    }

    private void createNotification(MediaCirculation mediaCirculation) {
        Notification notification = new Notification();
        notification.setTransaction(mediaCirculation);
        notification.setSentAt(LocalDateTime.now());


        if (isOverdue(mediaCirculation)) {
            notification.setMessage(messageRepository.getById(1L)); 
        } else if (isDueSoon(mediaCirculation)) {
            notification.setMessage(messageRepository.getById(2L)); 
        }

        notificationRepository.save(notification);
    }
    
    public void reconcileNotifications(User user) {
        List<MediaCirculation> mediaCirculationList = medCirculationRepository.findByUser(user);

        mediaCirculationList.forEach(mediaCirculation -> {
            if (mediaCirculation.isReturned()) {
                List<Notification> notifications = notificationRepository.findByTransaction(mediaCirculation.getId());
                if (!notifications.isEmpty()) {
                    notificationRepository.delete(notifications.get(0)); 
                }
            } else if (mediaCirculation.getDueDate().isAfter(LocalDate.now().plusDays(1))) {
                List<Notification> notifications = notificationRepository.findByTransaction(mediaCirculation.getId());
                if (!notifications.isEmpty()) {
                	notificationRepository.delete(notifications.get(0)); 
                }
            }
        });
    }

}
