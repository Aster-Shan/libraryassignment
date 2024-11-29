package com.aml.library.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.BranchManager;
import com.aml.library.Entity.Media;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.repository.BranchManagerRepository;
import com.aml.library.repository.BranchRepository;
import com.aml.library.repository.MediaRepository;

@Service
public class BranchManagerService {

    @Autowired
    private BranchManagerRepository branchManagerRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private MediaRepository mediaRepository;

    public List<Media> getInventoryForCity(Long managerId) {
        BranchManager manager = branchManagerRepository.findById(managerId)
            .orElseThrow(() -> new ResourceNotFoundException("Branch manager not found"));
        return mediaRepository.findByBranchCity(manager.getBranch().getCity());
    }

    public Media transferMedia(Long mediaId, Long fromBranchId, Long toBranchId) {
        Media media = mediaRepository.findById(mediaId)
            .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
        Branch fromBranch = branchRepository.findById(fromBranchId)
            .orElseThrow(() -> new ResourceNotFoundException("From branch not found"));
        Branch toBranch = branchRepository.findById(toBranchId)
            .orElseThrow(() -> new ResourceNotFoundException("To branch not found"));

        if (!media.getBranch().equals(fromBranch)) {
            throw new ValidationException("Media is not in the specified from branch");
        }

        media.setBranch(toBranch);
        return mediaRepository.save(media);
    }

    public BranchManager getBranchManagerByUserId(Long userId) {
        Optional<BranchManager> branchManager = branchManagerRepository.findByUserId(userId);
        if (branchManager.isPresent()) {
            return branchManager.get();
        } else {
            throw new ResourceNotFoundException("Branch manager not found for user");
        }
    }

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public Branch getBranchById(Long branchId) {
        return branchRepository.findById(branchId)
            .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
    }
}

