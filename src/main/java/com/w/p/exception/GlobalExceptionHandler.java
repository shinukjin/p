package com.w.p.exception;

import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException;
import com.w.p.common.ApiResponse;
import com.w.p.entity.ApiLog;
import com.w.p.service.ApiLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 글로벌 예외 처리기 - 모든 에러를 DB에 로그로 저장
 */
@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final ApiLogService apiLogService;

    /**
     * JSON 파싱 에러 처리 (HttpMessageNotReadableException)
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        String errorMessage = "잘못된 요청 형식입니다.";
        String detailMessage = ex.getMessage();
        
        // UnrecognizedPropertyException인 경우 더 자세한 정보 제공
        if (ex.getCause() instanceof UnrecognizedPropertyException) {
            UnrecognizedPropertyException upe = (UnrecognizedPropertyException) ex.getCause();
            errorMessage = String.format("알 수 없는 필드 '%s'가 요청에 포함되어 있습니다.", upe.getPropertyName());
            detailMessage = String.format("클래스 %s에서 인식할 수 없는 필드: %s", 
                upe.getReferringClass().getSimpleName(), upe.getPropertyName());
        }
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("JSON Parse Error")
            .message(errorMessage)
            .details(Map.of("detail", detailMessage))
            .build();

        log.error("JSON 파싱 에러: {}", detailMessage, ex);
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(ex, HttpStatus.BAD_REQUEST.value(), "JSON Parse Error", detailMessage);
        
        return ResponseEntity.badRequest().body(errorResponse);
    }

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
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(ex, HttpStatus.BAD_REQUEST.value(), "Validation Failed", errors.toString());
        
        return ResponseEntity.badRequest().body(errorResponse);
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
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(ex, HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage());
        
        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * 기타 예상치 못한 예외 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("서버 내부 오류가 발생했습니다.")
            .build();

        log.error("Unexpected exception: {}", ex.getMessage(), ex);
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(ex, HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * 에러 로그를 데이터베이스에 저장
     */
    private void saveErrorLogToDatabase(Exception ex, int statusCode, String errorType, String errorMessage) {
        try {
            // 현재 요청 정보 가져오기
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes == null) {
                log.warn("Request attributes not available for error logging");
                return;
            }

            HttpServletRequest request = attributes.getRequest();
            
            // 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = null;
            String username = "anonymous";
            
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getName())) {
                try {
                    username = authentication.getName();
                    // userId는 별도로 추출해야 할 수 있습니다
                } catch (Exception e) {
                    log.warn("사용자 정보 추출 실패: {}", e.getMessage());
                }
            }

            // 에러 로그 생성
            ApiLog errorLog = ApiLog.builder()
                .userId(userId)
                .username(username)
                .endpoint(request.getRequestURI())
                .method(request.getMethod())
                .requestBody(getRequestBodyForLog(request))
                .queryParameters(request.getQueryString())
                .responseStatus(statusCode)
                .errorMessage(String.format("[%s] %s: %s", errorType, ex.getClass().getSimpleName(), errorMessage))
                .executionTime(0L) // 에러 발생 시점이므로 실행 시간은 0
                .ipAddress(getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .logLevel(ApiLog.LogLevel.ERROR)
                .build();

            // 에러 로그 저장
            apiLogService.saveLog(errorLog);
            
        } catch (Exception e) {
            log.error("에러 로그 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 로그 저장용 요청 본문 추출
     */
    private String getRequestBodyForLog(HttpServletRequest request) {
        try {
            // ContentCachingRequestWrapper가 아닌 경우 빈 문자열 반환
            return "";
        } catch (Exception e) {
            log.warn("요청 본문 로그 추출 실패: {}", e.getMessage());
            return "";
        }
    }

    /**
     * 클라이언트 IP 주소 추출
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
