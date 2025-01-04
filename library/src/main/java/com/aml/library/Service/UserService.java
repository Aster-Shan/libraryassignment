package com.aml.library.Service;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aml.library.Config.security.TokenProvider;
import com.aml.library.Entity.User;
import com.aml.library.dto.LoginResponse;
import com.aml.library.exception.EmailServiceException;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.repository.UserRepository;

@Service
public class UserService {
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);

	@Autowired
	private NotificationService notificationService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private EmailService emailService;

	@Autowired
	private TokenProvider tokenProvider;

	public User registerUser(User user) {
		if (user.getEmail() == null || user.getEmail().isEmpty()) {
			throw new ValidationException("Email is required");
		}
		if (userRepository.findByEmail(user.getEmail()).isPresent()) {
			throw new ValidationException("Email already exists");
		}
		if (user.getPassword() == null || user.getPassword().isEmpty()) {
			throw new ValidationException("Password is required");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setVerificationToken(UUID.randomUUID().toString());
		user.setRole("USER");
		user.setVerified(false);
		User savedUser = userRepository.save(user);
		try {
			logger.info("Attempting to send verification email to: {}", savedUser.getEmail());
			emailService.sendVerificationEmail(savedUser);
			logger.info("Verification email sent successfully to: {}", savedUser.getEmail());
		} catch (EmailServiceException e) {
			logger.error("Failed to send verification email to: {}", savedUser.getEmail(), e);
		}
		return savedUser;
	}

	public LoginResponse login(String email, String password) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidationException("Invalid credentials"));

		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new ValidationException("Invalid credentials");
		}

		if (!user.isVerified()) {
			throw new ValidationException("User inactive, please verify via e-mail.");
		}

		String token = tokenProvider.createToken(user.getEmail(), user.getRole());

		notificationService.generateNotification(user);

		return new LoginResponse(token, user, "Login successful");
	}

	public User getUserByEmail(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
	}

	public User verifyUser(String token) {
		User user = userRepository.findByVerificationToken(token)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));
		user.setVerified(true);
		user.setVerificationToken(null);
		logger.info("Verification OK");
		return userRepository.save(user);
	}

	public void forgetpassword(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

		String resetToken = UUID.randomUUID().toString();
		userRepository.save(user);
		emailService.sendPasswordResetEmail(user, resetToken);
	}

	public void resetPassword(String token, String newPassword) {
		User user = userRepository.findByResetToken(token)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid reset token"));
		user.setPassword(passwordEncoder.encode(newPassword));
		user.setResetToken(null); // Clear reset token
		userRepository.save(user);
	}

	public User updateUser(User user) {
		User existingUser = userRepository.findById(user.getId())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		existingUser.setName(user.getName());
		existingUser.setAddress(user.getAddress());
		existingUser.setPhone(user.getPhone());
		return userRepository.save(existingUser);
	}

	public User changePassword(User user, String oldPassword, String newPassword) {
	    User existingUser = userRepository.findById(user.getId())
	        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    if (!passwordEncoder.matches(oldPassword, existingUser.getPassword())) {
	        throw new ValidationException("Old password is incorrect");
	    }

	    if (oldPassword.equals(newPassword)) {
	        throw new ValidationException("New password cannot be the same as the old password");
	    }

	    existingUser.setPassword(passwordEncoder.encode(newPassword));
	    return userRepository.save(existingUser);
	}
	
	
	public User getUser(Long id) {
		return userRepository.getById(id);
	}
}
