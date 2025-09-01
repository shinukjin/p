package com.w.p.exception.apartment;

import com.w.p.common.ApiResponse;
import com.w.p.entity.ApiLog;
import com.w.p.exception.apartment.ApartmentApiException;
import com.w.p.service.ApiLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 아파트 도메인 전용 예외 처리기 - 모든 에러를 DB에 로그로 저장
 */
@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class ApartmentExceptionHandler {

    private final ApiLogService apiLogService;

    /**
     * 아파트 API 관련 예외 처리
     */
    @ExceptionHandler(ApartmentApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleApartmentApiException(ApartmentApiException e) {
        log.warn("아파트 API 예외: {}", e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("API 호출 실패", e.getMessage());
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(e, HttpStatus.BAD_REQUEST.value(), "Apartment API Error", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * 잘못된 입력 파라미터 예외 처리
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("잘못된 입력 파라미터: {}", e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("잘못된 요청", e.getMessage());
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(e, HttpStatus.BAD_REQUEST.value(), "Invalid Argument", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * HTTP 클라이언트 오류 예외 처리
     */
    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpClientErrorException(HttpClientErrorException e) {
        log.error("HTTP 클라이언트 오류 ({}): {}", e.getStatusCode(), e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("외부 API 호출 실패", "일시적인 서비스 장애가 발생했습니다.");
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(e, e.getStatusCode().value(), "HTTP Client Error", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    /**
     * REST 클라이언트 오류 예외 처리
     */
    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ApiResponse<Object>> handleRestClientException(RestClientException e) {
        log.error("REST 클라이언트 오류: {}", e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("네트워크 오류", "네트워크 연결에 문제가 발생했습니다.");
        
        // 에러 로그를 DB에 저장
        saveErrorLogToDatabase(e, HttpStatus.SERVICE_UNAVAILABLE.value(), "REST Client Error", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
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
                .requestBody("") // ContentCachingRequestWrapper가 아닌 경우 빈 문자열
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
