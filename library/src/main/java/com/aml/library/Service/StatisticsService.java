package com.aml.library.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        long availableMedia = mediaRepository.countByStatus("available");
        long borrowedMedia = totalMedia - availableMedia;  // Assuming two statuses: available and borrowed

        MediaStats mediaStats = new MediaStats();
//        mediaStats.setTotalMedia(totalMedia);
//        mediaStats.setAvailableMedia(availableMedia);
//        mediaStats.setBorrowedMedia(borrowedMedia);

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
