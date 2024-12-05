/*package com.aml.library.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aml.library.Service.StatisticsService;
import com.aml.library.dto.MediaStats;
import com.aml.library.dto.UserStats;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/media")
    public ResponseEntity<MediaStats> getMediaStats() {
        MediaStats mediaStats = statisticsService.getMediaStats();
        return ResponseEntity.ok(mediaStats);
    }

    @GetMapping("/users")
    public ResponseEntity<UserStats> getUserStats() {
        UserStats userStats = statisticsService.getUserStats();
        return ResponseEntity.ok(userStats);
    }
}
*/