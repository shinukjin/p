package com.w.p.exception;

/**
 * 사용자 관련 예외
 */
public class UserException extends RuntimeException {
    
    public UserException(String message) {
        super(message);
    }
    
    public UserException(String message, Throwable cause) {
        super(message, cause);
    }
    
    // 정적 팩토리 메서드들
    public static UserException notFound(Long userId) {
        return new UserException("사용자를 찾을 수 없습니다. ID: " + userId);
    }
    
    public static UserException notFound(String username) {
        return new UserException("사용자를 찾을 수 없습니다: " + username);
    }
    
    public static UserException usernameExists(String username) {
        return new UserException("이미 존재하는 사용자명입니다: " + username);
    }
    
    public static UserException emailExists(String email) {
        return new UserException("이미 존재하는 이메일입니다: " + email);
    }
    
    public static UserException invalidStatus(String status) {
        return new UserException("유효하지 않은 상태값입니다: " + status);
    }
    
    public static UserException invalidRole(String role) {
        return new UserException("유효하지 않은 역할값입니다: " + role);
    }
    
    public static UserException accountLocked() {
        return new UserException("계정이 잠겨있습니다.");
    }
    
    public static UserException accountInactive() {
        return new UserException("비활성화된 계정입니다.");
    }
    
    public static UserException unauthorized() {
        return new UserException("인증이 필요합니다.");
    }
}
