package com.event.venue_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String SECRET =
            "satyabratapandacapstoneproject_secure_key_2026_super";

    public Claims extractClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractRole(String token) {

        Claims claims = extractClaims(token);
        return claims.get("role", String.class);
    }

    public String extractUserId(String token) {

        Claims claims = extractClaims(token);
        return claims.get("id", String.class);
    }
}