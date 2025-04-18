package com.aml.library.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.Inventory;
import com.aml.library.Entity.MediaCirculation;
import com.aml.library.dto.BorrowResponse;
import com.aml.library.dto.BranchDTO;
import com.aml.library.dto.InventoryDTO;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.repository.BranchRepository;
import com.aml.library.repository.InventoryRepository;

@Service
public class InventoryService {
	@Autowired
	private InventoryRepository inventoryRepository;
	@Autowired
	private BranchRepository branchRepository;
	
	@Autowired
	private MediaCirculationService mediaCirculationService;
	
	public List<Branch> searchBranchByMedia(Long mediaId){
		return inventoryRepository.searchBranchByMediaId(mediaId);
	}
	
	public List<Inventory> searchByBranch(Long branchId) {
		return inventoryRepository.searchByBranchId(branchId);
	}

	public BorrowResponse borrowMedia(Long mediaId, Long branchId, Long userId) {
		List<Inventory> inventoryList = inventoryRepository.searchByMediaIdAndBranchId(mediaId, branchId);
		
		if(inventoryList.isEmpty()) throw new ValidationException("Media Unavailable");
		
		Inventory firstAvailableInventory = inventoryList.get(0);
		
		firstAvailableInventory.setStatus("borrowed");
		
		MediaCirculation mediaCirculation = mediaCirculationService.insertTransaction(firstAvailableInventory.getId(), userId);
		
		BorrowResponse borrowResponse = new BorrowResponse();
		
		borrowResponse.setTitle(mediaCirculation.getInventory().getMedia().getTitle());
		borrowResponse.setAuthor(mediaCirculation.getInventory().getMedia().getAuthor());
		
		borrowResponse.setBorrowDate(mediaCirculation.getBorrowDate());
		borrowResponse.setDueDate(mediaCirculation.getDueDate());
		
		String address = mediaCirculation.getInventory().getBranch().getAddress();
		String city = mediaCirculation.getInventory().getBranch().getCity();
		String pickUp = address.concat(", ").concat(city);
		borrowResponse.setPickup(pickUp);
		
		borrowResponse.setRenewal_count(mediaCirculation.getInventory().getRenewalCount());

		return borrowResponse;
		
	}

	public InventoryDTO transfer(Long inventoryId, Long toBranchId) {
		
		Inventory inventory = inventoryRepository.findById(inventoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
		
		Branch toBranch = branchRepository.getById(toBranchId);
		
		inventory.setBranch(toBranch);
		
		inventoryRepository.save(inventory);
		
		Branch branch = inventory.getBranch();
		BranchDTO branchDTO = new BranchDTO();
		
		branchDTO.setId(branch.getId());
		branchDTO.setAddress(branch.getAddress());
		branchDTO.setCity(branch.getCity());
		
		InventoryDTO inventoryDTO = new InventoryDTO(inventory.getId(),
				inventory.getMedia(), 
				branchDTO, 
				inventory.getStatus(), 
				inventory.getRenewalCount());
		
		return inventoryDTO;
	}

	
	
	
}
