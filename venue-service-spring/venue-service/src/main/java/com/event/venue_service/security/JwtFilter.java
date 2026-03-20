package com.event.venue_service.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {

                Claims claims = jwtUtil.extractClaims(token);

                String role = claims.get("role", String.class);
                String userId = claims.get("id", String.class);

                // System.out.println("JWT ROLE: " + role);

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(authority));

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {

                System.out.println("JWT ERROR: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}