package com.w.p.exception;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;

/**
 * 에러 응답 DTO
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    private int status;
    private String error;
    private String message;
    private Map<String, String> details;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
