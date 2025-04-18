package com.aml.library.test.integration;

import com.aml.library.Entity.User;
import com.aml.library.Service.EmailService;
import com.aml.library.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RegisterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private EmailService emailService; // Mock the email service to avoid sending real emails

    @BeforeEach
    void setup() {
        // Clear all users in the repository
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterUserSuccessfully() throws Exception {
        // Create a new user
        User user = new User();
        user.setEmail("newuser@example.com");
        user.setPassword("password123");
        user.setName("New User");

        String userJson = objectMapper.writeValueAsString(user);

        // Mock the email service
        Mockito.doNothing().when(emailService).sendVerificationEmail(Mockito.any(User.class));

        // Perform the POST request
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.verified").value(false));

        // Verify that the user is saved in the database
        User savedUser = userRepository.findByEmail("newuser@example.com").orElseThrow();
        assert passwordEncoder.matches("password123", savedUser.getPassword());
        assert !savedUser.isVerified(); // Default value
    }

    @Test
    void shouldFailWhenEmailIsMissing() throws Exception {
        // Create a user with missing email
        User user = new User();
        user.setPassword("password123");
        user.setName("User Without Email");

        String userJson = objectMapper.writeValueAsString(user);

        // Perform the POST request
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email is required"));
    }

    @Test
    void shouldFailWhenPasswordIsMissing() throws Exception {
        // Create a user with missing password
        User user = new User();
        user.setEmail("userwithoutpassword@example.com");
        user.setName("User Without Password");

        String userJson = objectMapper.writeValueAsString(user);

        // Perform the POST request
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Password is required"));
    }

    @Test
    void shouldFailWhenEmailAlreadyExists() throws Exception {
        // Insert an existing user
        User existingUser = new User();
        existingUser.setEmail("duplicate@example.com");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(existingUser);

        // Try to register with the same email
        User newUser = new User();
        newUser.setEmail("duplicate@example.com");
        newUser.setPassword("newpassword");
        newUser.setName("Duplicate User");

        String userJson = objectMapper.writeValueAsString(newUser);

        // Perform the POST request
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already exists"));
    }

    @Test
    void shouldHandleUnexpectedErrorsGracefully() throws Exception {
        // Create a user
        User user = new User();
        user.setEmail("erroruser@example.com");
        user.setPassword("password123");
        user.setName("Error User");

        String userJson = objectMapper.writeValueAsString(user);

        // Mock the UserRepository to throw an exception
        Mockito.doThrow(new RuntimeException("Database error"))
                .when(emailService).sendVerificationEmail(Mockito.any(User.class));

        // Perform the POST request
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("An unexpected error occurred during registration: Database error"));
    }
}