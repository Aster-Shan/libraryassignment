package com.aml.library.test.unit;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.aml.library.Entity.User;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.dto.LoginResponse;
import com.aml.library.repository.UserRepository;
import com.aml.library.Service.UserService;
import com.aml.library.Config.security.TokenProvider;
import com.aml.library.Service.EmailService;
import com.aml.library.Service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

public class UserServiceUnitTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private EmailService emailService;
    @Mock private TokenProvider tokenProvider;
    @Mock private NotificationService notificationService;

    @InjectMocks private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUserSuccess() {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        
        // Mock repository behavior
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // Act
        User result = userService.registerUser(user);

        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testRegisterUserEmailAlreadyExists() {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        
        // Mock repository behavior
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> {
            userService.registerUser(user);
        });
        assertEquals("Email already exists", exception.getMessage());
    }

    @Test
    public void testLoginSuccess() {
        // Arrange
        String email = "test@example.com";
        String password = "password";
        User user = new User();
        user.setEmail(email);
        user.setPassword("encodedPassword");
        user.setRole("USER");
        user.setVerified(true);
        
        // Mock repository and password encoder behavior
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);
        when(tokenProvider.createToken(user.getEmail(), user.getRole())).thenReturn("mockToken");

        // Act
        LoginResponse response = userService.login(email, password);

        // Assert
        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    public void testLoginInvalidCredentials() {
        // Arrange
        String email = "invalid@example.com";
        String password = "password";
        
        // Mock repository behavior
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        ValidationException exception = assertThrows(ValidationException.class, () -> {
            userService.login(email, password);
        });
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    public void testGetUserByEmailNotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        
        // Mock repository behavior
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserByEmail(email);
        });
        assertEquals("User not found with email: " + email, exception.getMessage());
    }

    @Test
    public void testVerifyUser() {
        // Arrange
        String token = "validToken";
        User user = new User();
        user.setVerificationToken(token);
        
        // Mock repository behavior
        when(userRepository.findByVerificationToken(token)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // Act
        User result = userService.verifyUser(token);

        // Assert
        assertNotNull(result);
        assertTrue(result.isVerified());
        verify(userRepository, times(1)).save(user);
    }
}
