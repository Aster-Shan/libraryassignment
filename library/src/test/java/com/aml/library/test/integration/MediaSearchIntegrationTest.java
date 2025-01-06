package com.aml.library.test.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.aml.library.Entity.Media;
import com.aml.library.repository.MediaRepository;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MediaSearchIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MediaRepository mediaRepository;

    @BeforeEach
    void setup() {
        // Clear all media from the repository before each test
        mediaRepository.deleteAll();

        // Pre-load some media for testing
        Media media1 = new Media();
        media1.setTitle("Java Programming");
        media1.setAuthor("John Doe");
        media1.setGenre("Technology");

        Media media2 = new Media();
        media2.setTitle("Spring Framework");
        media2.setAuthor("Jane Smith");
        media2.setGenre("Technology");

        mediaRepository.saveAll(Arrays.asList(media1, media2));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void shouldReturnAllMediaSuccessfully() throws Exception {
        // Perform the GET request to /all
        mockMvc.perform(get("/api/media/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2)) // Expect 2 items in the response
                .andExpect(jsonPath("$[0].title").value("Java Programming"))
                .andExpect(jsonPath("$[1].title").value("Spring Framework"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void shouldSearchMediaSuccessfully() throws Exception {
        // Perform the GET request to /search with a searchTerm
        mockMvc.perform(get("/api/media/search")
                .param("searchTerm", "Spring")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1)) // Expect 1 item in the response
                .andExpect(jsonPath("$[0].title").value("Spring Framework"));
    }

    @Test
    void shouldFailWhenUnauthenticatedForGetAllMedia() throws Exception {
        // Perform the GET request to /all without authentication
        mockMvc.perform(get("/api/media/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldFailWhenUnauthenticatedForSearchMedia() throws Exception {
        // Perform the GET request to /search without authentication
        mockMvc.perform(get("/api/media/search")
                .param("searchTerm", "Java")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
