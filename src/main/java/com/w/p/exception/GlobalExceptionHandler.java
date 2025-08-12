package com.w.p.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

/**
 * 글로벌 예외 처리 핸들러
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 입력 검증 실패 예외 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Failed")
            .message("입력값 검증에 실패했습니다.")
            .details(errors)
            .build();

        log.warn("Validation error: {}", errors);
        return ResponseEntity.badRequest().body(errorResponse);
    }

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

    /**
     * 일반적인 런타임 예외 처리
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Bad Request")
            .message(ex.getMessage())
            .build();

        log.error("Runtime exception: {}", ex.getMessage(), ex);
        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * 예상하지 못한 예외 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("서버 내부 오류가 발생했습니다.")
            .build();

        log.error("Unexpected exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
