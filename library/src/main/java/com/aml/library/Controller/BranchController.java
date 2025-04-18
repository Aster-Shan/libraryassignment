package com.aml.library.Controller;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aml.library.Entity.Branch;
import com.aml.library.Service.BranchService;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "http://localhost:3000")
public class BranchController {

    @Autowired
    private BranchService branchService;
    
    @GetMapping("/all")
    public ResponseEntity<List<Branch>> getAllBranches() {
        List<Branch> branches = branchService.getAllBranches();
        return ResponseEntity.ok(branches);
    }
    
    @GetMapping("/branches-by-id")
    public ResponseEntity<Optional<Branch>> getBranchesById(@RequestParam Long id) {
        Optional<Branch> branch = branchService.getBranchById(id);
        return ResponseEntity.ok(branch);
    }
}
