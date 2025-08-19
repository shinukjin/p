package com.w.p.component.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String scretKey;
    @Value("${jwt.expiration}")
    private long expiration;

    public String createToken(Long id, String username, String role) {

        Claims claims = Jwts.claims().setSubject(username);
        claims.put("id", id);
        claims.put("role", role);

        Date now = new Date();
        Date expired = new Date(now.getTime() + expiration);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(expired)
            .signWith(Keys.hmacShaKeyFor(scretKey.getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }

    /**
     * User 엔티티로부터 JWT 토큰 생성
     */
    public String generateToken(com.w.p.entity.User user) {
        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("id", user.getId());
        claims.put("role", user.getRole().name());

        Date now = new Date();
        Date expired = new Date(now.getTime() + expiration);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(expired)
            .signWith(Keys.hmacShaKeyFor(scretKey.getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }

    public Claims getClaims(String token){
        return Jwts.parserBuilder()
            .setSigningKey(scretKey.getBytes())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public boolean validateToken(String token){
        try {
            Jwts.parserBuilder()
                .setSigningKey(scretKey.getBytes())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // TODO: handle exception
            return false;
        }
    }
}
