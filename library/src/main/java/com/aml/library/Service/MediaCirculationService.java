package com.aml.library.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.Inventory;
import com.aml.library.Entity.MediaCirculation;
import com.aml.library.exception.MediaNotEligibleForRenewalException;
import com.aml.library.repository.InventoryRepository;
import com.aml.library.repository.MediaCirculationRepository;
import com.aml.library.repository.UserRepository;

@Service
public class MediaCirculationService {
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private InventoryRepository inventoryRepository;
	@Autowired
	private MediaCirculationRepository mediaCirculationRepository;

	public MediaCirculation insertTransaction(Long inventoryId, Long userId) {
		
		MediaCirculation mediaCirculation = new MediaCirculation();
		LocalDate now = LocalDate.now();
		
		mediaCirculation.setUser(userRepository.getById(userId));
		mediaCirculation.setInventory(inventoryRepository.getById(inventoryId));
		mediaCirculation.setBorrowDate(LocalDate.now());
		mediaCirculation.setDueDate(now.plusWeeks(2));
		mediaCirculation.setReturned(false);
		
		return mediaCirculationRepository.save(mediaCirculation);
	}

	public List<MediaCirculation> searchBorrowedMedia(Long userId) {
		return mediaCirculationRepository.searchByUserId(userId);
	}

	public MediaCirculation renewBorrowedMedia(Long mediaCirculationId) {
		MediaCirculation mc = mediaCirculationRepository.getById(mediaCirculationId);
		
		try {
	        mc.renew();
	    } catch (MediaNotEligibleForRenewalException e) {
	        throw e; // Re-throw the exception to be caught in the controller
	    } catch (IllegalStateException e) {
	        e.printStackTrace();
	        throw new MediaNotEligibleForRenewalException("Media is not eligible for renewal. Maximun renewals reached.");
	    }
		
		mediaCirculationRepository.save(mc);
		return mc;
		
	}

	public List<MediaCirculation> searchAll() {
		return mediaCirculationRepository.findAll();
	}

	public void returnMedia(Long mediaCirculationId) {
		MediaCirculation mediaCirculation = mediaCirculationRepository.getById(mediaCirculationId);
		Inventory inventory = inventoryRepository.getById(mediaCirculation.getInventory().getId());
		
		inventory.setStatus("available");
		inventory.setRenewalCount(0);
		mediaCirculation.setReturnDate(LocalDate.now());
		mediaCirculation.setReturned(true);
		
		inventoryRepository.save(inventory);
		mediaCirculationRepository.save(mediaCirculation);
	}
}
