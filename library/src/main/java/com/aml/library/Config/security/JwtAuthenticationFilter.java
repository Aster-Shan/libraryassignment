package com.aml.library.Config.security;

import java.io.IOException;
import java.util.Collections;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenProvider tokenProvider;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    public JwtAuthenticationFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        logger.debug("Processing request: {} {}", request.getMethod(), path);
        
        // Skip authentication for permitted paths
        if (shouldSkipAuthentication(path)) {
            logger.debug("Skipping authentication for path: {}", path);
            chain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);

        if (token != null) {
            try {
                if (tokenProvider.validateToken(token)) {
                    Claims claims = tokenProvider.getClaimsFromToken(token);

                    // Extract username and roles
                    String username = claims.getSubject();
                    String role = claims.get("roles", String.class);
                    logger.debug("Authenticated user: {} with role: {}", username, role);

                    // Create authorities from the role
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singleton(authority)
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set authentication in the security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                logger.error("Authentication error: {}", e.getMessage());
                // Don't throw exception, just continue without authentication
            }
        }

        chain.doFilter(request, response);
    }

    private boolean shouldSkipAuthentication(String path) {
        return path.startsWith("/api/users/login") || 
               path.startsWith("/api/auth/login") || 
               path.startsWith("/api/users/register") ||
               path.startsWith("/api/auth/register") ||
               path.startsWith("/api/users/verify-email") ||
               path.startsWith("/api/auth/verify-email") ||
               path.startsWith("/api/health");
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}