package com.aml.library.test.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.aml.library.Entity.User;
import com.aml.library.dto.LoginRequest;
import com.aml.library.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LogInIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        // Clear existing data
        userRepository.deleteAll();

        // Add a test user
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword(passwordEncoder.encode("password")); // Encode the password
        user.setRole("USER");
        user.setVerified(true);
        userRepository.save(user);
    }

    @Test
    void shouldReturnOkForValidCredentials() throws Exception {
        // Create a valid login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("password");

        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);

        // Perform the POST request and assert the response
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("user@example.com"))
                .andExpect(jsonPath("$.token").isNotEmpty()); // Assuming the token is returned
    }

    @Test
    void shouldReturnBadRequestForInvalidCredentials() throws Exception {
        // Create an invalid login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("wrongpassword");

        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);

        // Perform the POST request and assert the response
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequestJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void shouldReturnBadRequestForNonExistingUser() throws Exception {
        // Create a login request for a non-existing user
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("password");

        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);

        // Perform the POST request and assert the response
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequestJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));;
    }
}