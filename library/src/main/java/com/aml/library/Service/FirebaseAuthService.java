package com.aml.library.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;

@Service
public class FirebaseAuthService {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseAuthService.class);
    
    public String verifyIdToken(String idToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            return decodedToken.getUid();
        } catch (FirebaseAuthException e) {
            logger.error("Error verifying Firebase ID token", e);
            throw new RuntimeException("Invalid Firebase ID token", e);
        }
    }
    
    public UserRecord getUserByEmail(String email) {
        try {
            return FirebaseAuth.getInstance().getUserByEmail(email);
        } catch (FirebaseAuthException e) {
            logger.error("Error getting Firebase user by email", e);
            return null;
        }
    }
    
    public UserRecord createUser(String email, String password) {
        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(email)
                    .setPassword(password)
                    .setEmailVerified(false);
            
            return FirebaseAuth.getInstance().createUser(request);
        } catch (FirebaseAuthException e) {
            logger.error("Error creating Firebase user", e);
            throw new RuntimeException("Failed to create Firebase user", e);
        }
    }
    
    public void setEmailVerified(String uid, boolean verified) {
        try {
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid)
                    .setEmailVerified(verified);
            
            FirebaseAuth.getInstance().updateUser(request);
        } catch (FirebaseAuthException e) {
            logger.error("Error updating Firebase user", e);
            throw new RuntimeException("Failed to update Firebase user", e);
        }
    }
}
