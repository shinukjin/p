package com.w.p.component.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

/**
 * JWT 토큰 검증을 담당하는 클래스
 * 토큰의 유효성, 만료 여부, 클레임 정보 등을 검증
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TokenValidator {
    
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * 토큰 유효성 검사
     * @param token JWT 토큰 문자열
     * @return 검증 결과
     */
    public ValidationResult validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return ValidationResult.invalid("토큰이 비어있습니다.");
            }
            
            // JWT 파싱 및 서명 검증
            Claims claims = jwtTokenProvider.getClaims(token);
            
            // 만료 시간 검증
            if (claims.getExpiration() == null) {
                return ValidationResult.invalid("토큰에 만료 시간이 없습니다.");
            }
            
            if (claims.getExpiration().before(new java.util.Date())) {
                return ValidationResult.expired("토큰이 만료되었습니다.");
            }
            
            // 필수 클레임 검증
            if (claims.getSubject() == null || claims.getSubject().trim().isEmpty()) {
                return ValidationResult.invalid("토큰에 사용자 정보가 없습니다.");
            }
            
            if (claims.get("id") == null) {
                return ValidationResult.invalid("토큰에 사용자 ID가 없습니다.");
            }
            
            if (claims.get("role") == null) {
                return ValidationResult.invalid("토큰에 사용자 역할이 없습니다.");
            }
            
            return ValidationResult.valid(claims);
            
        } catch (ExpiredJwtException e) {
            log.warn("만료된 토큰: {}", e.getMessage());
            return ValidationResult.expired("토큰이 만료되었습니다.");
            
        } catch (MalformedJwtException e) {
            log.warn("잘못된 형식의 토큰: {}", e.getMessage());
            return ValidationResult.invalid("잘못된 형식의 토큰입니다.");
            
        } catch (UnsupportedJwtException e) {
            log.warn("지원하지 않는 JWT: {}", e.getMessage());
            return ValidationResult.invalid("지원하지 않는 JWT 형식입니다.");
            
        } catch (IllegalArgumentException e) {
            log.warn("잘못된 토큰: {}", e.getMessage());
            return ValidationResult.invalid("잘못된 토큰입니다.");
            
        } catch (Exception e) {
            log.error("토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            return ValidationResult.error("토큰 검증 중 오류가 발생했습니다.");
        }
    }
    
    /**
     * 토큰에서 사용자 ID 추출
     * @param token JWT 토큰
     * @return 사용자 ID (실패 시 null)
     */
    public Long extractUserId(String token) {
        try {
            Claims claims = jwtTokenProvider.getClaims(token);
            Object idObj = claims.get("id");
            if (idObj instanceof Number) {
                return ((Number) idObj).longValue();
            }
            return null;
        } catch (Exception e) {
            log.warn("사용자 ID 추출 실패: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 토큰에서 사용자명 추출
     * @param token JWT 토큰
     * @return 사용자명 (실패 시 null)
     */
    public String extractUsername(String token) {
        try {
            Claims claims = jwtTokenProvider.getClaims(token);
            return claims.getSubject();
        } catch (Exception e) {
            log.warn("사용자명 추출 실패: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 토큰에서 사용자 역할 추출
     * @param token JWT 토큰
     * @return 사용자 역할 (실패 시 null)
     */
    public String extractUserRole(String token) {
        try {
            Claims claims = jwtTokenProvider.getClaims(token);
            Object roleObj = claims.get("role");
            return roleObj != null ? roleObj.toString() : null;
        } catch (Exception e) {
            log.warn("사용자 역할 추출 실패: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 토큰 검증 결과를 담는 클래스
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final Claims claims;
        private final ValidationStatus status;
        
        private ValidationResult(boolean valid, String message, Claims claims, ValidationStatus status) {
            this.valid = valid;
            this.message = message;
            this.claims = claims;
            this.status = status;
        }
        
        public static ValidationResult valid(Claims claims) {
            return new ValidationResult(true, "토큰이 유효합니다.", claims, ValidationStatus.VALID);
        }
        
        public static ValidationResult expired(String message) {
            return new ValidationResult(false, message, null, ValidationStatus.EXPIRED);
        }
        
        public static ValidationResult invalid(String message) {
            return new ValidationResult(false, message, null, ValidationStatus.INVALID);
        }
        
        public static ValidationResult error(String message) {
            return new ValidationResult(false, message, null, ValidationStatus.ERROR);
        }
        
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public Claims getClaims() { return claims; }
        public ValidationStatus getStatus() { return status; }
    }
    
    /**
     * 토큰 검증 상태 열거형
     */
    public enum ValidationStatus {
        VALID,      // 유효
        EXPIRED,    // 만료됨
        INVALID,    // 유효하지 않음
        ERROR       // 오류 발생
    }
}
