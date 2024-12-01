package com.aml.library.dto;

import com.aml.library.Entity.User;

public class LoginResponse {
    private User user;
    private boolean verified;

    public LoginResponse(User user, boolean verified) {
        this.user = user;
        this.verified = verified;
    }

    // Getters and setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}

