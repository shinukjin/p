package com.w.p.component.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.w.p.common.util.GlobalUtil;
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
     * User 엔티티로부터 JWT 토큰 생성 (사용자 상세 정보 포함)
     */
    public String generateToken(com.w.p.entity.User user) {
        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("id", user.getId());
        claims.put("role", user.getRole().name());
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());
        claims.put("phone", user.getPhone());
        claims.put("totalBudget", user.getTotalBudget());
        claims.put("status", user.getStatus().name());
        claims.put("createdAt", GlobalUtil.formatDateTime(user.getCreatedAt()));
        claims.put("updatedAt", GlobalUtil.formatDateTime(user.getUpdatedAt()));
        claims.put("lastLoginAt", GlobalUtil.formatDateTime(user.getLastLoginAt()));

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
     * 토큰 만료 시간 정보를 포함한 응답 객체 생성
     */
    public TokenInfo generateTokenInfo(com.w.p.entity.User user) {
        String token = generateToken(user);
        Date now = new Date();
        Date expired = new Date(now.getTime() + expiration);
        long expiresIn = (expired.getTime() - now.getTime()) / 1000; // 초 단위

        return new TokenInfo(token, expired.getTime(), expiresIn);
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    public Long getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("id", Long.class);
    }

    /**
     * 토큰에서 사용자명 추출
     */
    public String getUsername(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }

    /**
     * 토큰에서 역할 추출
     */
    public String getRole(String token) {
        Claims claims = getClaims(token);
        return claims.get("role", String.class);
    }

    /**
     * 토큰에서 총 예산 추출
     */
    public Long getTotalBudget(String token) {
        Claims claims = getClaims(token);
        return claims.get("totalBudget", Long.class);
    }

    /**
     * 토큰에서 사용자 이름 추출
     */
    public String getName(String token) {
        Claims claims = getClaims(token);
        return claims.get("name", String.class);
    }

    /**
     * 토큰에서 이메일 추출
     */
    public String getEmail(String token) {
        Claims claims = getClaims(token);
        return claims.get("email", String.class);
    }

    /**
     * 토큰에서 전화번호 추출
     */
    public String getPhone(String token) {
        Claims claims = getClaims(token);
        return claims.get("phone", String.class);
    }

    /**
     * 토큰에서 상태 추출
     */
    public String getStatus(String token) {
        Claims claims = getClaims(token);
        return claims.get("status", String.class);
    }

    /**
     * 토큰에서 생성일 추출
     */
    public String getCreatedAt(String token) {
        Claims claims = getClaims(token);
        return claims.get("createdAt", String.class);
    }

    /**
     * 토큰에서 수정일 추출
     */
    public String getUpdatedAt(String token) {
        Claims claims = getClaims(token);
        return claims.get("updatedAt", String.class);
    }

    /**
     * 토큰에서 마지막 로그인 시간 추출
     */
    public String getLastLoginAt(String token) {
        Claims claims = getClaims(token);
        return claims.get("lastLoginAt", String.class);
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(scretKey.getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * 토큰에서 Claims 추출
     */
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(scretKey.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    /**
     * 토큰에서 만료 시간 추출
     */
    public Date getExpirationDateFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.getExpiration();
    }

    /**
     * 토큰에서 사용자명 추출 (getUsername과 동일)
     */
    public String getUsernameFromToken(String token) {
        return getUsername(token);
    }

    /**
     * 토큰 정보를 담는 내부 클래스
     */
    public static class TokenInfo {
        private final String token;
        private final long expiresAt;
        private final long expiresIn;

        public TokenInfo(String token, long expiresAt, long expiresIn) {
            this.token = token;
            this.expiresAt = expiresAt;
            this.expiresIn = expiresIn;
        }

        public String getToken() { return token; }
        public long getExpiresAt() { return expiresAt; }
        public long getExpiresIn() { return expiresIn; }
    }
}
