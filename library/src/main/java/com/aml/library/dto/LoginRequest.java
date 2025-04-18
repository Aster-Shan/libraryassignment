package com.aml.library.dto;

public class LoginRequest {
    private String email;
    private String password;
    private String firebaseToken;
    private String mfaCode;
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getFirebaseToken() {
        return firebaseToken;
    }
    
    public void setFirebaseToken(String firebaseToken) {
        this.firebaseToken = firebaseToken;
    }
    
    public String getMfaCode() {
        return mfaCode;
    }
    
    public void setMfaCode(String mfaCode) {
        this.mfaCode = mfaCode;
    }
}
