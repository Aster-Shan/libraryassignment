package com.aml.library.test.unit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.Inventory;
import com.aml.library.Service.InventoryService;
import com.aml.library.Service.MediaCirculationService;
import com.aml.library.dto.InventoryDTO;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.repository.BranchRepository;
import com.aml.library.repository.InventoryRepository;
public class InventoryServiceUnitTest {
     @InjectMocks
    private InventoryService inventoryService;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private BranchRepository branchRepository;

    @Mock
    private MediaCirculationService mediaCirculationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSearchBranchByMedia() {
        Long mediaId = 1L;
        List<Branch> mockBranches = Arrays.asList(new Branch(1L, "Central Library", "123 Main St", "London"));
        when(inventoryRepository.searchBranchByMediaId(mediaId)).thenReturn(mockBranches);
    
        List<Branch> branches = inventoryService.searchBranchByMedia(mediaId);
    
        assertNotNull(branches);
        assertEquals(1, branches.size());
        assertEquals("123 Main St", branches.get(0).getAddress());
    }
    
    

    @Test
    void testSearchByBranch() {
        Long branchId = 1L;
        List<Inventory> mockInventories = Arrays.asList(new Inventory(1L, null, null, "available", 0));
        when(inventoryRepository.searchByBranchId(branchId)).thenReturn(mockInventories);

        List<Inventory> inventories = inventoryService.searchByBranch(branchId);

        assertNotNull(inventories);
        assertEquals(1, inventories.size());
        assertEquals("available", inventories.get(0).getStatus());
    }
    

    @Test
    void testBorrowMedia_mediaUnavailable() {
        Long mediaId = 1L;
        Long branchId = 1L;
        Long userId = 1L;

        when(inventoryRepository.searchByMediaIdAndBranchId(mediaId, branchId)).thenReturn(Arrays.asList());

        ValidationException exception = assertThrows(ValidationException.class, () -> 
            inventoryService.borrowMedia(mediaId, branchId, userId));

        assertEquals("Media Unavailable", exception.getMessage());
    }
    @Test
    void testTransfer_success() {
        Long inventoryId = 1L;
        Long toBranchId = 2L;
    
        // Mock Inventory and Branch objects
        Inventory mockInventory = new Inventory();
        Branch mockToBranch = new Branch(toBranchId, "New Address", "New City", null);
    
        // Mock repository methods
        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(mockInventory));
        when(branchRepository.getById(toBranchId)).thenReturn(mockToBranch);
    
        // Call the method under test
        InventoryDTO response = inventoryService.transfer(inventoryId, toBranchId);
    
        // Assertions
        assertNotNull(response);
        assertEquals("New City", response.getBranch().getAddress()); // Confirm the branch address is updated
        assertEquals(mockInventory.getId(), response.getId()); // Confirm inventory ID is the same
        assertEquals(mockInventory.getStatus(), response.getStatus()); // Ensure the status remains the same
        assertEquals(mockInventory.getRenewalCount(), response.getRenewalCount()); // Ensure renewal count remains the same
    
        // Verify the inventoryRepository.save() method was called to persist the updated inventory
        verify(inventoryRepository).save(mockInventory);
    
        // Optionally, confirm that the branch was updated in the mock inventory
        assertEquals(mockToBranch, mockInventory.getBranch());
    }
    
    @Test
    void testTransfer_inventoryNotFound() {
        Long inventoryId = 1L;
        Long toBranchId = 2L;

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> 
            inventoryService.transfer(inventoryId, toBranchId));

        assertEquals("Inventory not found", exception.getMessage());
    }
    
}
