package com.aml.library.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.library.Config.JwtConfig;

@Service
public class JwtService {
    
    private final JwtConfig jwtConfig;

    @Autowired
    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    public String getJwtSecret() {
        return jwtConfig.getSecret();
    }

    public long getJwtExpiration() {
        return jwtConfig.getExpiration();
    }
}
