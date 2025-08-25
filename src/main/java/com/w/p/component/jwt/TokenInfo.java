package com.w.p.component.jwt;

import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Date;

/**
 * JWT 토큰 정보를 담는 클래스
 * 토큰 문자열과 만료 시간 정보를 포함
 */
@Getter
@AllArgsConstructor
@Builder
public class TokenInfo {
    
    private final String token;           // JWT 토큰 문자열
    private final long expiresAt;         // 토큰 만료 시간 (Unix timestamp - 초)
    private final long expiresIn;         // 토큰 만료까지 남은 시간 (초)
    private final Date issuedAt;          // 토큰 발급 시간
    private final Date expiresAtDate;     // 토큰 만료 시간 (Date 객체)
    
    /**
     * 기본 생성자 (기존 코드와의 호환성을 위해)
     */
    public TokenInfo(String token, long expiresAt, long expiresIn) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.expiresIn = expiresIn;
        this.issuedAt = new Date();
        this.expiresAtDate = new Date(expiresAt * 1000);
    }
    
    /**
     * 토큰 정보를 문자열로 출력
     * @return 토큰 정보 문자열
     */
    @Override
    public String toString() {
        return String.format(
            "TokenInfo{token='%s...', expiresAt=%d, expiresIn=%d, issuedAt=%s, expiresAtDate=%s}",
            token.substring(0, Math.min(20, token.length())),
            expiresAt,
            expiresIn,
            issuedAt,
            expiresAtDate
        );
    }
}
