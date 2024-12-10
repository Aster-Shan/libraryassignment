package com.aml.library.dto;

import com.aml.library.Entity.User;

public class LoginResponse {
    private User user;
    private String token;
    private String message;

    public LoginResponse(String token, User user, String message) {
        this.token = token;
        this.user = user;
        this.setMessage(message);
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

   
}
    


