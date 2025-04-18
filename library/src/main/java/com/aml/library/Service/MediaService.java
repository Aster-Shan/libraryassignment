package com.aml.library.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.Media;
import com.aml.library.Entity.User;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.repository.MediaRepository;

@Service
public class MediaService {
    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private NotificationService notificationService;
    
	public List<Media> findAllMedia() {
		return mediaRepository.findAll();
	}   

    public List<Media> searchMedia(String searchTerm) {
        return mediaRepository.searchMedia(searchTerm);
    }
//    public Media borrowMedia(Long mediaId, User user) {
//        Media media = mediaRepository.findById(mediaId)
//            .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
//        if (!"available".equals(media.getStatus())) {
//            throw new ValidationException("Media is not available for borrowing");
//        }
//        media.setStatus("borrowed");
//        media.setUser(user);
//        Media updatedMedia = mediaRepository.save(media);
//        String subject = "Media Borrowed Successfully";
//        String message = "You have successfully borrowed the media: " + media.getTitle() + ".";
//        notificationService.sendNotification(user, subject, message);
//
//        return updatedMedia;
//    }
//
//    public Media returnMedia(Long mediaId) {
//        Media media = mediaRepository.findById(mediaId)
//            .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
//        media.setStatus("available");
//        media.setUser(null);
//        return mediaRepository.save(media);
//    }
//
//    public List<Media> getBorrowedMedia(User user) {
//        return mediaRepository.findByUserAndStatus(user, "borrowed");
//    }
//
//    public Media renewMedia(Long mediaId, User user) {
//        Media media = mediaRepository.findById(mediaId)
//            .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
//        
//        if (!media.getUser().equals(user)) {
//            throw new ValidationException("You can only renew media you have borrowed");
//        }
//
//        if (!media.isEligibleForRenewal()) {
//            throw new ValidationException("This media is not eligible for renewal");
//        }
//
//        media.renew();
//        Media updatedMedia = mediaRepository.save(media);
//        notificationService.sendNotification(user, "Media Renewed", 
//            "Your borrowed media '" + media.getTitle() + "' has been renewed. New due date: " + media.getDueDate());
//        
//        return updatedMedia;
//    }

}


