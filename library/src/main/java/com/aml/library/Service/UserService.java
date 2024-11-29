package com.aml.library.Service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.User;
import com.aml.library.exception.ResourceNotFoundException;
import com.aml.library.exception.ValidationException;
import com.aml.library.repository.UserRepository;


    @Service
    public class UserService {
        @Autowired
        private UserRepository userRepository;
    
        @Autowired
        private PasswordEncoder passwordEncoder;
    
        @Autowired
        private EmailService emailService;
    
        public User registerUser(User user) {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new ValidationException("Email already exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setVerificationToken(UUID.randomUUID().toString());
            user.setVerified(false);
            user.setRole("USER");
            User savedUser = userRepository.save(user);
            emailService.sendVerificationEmail(savedUser);
            return savedUser;
        }
    
        public User login(String email, String password) {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("Invalid email or password"));
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new ValidationException("Invalid email or password");
            }
            if (!user.isVerified()) {
                throw new ValidationException("Email not verified");
            }
            return user;
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
        
            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);  // Clear reset token
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
    }
    
    