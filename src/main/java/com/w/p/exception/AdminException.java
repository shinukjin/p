package com.w.p.exception;

/**
 * 관리자 관련 예외
 */
public class AdminException extends RuntimeException {
    
    public AdminException(String message) {
        super(message);
    }
    
    public AdminException(String message, Throwable cause) {
        super(message, cause);
    }
    
    // 정적 팩토리 메서드들
    public static AdminException notFound(Long adminId) {
        return new AdminException("존재하지 않는 관리자입니다. ID: " + adminId);
    }
    
    public static AdminException notFound(String username) {
        return new AdminException("존재하지 않는 관리자입니다: " + username);
    }
    
    public static AdminException accessDenied() {
        return new AdminException("관리자 권한이 없습니다.");
    }
    
    public static AdminException passwordMismatch() {
        return new AdminException("비밀번호가 일치하지 않습니다.");
    }
    
    public static AdminException newPasswordMismatch() {
        return new AdminException("새 비밀번호가 일치하지 않습니다.");
    }
    
    public static AdminException usernameExists(String username) {
        return new AdminException("이미 존재하는 사용자명입니다: " + username);
    }
    
    public static AdminException emailExists(String email) {
        return new AdminException("이미 존재하는 이메일입니다: " + email);
    }
}
