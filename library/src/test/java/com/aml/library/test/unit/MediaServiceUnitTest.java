package com.aml.library.test.unit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.aml.library.Entity.Media;
import com.aml.library.Service.MediaService;
import com.aml.library.repository.MediaRepository;

public class MediaServiceUnitTest {

    @InjectMocks
    private MediaService mediaService;

    @Mock
    private MediaRepository mediaRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSearchMedia_success() {
        String searchTerm = "test";
        Media media1 = new Media();
        Media media2 = new Media();
        List<Media> expectedMediaList = Arrays.asList(media1, media2);

        when(mediaRepository.searchMedia(searchTerm)).thenReturn(expectedMediaList);
        List<Media> result = mediaService.searchMedia(searchTerm);

        assertNotNull(result);
        assertEquals(2, result.size()); 
        assertTrue(result.contains(media1)); 
        assertTrue(result.contains(media2)); 
        verify(mediaRepository).searchMedia(searchTerm);
    }

    @Test
    void testSearchMedia_emptyList() {
    
        String searchTerm = "nonexistent";
        List<Media> expectedMediaList = Arrays.asList(); // Empty list for non-existent search term
        when(mediaRepository.searchMedia(searchTerm)).thenReturn(expectedMediaList);

        List<Media> result = mediaService.searchMedia(searchTerm);
        assertNotNull(result);
        assertEquals(0, result.size()); // Ensure no media is returned for a non-existent search term
        verify(mediaRepository).searchMedia(searchTerm);
    }
}
