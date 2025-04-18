package com.aml.library.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aml.library.Entity.Media;
import com.aml.library.Service.BranchManagerService;

@RestController
@RequestMapping("/api/branch-manager")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('BRANCH_MANAGER')")
public class BranchManagerController {

    @Autowired
    private BranchManagerService branchManagerService;

    @GetMapping("/inventory")
    public ResponseEntity<List<Media>> getInventoryForCity(@RequestParam Long managerId) {
        return ResponseEntity.ok(branchManagerService.getInventoryForCity(managerId));
    }

//    @PostMapping("/transfer")
//    public ResponseEntity<Media> transferMedia(@RequestParam Long mediaId,
//                                               @RequestParam Long fromBranchId,
//                                               @RequestParam Long toBranchId) {
//        return ResponseEntity.ok(branchManagerService.transferMedia(mediaId, fromBranchId, toBranchId));
//    }
    
}

