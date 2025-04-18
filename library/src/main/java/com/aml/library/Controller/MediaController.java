package com.aml.library.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.Media;
import com.aml.library.Entity.User;
import com.aml.library.Service.MediaService;
import com.aml.library.Service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/media")
public class MediaController {
    @Autowired
    private MediaService mediaService;

    @GetMapping("/all")
    public ResponseEntity<List<Media>> getAllMedia() {
        List<Media> mediaList = mediaService.findAllMedia();
        return ResponseEntity.ok(mediaList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Media>> searchMedia(@RequestParam String searchTerm) {
        return ResponseEntity.ok(mediaService.searchMedia(searchTerm));
    }

//    @PostMapping("/borrow/{mediaId}")
//    public ResponseEntity<Media> borrowMedia(@PathVariable Long mediaId, Authentication authentication) {
//        User user = userService.getUserByEmail(authentication.getName());
//        return ResponseEntity.ok(mediaService.borrowMedia(mediaId, user));
//    }
//
//    @PostMapping("/return/{mediaId}")
//    public ResponseEntity<Media> returnMedia(@PathVariable Long mediaId) {
//        return ResponseEntity.ok(mediaService.returnMedia(mediaId));
//    }
//
//    @GetMapping("/borrowed")
//    public ResponseEntity<List<Media>> getBorrowedMedia(Authentication authentication) {
//        User user = userService.getUserByEmail(authentication.getName());
//        return ResponseEntity.ok(mediaService.getBorrowedMedia(user));
//    }
}

