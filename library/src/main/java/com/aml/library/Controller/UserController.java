/*package com.aml.library.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aml.library.Entity.User;
import com.aml.library.Service.UserService;
import com.aml.library.dto.LoginRequest;
import com.aml.library.dto.LoginResponse;
import com.aml.library.dto.MfaSetupResponse;
import com.aml.library.dto.MfaVerifyRequest;
import com.aml.library.dto.PassowrdChangeRequest;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://library-bfd22.web.app"}, 
    allowedHeaders = "*", 
    methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE })
@RequestMapping("/api/users")
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		try {
			User registeredUser = userService.registerUser(user);
			return ResponseEntity.ok(registeredUser);
		} catch (ValidationException e) {
			logger.warn("Validation error during user registration: {}", e.getMessage());
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			logger.error("Unexpected error during user registration", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An unexpected error occurred during registration: " + e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
		try {
			String email = request.getEmail();
			String password = request.getPassword();
			String firebaseToken = request.getFirebaseToken();
			String mfaCode = request.getMfaCode();
			
			LoginResponse response = userService.login(email, password, firebaseToken, mfaCode);

			return ResponseEntity.ok(response);
		} catch (ValidationException e) {
			logger.warn("Validation error during login: {}", e.getMessage());
			return ResponseEntity.badRequest().body(new LoginResponse(null, null, e.getMessage()));
		} catch (Exception e) {
			logger.error("Unexpected error during login", e);
			return ResponseEntity.badRequest().body(new LoginResponse(null, null, e.getMessage()));
		}
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
		try {
			String email = request.get("email");
			userService.forgetpassword(email);
			return ResponseEntity.ok(Map.of("message", "Password reset email sent successfully"));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during password reset request", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}

	@PutMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestBody Map<String, String> request) {
		try {
			String newPassword = request.get("newPassword");
			userService.resetPassword(token, newPassword);
			return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "Invalid Token",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during password reset", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}

	@PostMapping("/verify-email")
	public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
		try {
			User user = userService.verifyUser(token);
			return ResponseEntity.ok(Map.of(
				"message", "Email verified successfully!",
				"user", user
			));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "Invalid Token",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during email verification", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}

	@PutMapping("/update")
	public ResponseEntity<?> updateUser(@RequestBody User user) {
		try {
			User updatedUser = userService.updateUser(user);
			return ResponseEntity.ok(updatedUser);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during user update", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}

	@PostMapping("/update-password")
	public ResponseEntity<?> updatePassword(@RequestBody PassowrdChangeRequest request) {
		try {
			User updatedUser = userService.changePassword(request.getUser(), request.getOldPassword(), request.getNewPassword());
			return ResponseEntity.ok(updatedUser);
		} catch (ValidationException e) {
			return ResponseEntity.badRequest().body(Map.of(
				"error", "Validation Error",
				"message", e.getMessage()
			));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during password update", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}

	@GetMapping("/get-user")
	public ResponseEntity<?> getUser(@RequestParam("id") Long id) {
		try {
			User user = userService.getUser(id);
			return ResponseEntity.ok(user);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error retrieving user", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}
	
	@GetMapping("/by-email")
	public ResponseEntity<?> getUserByEmail(@RequestParam("email") String email) {
		try {
			User user = userService.getUserByEmail(email);
			return ResponseEntity.ok(user);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error retrieving user by email", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}
	
	// 2FA endpoints
	
	@PostMapping("/mfa/setup")
	public ResponseEntity<?> setupMfa(@RequestBody Map<String, String> request) {
		try {
			String email = request.get("email");
			MfaSetupResponse response = userService.setupMfa(email);
			return ResponseEntity.ok(response);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during MFA setup", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}
	
	@PostMapping("/mfa/verify")
	public ResponseEntity<?> verifyMfa(@RequestBody MfaVerifyRequest request) {
		try {
			boolean success = userService.verifyAndEnableMfa(request.getEmail(), request.getCode());
			
			if (success) {
				return ResponseEntity.ok(Map.of(
					"success", true,
					"message", "Two-factor authentication enabled successfully"
				));
			} else {
				return ResponseEntity.badRequest().body(Map.of(
					"success", false,
					"message", "Invalid verification code"
				));
			}
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during MFA verification", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}
	
	@PostMapping("/mfa/disable")
	public ResponseEntity<?> disableMfa(@RequestBody MfaVerifyRequest request) {
		try {
			boolean success = userService.disableMfa(request.getEmail(), request.getCode());
			
			if (success) {
				return ResponseEntity.ok(Map.of(
					"success", true,
					"message", "Two-factor authentication disabled successfully"
				));
			} else {
				return ResponseEntity.badRequest().body(Map.of(
					"success", false,
					"message", "Invalid verification code"
				));
			}
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error during MFA disabling", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}
	
	@GetMapping("/mfa/status")
	public ResponseEntity<?> getMfaStatus(@RequestParam("email") String email) {
		try {
			User user = userService.getUserByEmail(email);
			return ResponseEntity.ok(Map.of(
				"enabled", user.isMfaEnabled()
			));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
				"error", "User Not Found",
				"message", e.getMessage()
			));
		} catch (Exception e) {
			logger.error("Unexpected error retrieving MFA status", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
				"error", "Internal Server Error",
				"message", "An unexpected error occurred"
			));
		}
	}
}
*/