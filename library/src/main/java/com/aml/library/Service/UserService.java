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
import com.aml.library.dto.MfaSetupResponse;
import com.aml.library.exception.EmailServiceException;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.repository.UserRepository;
import com.google.firebase.auth.UserRecord;

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
    
    @Autowired
    private FirebaseAuthService firebaseAuthService;
    
    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

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
        
        // Create Firebase user
        UserRecord firebaseUser = firebaseAuthService.createUser(user.getEmail(), user.getPassword());
        user.setFirebaseUid(firebaseUser.getUid());
        
        // Set up local user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setRole("USER");
        user.setVerified(false);
        user.setMfaEnabled(false);
        
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

    public LoginResponse login(String email, String password, String firebaseToken, String mfaCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("Invalid credentials"));
    
        // Verify password for local authentication
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Password mismatch for user: {}", email);
            throw new ValidationException("Invalid credentials");
        }
    
        /// Verify Firebase token
if (firebaseToken != null && !firebaseToken.isEmpty()) {
    try {
        String uid = firebaseAuthService.verifyIdToken(firebaseToken);
        
        // Check if user has a Firebase UID in the database
        if (user.getFirebaseUid() == null) {
            // Option 1: Update the user with the Firebase UID
            user.setFirebaseUid(uid);
            userRepository.save(user);
            logger.info("Updated missing Firebase UID for user: {}", user.getEmail());
            
            // Option 2: Or simply log a warning and continue
            // logger.warn("User {} has no Firebase UID in database", user.getEmail());
        } 
        else if (!uid.equals(user.getFirebaseUid())) {
            logger.error("Firebase UID mismatch for user {}", user.getEmail());
            throw new ValidationException("Firebase authentication failed: UID mismatch");
        }
    } catch (Exception e) {
        logger.error("Firebase token verification failed: {}", e.getMessage(), e);
        throw new ValidationException("Firebase authentication failed: " + e.getMessage());
    }
} else {
            logger.warn("No Firebase token provided for user: {}", email);
            throw new ValidationException("Firebase authentication required");
        }
        
        // Check if user is verified
        if (!user.isVerified()) {
            logger.warn("User {} is not verified", email);
            throw new ValidationException("User inactive, please verify via e-mail.");
        }
        
        // Verify 2FA if enabled
        if (user.isMfaEnabled()) {
            if (mfaCode == null || mfaCode.isEmpty()) {
                logger.info("2FA is enabled for user {} but no code provided", email);
                throw new ValidationException("2FA code required");
            }
            
            if (!twoFactorAuthService.verifyCode(user.getMfaSecret(), mfaCode)) {
                logger.warn("Invalid 2FA code provided for user: {}", email);
                throw new ValidationException("Invalid 2FA code");
            }
            
            logger.info("2FA verification successful for user: {}", email);
        }
    
        String token = tokenProvider.createToken(user.getEmail(), user.getRole());
        notificationService.generateNotification(user);
        
        logger.info("Login successful for user: {}", email);
        return new LoginResponse(token, user, "Login successful");
    }

    public User verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid verification token"));
        
        user.setVerified(true);
        user.setVerificationToken(null);
        
        // Update Firebase user
        firebaseAuthService.setEmailVerified(user.getFirebaseUid(), true);
        
        logger.info("Verification OK");
        return userRepository.save(user);
    }
    
    public MfaSetupResponse setupMfa(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        String secret = twoFactorAuthService.generateSecret();
        String qrCodeImageUri = twoFactorAuthService.generateQrCodeImageUri(secret, user.getEmail());
        
        // Store the secret temporarily (will be saved after verification)
        user.setMfaSecret(secret);
        userRepository.save(user);
        
        return new MfaSetupResponse(secret, qrCodeImageUri);
    }
    
    public boolean verifyAndEnableMfa(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        if (twoFactorAuthService.verifyCode(user.getMfaSecret(), code)) {
            user.setMfaEnabled(true);
            userRepository.save(user);
            return true;
        }
        
        return false;
    }
    
    public boolean disableMfa(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        if (!user.isMfaEnabled()) {
            return true;
        }
        
        if (twoFactorAuthService.verifyCode(user.getMfaSecret(), code)) {
            user.setMfaEnabled(false);
            user.setMfaSecret(null);
            userRepository.save(user);
            return true;
        }
        
        return false;
    }

    // Other existing methods remain unchanged
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
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
