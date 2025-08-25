package com.w.p.exception;

/**
 * 부동산 관련 예외
 */
public class RealEstateException extends RuntimeException {
    
    public RealEstateException(String message) {
        super(message);
    }
    
    public RealEstateException(String message, Throwable cause) {
        super(message, cause);
    }
    
    // 정적 팩토리 메서드들
    public static RealEstateException notFound() {
        return new RealEstateException("매물을 찾을 수 없습니다.");
    }
    
    public static RealEstateException accessDenied() {
        return new RealEstateException("해당 매물에 접근할 권한이 없습니다.");
    }
}
