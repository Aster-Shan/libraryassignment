package com.aml.library.test.unit;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.aml.library.Entity.User;
import com.aml.library.exception.EmailServiceException;
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

	@Mock
	private UserRepository userRepository;
	@Mock
	private PasswordEncoder passwordEncoder;
	@Mock
	private EmailService emailService;
	@Mock
	private TokenProvider tokenProvider;
	@Mock
	private NotificationService notificationService;

	@InjectMocks
	private UserService userService;

	private User mockUser;

	@BeforeEach
	public void setup() {
		MockitoAnnotations.openMocks(this);
		mockUser = new User();
		mockUser.setEmail("test@example.com");
		mockUser.setPassword("password");
		mockUser.setId(1L);
		mockUser.setRole("USER");
		mockUser.setVerified(true);
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
	public void testRegisterUser_Success() throws EmailServiceException {
		// Mock the behavior
		when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.empty());
		when(userRepository.save(any(User.class))).thenReturn(mockUser);
		when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

		User registeredUser = userService.registerUser(mockUser);

		assertNotNull(registeredUser);
		assertEquals("encodedPassword", registeredUser.getPassword());
		verify(emailService, times(1)).sendVerificationEmail(registeredUser);
	}

	@Test
	public void testRegisterUser_EmailAlreadyExists() {
		when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

		ValidationException exception = assertThrows(ValidationException.class, () -> {
			userService.registerUser(mockUser);
		});

		assertEquals("Email already exists", exception.getMessage());
	}

	@Test
	public void testVerifyUser_Success() {
		String token = "validToken";
		when(userRepository.findByVerificationToken(token)).thenReturn(Optional.of(mockUser));
		when(userRepository.save(any(User.class))).thenReturn(mockUser);

		User result = userService.verifyUser(token);

		assertTrue(result.isVerified());
		verify(userRepository, times(1)).save(result);
	}

	@Test
	public void testVerifyUser_InvalidToken() {
		String token = "invalidToken";
		when(userRepository.findByVerificationToken(token)).thenReturn(Optional.empty());

		ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
			userService.verifyUser(token);
		});

		assertEquals("Invalid verification token", exception.getMessage());
	}

	@Test
	public void testLogin_Success() {
		String token = "mockedToken";
		when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
		when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
		when(tokenProvider.createToken(anyString(), anyString())).thenReturn(token);

		LoginResponse response = userService.login(mockUser.getEmail(), mockUser.getPassword());

		assertEquals(token, response.getToken());
		assertEquals(mockUser, response.getUser());
		assertEquals("Login successful", response.getMessage());
	}

	@Test
	public void testLogin_InvalidCredentials() {
		when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

		ValidationException exception = assertThrows(ValidationException.class, () -> {
			userService.login(mockUser.getEmail(), "wrongPassword");
		});

		assertEquals("Invalid credentials", exception.getMessage());
	}

	@Test
	public void testGetUserByEmail_Success() {
		when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

		User result = userService.getUserByEmail(mockUser.getEmail());

		assertEquals(mockUser, result);
	}

	@Test
	public void testGetUserByEmail_NotFound() {
		when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.empty());

		ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
			userService.getUserByEmail(mockUser.getEmail());
		});

		assertEquals("User not found with email: test@example.com", exception.getMessage());
	}

	@Test
	public void testForgetPassword_Success() {
		String email = "test@example.com";
		when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

		// Use a specific value or matcher for both parameters in the method call.
		String resetToken = "generatedResetToken";
		doNothing().when(emailService).sendPasswordResetEmail(mockUser, resetToken); // Mock the method to avoid real
																						// email sending

		userService.forgetpassword(email);

		// Verify that sendPasswordResetEmail was called with the correct arguments.
		verify(emailService, times(1)).sendPasswordResetEmail(mockUser, resetToken);
	}

	@Test
	public void testForgetPassword_UserNotFound() {
		String email = "nonexistent@example.com";
		when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

		ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
			userService.forgetpassword(email);
		});

		assertEquals("User not found with email: nonexistent@example.com", exception.getMessage());
	}

	@Test
	public void testResetPassword_Success() {
		String token = "validResetToken";
		String newPassword = "newPassword";
		when(userRepository.findByResetToken(token)).thenReturn(Optional.of(mockUser));
		when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");

		userService.resetPassword(token, newPassword);

		assertEquals("encodedNewPassword", mockUser.getPassword());
		assertNull(mockUser.getResetToken());
		verify(userRepository, times(1)).save(mockUser);
	}

	@Test
	public void testResetPassword_InvalidToken() {
		String token = "invalidToken";
		when(userRepository.findByResetToken(token)).thenReturn(Optional.empty());

		ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
			userService.resetPassword(token, "newPassword");
		});

		assertEquals("Invalid reset token", exception.getMessage());
	}

	@Test
	public void testUpdateUser_Success() {
		when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
		when(userRepository.save(any(User.class))).thenReturn(mockUser);

		mockUser.setName("New Name");
		User updatedUser = userService.updateUser(mockUser);

		assertEquals("New Name", updatedUser.getName());
	}

	@Test
	public void testUpdateUser_NotFound() {
		when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());

		ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
			userService.updateUser(mockUser);
		});

		assertEquals("User not found", exception.getMessage());
	}

	@Test
	public void testChangePassword_Success() {
		String oldPassword = "password";
		String newPassword = "newPassword";
		when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
		when(passwordEncoder.matches(oldPassword, mockUser.getPassword())).thenReturn(true);
		when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");
		when(userRepository.save(any(User.class))).thenReturn(mockUser);

		User updatedUser = userService.changePassword(mockUser, oldPassword, newPassword);

		assertEquals("encodedNewPassword", updatedUser.getPassword());
	}

	@Test
	public void testChangePassword_InvalidOldPassword() {
		String oldPassword = "wrongPassword";
		String newPassword = "newPassword";
		when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

		ValidationException exception = assertThrows(ValidationException.class, () -> {
			userService.changePassword(mockUser, oldPassword, newPassword);
		});

		assertEquals("Old password is incorrect", exception.getMessage());
	}

	@Test
	public void testChangePassword_SameOldNewPassword() {
		String oldPassword = "password";
		String newPassword = "password";
		when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

		ValidationException exception = assertThrows(ValidationException.class, () -> {
			userService.changePassword(mockUser, oldPassword, newPassword);
		});

		assertEquals("New password cannot be the same as the old password", exception.getMessage());
	}
}
