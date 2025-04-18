package com.aml.library.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.Inventory;
import com.aml.library.Service.InventoryService;
import com.aml.library.dto.BorrowResponse;
import com.aml.library.dto.InventoryDTO;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/inventory")
public class InventoryController {
//	@GetMapping("/all")
//    public ResponseEntity<List<Media>> getAllMedia() {
//        List<Media> mediaList = mediaService.findAllMedia();
//        return ResponseEntity.ok(mediaList);
//    }
	@Autowired
	private InventoryService inventoryService;

	@GetMapping("/search-branches")
	public ResponseEntity<List<Branch>> searchBranches(@RequestParam Long mediaId) {
		return ResponseEntity.ok(inventoryService.searchBranchByMedia(mediaId));
	}

	@GetMapping("/by-branch-id")
	public ResponseEntity<List<Inventory>> searchByBranchId(@RequestParam Long branchId) {
		return ResponseEntity.ok(inventoryService.searchByBranch(branchId));
	}

	@PostMapping("/borrow")
	public ResponseEntity<?> borrow(@RequestParam Long mediaId, @RequestParam Long branchId,
			@RequestParam Long userId) {

		BorrowResponse borrowResponse;

		try {
			borrowResponse = inventoryService.borrowMedia(mediaId, branchId, userId);
		} catch (ValidationException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An unexpected error in transaction" + e.getMessage());
		}

		return ResponseEntity.ok(borrowResponse);
	}

	@PostMapping("/transfer")
	public ResponseEntity<?> transfer(@RequestParam Long inventoryId, @RequestParam Long toBranchId) {
		try {
			InventoryDTO inventoryDTO = inventoryService.transfer(inventoryId, toBranchId);
			return ResponseEntity.ok(inventoryDTO);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("error", "Inventory Not Found", "message", e.getMessage()));
		}
	}
}
