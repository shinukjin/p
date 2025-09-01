package com.w.p.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.w.p.entity.ApiLog;
import com.w.p.service.ApiLogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/admin/logs")
@RequiredArgsConstructor
@Slf4j
public class AdminLogController {
    
    private final ApiLogService apiLogService;
    
    /**
     * 로그 목록 조회 (필터링)
     */
    @GetMapping
    public ResponseEntity<Page<ApiLog>> getLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String endpoint,
            @RequestParam(required = false) ApiLog.LogLevel logLevel,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ApiLog> logs = apiLogService.getLogsByFilters(
            userId, endpoint, logLevel, startDate, endDate, pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    /**
     * 로그 레벨별 조회
     */
    @GetMapping("/level/{logLevel}")
    public ResponseEntity<Page<ApiLog>> getLogsByLevel(
            @PathVariable ApiLog.LogLevel logLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ApiLog> logs = apiLogService.getLogsByLevel(logLevel, pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    /**
     * 사용자별 로그 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ApiLog>> getLogsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ApiLog> logs = apiLogService.getLogsByUser(userId, pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    /**
     * 엔드포인트별 로그 조회
     */
    @GetMapping("/endpoint")
    public ResponseEntity<Page<ApiLog>> getLogsByEndpoint(
            @RequestParam String endpoint,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ApiLog> logs = apiLogService.getLogsByEndpoint(endpoint, pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    /**
     * 날짜 범위별 로그 조회
     */
    @GetMapping("/date-range")
    public ResponseEntity<Page<ApiLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ApiLog> logs = apiLogService.getLogsByDateRange(startDate, endDate, pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    /**
     * 에러 로그만 조회
     */
    @GetMapping("/errors")
    public ResponseEntity<Page<ApiLog>> getErrorLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ApiLog> logs = apiLogService.getErrorLogs(pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    /**
     * 로그 통계 조회
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getLogStatistics() {
        Map<String, Object> statistics = apiLogService.getLogStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * 특정 로그 상세 조회
     */
    @GetMapping("/{logId}")
    public ResponseEntity<ApiLog> getLogById(@PathVariable Long logId) {
        try {
            // ApiLogRepository에서 findById로 조회
            java.util.Optional<ApiLog> log = apiLogService.findById(logId);
            if (log.isPresent()) {
                return ResponseEntity.ok(log.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("로그 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 오래된 로그 정리
     */
    @PostMapping("/cleanup")
    public ResponseEntity<String> cleanupOldLogs() {
        apiLogService.cleanupOldLogs();
        return ResponseEntity.ok("오래된 로그 정리가 시작되었습니다.");
    }
}
