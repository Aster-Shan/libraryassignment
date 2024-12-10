package com.aml.library.Service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.MediaCirculation;
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
		mediaCirculation.setReutrned(false);
		
		return mediaCirculationRepository.save(mediaCirculation);
	}
}
