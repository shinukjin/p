package com.w.p.common;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;

/**
 * 통일된 API 응답 형식
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    private String error;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    // 성공 응답을 위한 정적 팩토리 메서드
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
            .success(true)
            .message(message)
            .data(data)
            .build();
    }

    public static ApiResponse<Void> success(String message) {
        return ApiResponse.<Void>builder()
            .success(true)
            .message(message)
            .build();
    }

    // 실패 응답을 위한 정적 팩토리 메서드
    public static <T> ApiResponse<T> error(String error) {
        return ApiResponse.<T>builder()
            .success(false)
            .error(error)
            .build();
    }

    public static <T> ApiResponse<T> error(String error, String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .error(error)
            .message(message)
            .build();
    }
}
