package com.internship.taskmanager.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Hardcoded secret for development (In production, use environment variables!)
    private static final String SECRET_STRING = "ThisIsASecretKeyThatIsAtLeast32BytesLongForHS256Security";
    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(java.nio.charset.StandardCharsets.UTF_8));

    // Token validity: 24 hours
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    // Generate token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // WHO is this token for
                .setIssuedAt(new Date()) // WHEN it was created
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key) // SIGN the token
                .compact();
    }

    // Extract username from token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Validate token
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
