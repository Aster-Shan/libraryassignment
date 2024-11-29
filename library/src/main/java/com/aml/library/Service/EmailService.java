package com.aml.library.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.aml.library.Entity.User;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Verify your email");
        message.setText("Please click on the link to verify your email: "
                + "http://localhost:8080/api/users/verify?token=" + user.getVerificationToken());
        mailSender.send(message);
    }

    public void sendNotification(User user, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Email Login");
        message.setText("Your email is now log in");
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Reset your password");
        message.setText("Please click on the link to reset your password: "
                + "http://localhost:8080/reset-password?token=" + resetToken);
        mailSender.send(message);
    }
}



