package com.w.p.exception.auth;

import com.w.p.exception.BusinessException;
import com.w.p.exception.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 인증/사용자 도메인 전용 예외 처리기
 */
@RestControllerAdvice
@Slf4j
public class AuthExceptionHandler {

    /**
     * 사용자 인증 실패 예외 처리
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(HttpStatus.UNAUTHORIZED.value())
            .error("Authentication Failed")
            .message("아이디 또는 비밀번호가 올바르지 않습니다.")
            .build();

        log.warn("Authentication failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    /**
     * 사용자를 찾을 수 없는 예외 처리
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .error("User Not Found")
            .message("사용자를 찾을 수 없습니다.")
            .build();

        log.warn("User not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * 사용자 정의 비즈니스 예외 처리
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(ex.getStatus().value())
            .error(ex.getError())
            .message(ex.getMessage())
            .build();

        log.warn("Business exception: {}", ex.getMessage());
        return ResponseEntity.status(ex.getStatus()).body(errorResponse);
    }
}
