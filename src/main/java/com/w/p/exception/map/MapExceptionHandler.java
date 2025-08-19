package com.w.p.exception.map;

import com.w.p.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 지도 도메인 전용 예외 처리기
 */
@RestControllerAdvice
@Slf4j
public class MapExceptionHandler {

    /**
     * 지도 API 관련 예외 처리 (향후 확장)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleMapException(Exception e) {
        log.error("지도 API 예외: {}", e.getMessage());
        ApiResponse<Object> response = ApiResponse.error("지도 서비스 오류", "지도 서비스에 일시적인 문제가 발생했습니다.");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
