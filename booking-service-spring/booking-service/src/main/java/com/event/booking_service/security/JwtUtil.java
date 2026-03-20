package com.event.booking_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
    }

    public String getUserId(String token) {
        return getClaims(token).get("id", String.class);
    }

    public String getRole(String token) {
        return getClaims(token).get("role", String.class);
    }
}
