package com.aml.library.Config.security;

import java.io.IOException;
import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;

@Configuration
public class FirebaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Bean
    public FirebaseApp firebaseApp() {
        try {
            InputStream serviceAccount = new ClassPathResource("firebase-service-account.json").getInputStream();
            
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            
            if (FirebaseApp.getApps().isEmpty()) {
                logger.info("Initializing Firebase application");
                return FirebaseApp.initializeApp(options);
            } else {
                logger.info("Firebase application already initialized");
                return FirebaseApp.getInstance();
            }
        } catch (IOException e) {
            logger.error("Error initializing Firebase: {}", e.getMessage(), e);
            throw new RuntimeException("Firebase initialization failed: " + e.getMessage(), e);
        }
    }
    
    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        logger.info("Creating FirebaseAuth instance");
        return FirebaseAuth.getInstance(firebaseApp);
    }
}