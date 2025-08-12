package com.w.p.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

/**
 * 비즈니스 로직 예외 클래스
 */
@Getter
public class BusinessException extends RuntimeException {
    
    private final HttpStatus status;
    private final String error;

    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
        this.error = "Business Error";
    }

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.error = "Business Error";
    }

    public BusinessException(String message, HttpStatus status, String error) {
        super(message);
        this.status = status;
        this.error = error;
    }

    // 자주 사용되는 예외들을 위한 정적 팩토리 메서드
    public static BusinessException userAlreadyExists(String username) {
        return new BusinessException(
            String.format("이미 존재하는 사용자입니다: %s", username),
            HttpStatus.CONFLICT,
            "User Already Exists"
        );
    }

    public static BusinessException userNotFound(String username) {
        return new BusinessException(
            String.format("사용자를 찾을 수 없습니다: %s", username),
            HttpStatus.NOT_FOUND,
            "User Not Found"
        );
    }
}
