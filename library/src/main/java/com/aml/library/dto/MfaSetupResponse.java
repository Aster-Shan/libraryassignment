package com.aml.library.dto;

public class MfaSetupResponse {
    private String secret;
    private String qrCodeImageUri;
    
    public MfaSetupResponse(String secret, String qrCodeImageUri) {
        this.secret = secret;
        this.qrCodeImageUri = qrCodeImageUri;
    }
    
    public String getSecret() {
        return secret;
    }
    
    public void setSecret(String secret) {
        this.secret = secret;
    }
    
    public String getQrCodeImageUri() {
        return qrCodeImageUri;
    }
    
    public void setQrCodeImageUri(String qrCodeImageUri) {
        this.qrCodeImageUri = qrCodeImageUri;
    }
}
