package com.aml.library.Service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.Media;
import com.aml.library.dto.MediaStats;
import com.aml.library.repository.MediaRepository;
import com.aml.library.repository.UserRepository;


@Service
public class StatisticsService {

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private UserRepository userRepository;

    public MediaStats getMediaStats() {
      long totalMedia = mediaRepository.count();
      
      // Instead of using countByStatus, use a stream to filter and count
      List<Media> allMedia = mediaRepository.findAll();
      long availableMedia = allMedia.stream()
          .filter(media -> "available".equals(media.getStatus()))
          .count();
      
      long borrowedMedia = totalMedia - availableMedia;
  
      MediaStats mediaStats = new MediaStats();
      // Set the stats...
      
      return mediaStats;
  }

   /*  public UserStats getUserStats() {
        //long totalUsers = userRepository.count();
      //  long activeUsers = userRepository.countByStatus("active");

        UserStats userStats = new UserStats();
        userStats.setTotalUsers(totalUsers);
      //  userStats.setActiveUsers(activeUsers);

        return userStats;
    }*/
}
