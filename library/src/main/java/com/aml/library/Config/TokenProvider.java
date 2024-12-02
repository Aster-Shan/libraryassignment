package com.aml.library.Config;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.aml.library.Entity.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class TokenProvider {

    private String secretKey = "your-secret-key"; 
    private long validityInMilliseconds = 3600000; 

    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + validityInMilliseconds))
            .signWith(SignatureAlgorithm.HS512, secretKey)
            .compact();
    }

    public static String createToken(String email, String role) {
        return "valid-token";
    }
}
