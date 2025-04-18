package com.aml.library.test.integration;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.aml.library.Entity.Branch;
import com.aml.library.Entity.Inventory;
import com.aml.library.Entity.Media;
import com.aml.library.repository.BranchRepository;
import com.aml.library.repository.InventoryRepository;
import com.aml.library.repository.MediaRepository;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MediaTransferIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private MediaRepository mediaRepository;

    @BeforeEach
    public void setUp() {
        // Clear repositories before each test
        inventoryRepository.deleteAll();
        branchRepository.deleteAll();
        mediaRepository.deleteAll();

        // Create and save test data
        Branch branch1 = new Branch();
        branch1.setName("Main Branch");
        branch1.setAddress("123 Main Street");
        branch1.setCity("Springfield");
        branchRepository.save(branch1);

        Branch branch2 = new Branch();
        branch2.setName("Secondary Branch");
        branch2.setAddress("456 Secondary Street");
        branch2.setCity("Shelbyville");
        branchRepository.save(branch2);

        Media media = new Media();
        media.setTitle("The Great Gatsby");
        media.setAuthor("F. Scott Fitzgerald");
        media.setGenre("Fiction");
        media.setFormat("Hardcover");
        media.setDescription("A classic novel of the Jazz Age.");
        media.setPublicationYear(1925);
        mediaRepository.save(media);

        Inventory inventory = new Inventory();
        inventory.setMedia(media);
        inventory.setBranch(branch1);
        inventory.setStatus("available");
        inventory.setRenewalCount(0);
        inventoryRepository.save(inventory);
    }

    @AfterEach
    public void tearDown() {
        inventoryRepository.deleteAll();
        branchRepository.deleteAll();
        mediaRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "branch_manager", roles = {"BRANCH_MANAGER"})
    void shouldTransferInventorySuccessfully() throws Exception {
        Inventory inventory = inventoryRepository.findAll().get(0);
        Branch newBranch = branchRepository.findAll().stream()
            .filter(branch -> !branch.getId().equals(inventory.getBranch().getId()))
            .findFirst()
            .orElseThrow();

        mockMvc.perform(post("/api/inventory/transfer")
                .param("inventoryId", inventory.getId().toString())
                .param("toBranchId", newBranch.getId().toString())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(inventory.getId()))
            .andExpect(jsonPath("$.branch.id").value(newBranch.getId()))
            .andExpect(jsonPath("$.status").value("available"))
            .andExpect(jsonPath("$.renewalCount").value(0));
    }

    @Test
    @WithMockUser(username = "branch_manager", roles = {"BRANCH_MANAGER"})
    void shouldReturnBadRequestWhenInventoryIdIsMissing() throws Exception {
        Branch newBranch = branchRepository.findAll().get(0);

        mockMvc.perform(post("/api/inventory/transfer")
                .param("toBranchId", newBranch.getId().toString())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "branch_manager", roles = {"BRANCH_MANAGER"})
    void shouldReturnBadRequestWhenToBranchIdIsMissing() throws Exception {
        Inventory inventory = inventoryRepository.findAll().get(0);

        mockMvc.perform(post("/api/inventory/transfer")
                .param("inventoryId", inventory.getId().toString())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "branch_manager", roles = {"BRANCH_MANAGER"})
    void shouldReturnNotFoundForInvalidInventoryId() throws Exception {
        Long invalidInventoryId = 999L; 
        Branch newBranch = branchRepository.findAll().get(0);

        mockMvc.perform(post("/api/inventory/transfer")
                .param("inventoryId", invalidInventoryId.toString())
                .param("toBranchId", newBranch.getId().toString())
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());
    }
}

