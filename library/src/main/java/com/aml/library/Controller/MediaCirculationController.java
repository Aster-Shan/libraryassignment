package com.aml.library.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aml.library.Entity.MediaCirculation;
import com.aml.library.Error.BorrowMediaError;
import com.aml.library.Service.MediaCirculationService;
import com.aml.library.dto.BorrowedMedia;
import com.aml.library.exception.MediaNotEligibleForRenewalException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/media-circulation")
public class MediaCirculationController {

	@Autowired
	private MediaCirculationService mediaCirculationService;

	@GetMapping("/search")
	public ResponseEntity<List<BorrowedMedia>> searchByUserId(@RequestParam Long userId) {

		List<MediaCirculation> circulationList = mediaCirculationService.searchBorrowedMedia(userId);

		List<BorrowedMedia> borrowedMediaList = circulationList.stream().map(mediaCirculation -> {
			BorrowedMedia borrowedMedia = new BorrowedMedia();
			borrowedMedia.setId(mediaCirculation.getId());
			borrowedMedia.setTitle(mediaCirculation.getInventory().getMedia().getTitle());
			borrowedMedia.setAuthor(mediaCirculation.getInventory().getMedia().getAuthor());

			borrowedMedia.setBorrowDate(mediaCirculation.getBorrowDate());
			borrowedMedia.setDueDate(mediaCirculation.getDueDate());
			
			borrowedMedia.setReturned(mediaCirculation.isReturned());
			borrowedMedia.setReturnDate(mediaCirculation.getReturnDate());

			borrowedMedia.setBranchName(mediaCirculation.getInventory().getBranch().getName());
			String address = mediaCirculation.getInventory().getBranch().getAddress();
			String city = mediaCirculation.getInventory().getBranch().getCity();
			String fullAddress = address.concat(", ").concat(city);
			borrowedMedia.setBranchFullAddress(fullAddress);

			borrowedMedia.setRenewalCount(mediaCirculation.getInventory().getRenewalCount());

			return borrowedMedia;
		}).collect(Collectors.toList());

		return ResponseEntity.ok(borrowedMediaList);
	}

	@PostMapping("/renew")
    public ResponseEntity<?> renewMedia(@RequestParam Long mediaCirculationId) {
        try {
            MediaCirculation mediaCirculation = mediaCirculationService.renewBorrowedMedia(mediaCirculationId);

            BorrowedMedia borrowedMedia = new BorrowedMedia();
            borrowedMedia.setId(mediaCirculation.getId());
            borrowedMedia.setTitle(mediaCirculation.getInventory().getMedia().getTitle());
            borrowedMedia.setAuthor(mediaCirculation.getInventory().getMedia().getAuthor());
            borrowedMedia.setBorrowDate(mediaCirculation.getBorrowDate());
            borrowedMedia.setDueDate(mediaCirculation.getDueDate());

            borrowedMedia.setBranchName(mediaCirculation.getInventory().getBranch().getName());

            String address = mediaCirculation.getInventory().getBranch().getAddress();
            String city = mediaCirculation.getInventory().getBranch().getCity();
            String fullAddress = address.concat(", ").concat(city);
            borrowedMedia.setBranchFullAddress(fullAddress);

            borrowedMedia.setRenewalCount(mediaCirculation.getInventory().getRenewalCount());

            return ResponseEntity.ok(borrowedMedia);

        } catch (MediaNotEligibleForRenewalException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BorrowMediaError(e.getMessage()));
        }
    }
	
	@GetMapping("/all")
	public ResponseEntity<List<MediaCirculation>> getAllMediaCirculation(){
		List<MediaCirculation> mediaCirculationList = mediaCirculationService.searchAll();
		return ResponseEntity.ok(mediaCirculationList);
	}
	
	@PostMapping("/return")
	public ResponseEntity<?> returnMedia(@RequestParam Long mediaCirculationId){
		mediaCirculationService.returnMedia(mediaCirculationId);
		return ResponseEntity.ok(HttpStatus.OK);
	}
	
    @ExceptionHandler(MediaNotEligibleForRenewalException.class)
    public ResponseEntity<BorrowMediaError> handleMediaNotEligibleForRenewalException(MediaNotEligibleForRenewalException e) {
    	BorrowMediaError error = new BorrowMediaError(e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
