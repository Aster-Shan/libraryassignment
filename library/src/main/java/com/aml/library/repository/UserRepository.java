package com.aml.library.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aml.library.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    // This method is now explicitly defined
    Optional<User> findByVerificationToken(String token);
    long count();
    long countByStatus(String status);
    Optional<User> findByResetToken(String resetToken);

}
