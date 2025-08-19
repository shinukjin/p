package com.w.p.exception.apartment;

import com.w.p.common.ApiResponse;
import com.w.p.exception.apartment.ApartmentApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

/**
 * 아파트 도메인 전용 예외 처리기
 */
@RestControllerAdvice
@Slf4j
public class ApartmentExceptionHandler {

    /**
     * 아파트 API 관련 예외 처리
     */
    @ExceptionHandler(ApartmentApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleApartmentApiException(ApartmentApiException e) {
        log.warn("아파트 API 예외: {}", e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("API 호출 실패", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * 잘못된 입력 파라미터 예외 처리
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("잘못된 입력 파라미터: {}", e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("잘못된 요청", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * HTTP 클라이언트 오류 예외 처리
     */
    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpClientErrorException(HttpClientErrorException e) {
        log.error("HTTP 클라이언트 오류 ({}): {}", e.getStatusCode(), e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("외부 API 호출 실패", "일시적인 서비스 장애가 발생했습니다.");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    /**
     * REST 클라이언트 오류 예외 처리
     */
    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ApiResponse<Object>> handleRestClientException(RestClientException e) {
        log.error("REST 클라이언트 오류: {}", e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("네트워크 오류", "네트워크 연결에 문제가 발생했습니다.");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
