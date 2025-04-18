package com.aml.library.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.Message;

@Service
public class GmailService {

    private static final Logger logger = LoggerFactory.getLogger(GmailService.class);

    private static final String APPLICATION_NAME = "Library Management System";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    
    // Use only the necessary scope
    private static final String SCOPE = GmailScopes.GMAIL_SEND;
    
    @Value("${gmail.service.account.file:/service-account.json}")
    private String serviceAccountFile;
    
    @Value("${gmail.tokens.directory:tokens}")
    private String tokensDirectoryPath;
    
    @Value("${gmail.user.email:me}")
    private String userEmail;

    private Gmail service;

    @PostConstruct
    public void init() {
        try {
            logger.info("Initializing GmailService...");
            NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            service = new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                    .setApplicationName(APPLICATION_NAME)
                    .build();
            logger.info("GmailService initialized successfully");
        } catch (GeneralSecurityException e) {
            logger.error("Security error initializing GmailService: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize GmailService due to security error", e);
        } catch (IOException e) {
            logger.error("I/O error initializing GmailService: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize GmailService due to I/O error", e);
        } catch (Exception e) {
            logger.error("Unexpected error initializing GmailService: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize GmailService due to unexpected error", e);
        }
    }
    
    private Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        logger.debug("Loading service account credentials from: {}", serviceAccountFile);
        InputStream in = GmailService.class.getResourceAsStream(serviceAccountFile);
        if (in == null) {
            logger.error("Service account file not found: {}", serviceAccountFile);
            throw new IOException("Resource not found: " + serviceAccountFile);
        }
        
        try {
            // Use GoogleCredential for service account authentication
            GoogleCredential credential = GoogleCredential.fromStream(in)
                .createScoped(Collections.singleton(SCOPE));
            
            logger.debug("Credentials loaded successfully for service account");
            return credential;
        } finally {
            in.close();
        }
    }

    public void sendEmail(String to, String subject, String bodyText) {
        if (service == null) {
            logger.error("GmailService is not initialized. Unable to send email.");
            throw new RuntimeException("GmailService is not initialized");
        }

        try {
            logger.info("Preparing to send email to: {}", to);
            Properties props = new Properties();
            Session session = Session.getDefaultInstance(props, null);
            MimeMessage email = new MimeMessage(session);
            
            // Set from address (must be the same as the service account or a delegated user)
            email.setFrom(new InternetAddress(userEmail));
            email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(to));
            email.setSubject(subject);
            
            // Set content type to HTML if the body contains HTML tags
            if (bodyText.contains("<html>") || bodyText.contains("<body>")) {
                email.setContent(bodyText, "text/html; charset=utf-8");
            } else {
                email.setText(bodyText);
            }

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            email.writeTo(buffer);
            byte[] rawMessageBytes = buffer.toByteArray();
            String encodedEmail = Base64.encodeBase64URLSafeString(rawMessageBytes);
            Message message = new Message();
            message.setRaw(encodedEmail);

            // Send the message
            message = service.users().messages().send(userEmail, message).execute();
            logger.info("Email sent successfully to {}. Message ID: {}", to, message.getId());
        } catch (IOException e) {
            logger.error("I/O error when sending email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email due to I/O error", e);
        } catch (MessagingException e) {
            logger.error("Messaging error when sending email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email due to messaging error", e);
        } catch (Exception e) {
            logger.error("Unexpected error when sending email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email due to unexpected error", e);
        }
    }
    
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (service == null) {
            logger.error("GmailService is not initialized. Unable to send email.");
            throw new RuntimeException("GmailService is not initialized");
        }

        try {
            logger.info("Preparing to send HTML email to: {}", to);
            Properties props = new Properties();
            Session session = Session.getDefaultInstance(props, null);
            MimeMessage email = new MimeMessage(session);
            
            email.setFrom(new InternetAddress(userEmail));
            email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(to));
            email.setSubject(subject);
            email.setContent(htmlContent, "text/html; charset=utf-8");

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            email.writeTo(buffer);
            byte[] rawMessageBytes = buffer.toByteArray();
            String encodedEmail = Base64.encodeBase64URLSafeString(rawMessageBytes);
            Message message = new Message();
            message.setRaw(encodedEmail);

            message = service.users().messages().send(userEmail, message).execute();
            logger.info("HTML email sent successfully to {}. Message ID: {}", to, message.getId());
        } catch (IOException e) {
            logger.error("I/O error when sending HTML email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send HTML email due to I/O error", e);
        } catch (MessagingException e) {
            logger.error("Messaging error when sending HTML email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send HTML email due to messaging error", e);
        } catch (Exception e) {
            logger.error("Unexpected error when sending HTML email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send HTML email due to unexpected error", e);
        }
    }
}