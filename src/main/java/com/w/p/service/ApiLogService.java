package com.w.p.service;

import com.w.p.entity.ApiLog;
import com.w.p.repository.ApiLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ApiLogService {
    
    private final ApiLogRepository apiLogRepository;
    
    /**
     * API 로그 저장
     */
    public void saveLog(ApiLog apiLog) {
        try {
            apiLogRepository.save(apiLog);
        } catch (Exception e) {
            log.error("API 로그 저장 실패: {}", e.getMessage(), e);
        }
    }
    
    /**
     * 필터링된 로그 조회
     */
    @Transactional(readOnly = true)
    public Page<ApiLog> getLogsByFilters(
            Long userId,
            String endpoint,
            ApiLog.LogLevel logLevel,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        
        return apiLogRepository.findByFilters(userId, endpoint, logLevel, startDate, endDate, pageable);
    }
    
    /**
     * 로그 레벨별 조회
     */
    @Transactional(readOnly = true)
    public Page<ApiLog> getLogsByLevel(ApiLog.LogLevel logLevel, Pageable pageable) {
        return apiLogRepository.findByLogLevel(logLevel, pageable);
    }
    
    /**
     * 사용자별 로그 조회
     */
    @Transactional(readOnly = true)
    public Page<ApiLog> getLogsByUser(Long userId, Pageable pageable) {
        return apiLogRepository.findByUserId(userId, pageable);
    }
    
    /**
     * 엔드포인트별 로그 조회
     */
    @Transactional(readOnly = true)
    public Page<ApiLog> getLogsByEndpoint(String endpoint, Pageable pageable) {
        return apiLogRepository.findByEndpointContaining(endpoint, pageable);
    }
    
    /**
     * 날짜 범위별 로그 조회
     */
    @Transactional(readOnly = true)
    public Page<ApiLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return apiLogRepository.findByCreatedAtBetween(startDate, endDate, pageable);
    }
    
    /**
     * 에러 로그만 조회
     */
    @Transactional(readOnly = true)
    public Page<ApiLog> getErrorLogs(Pageable pageable) {
        return apiLogRepository.findByLogLevelIn(
            java.util.List.of(ApiLog.LogLevel.ERROR, ApiLog.LogLevel.WARNING), 
            pageable
        );
    }
    
    /**
     * 로그 통계 조회
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getLogStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 전체 로그 수
        statistics.put("totalLogs", apiLogRepository.count());
        
        // 로그 레벨별 통계
        statistics.put("infoLogs", apiLogRepository.countByLogLevel(ApiLog.LogLevel.INFO));
        statistics.put("warningLogs", apiLogRepository.countByLogLevel(ApiLog.LogLevel.WARNING));
        statistics.put("errorLogs", apiLogRepository.countByLogLevel(ApiLog.LogLevel.ERROR));
        statistics.put("debugLogs", apiLogRepository.countByLogLevel(ApiLog.LogLevel.DEBUG));
        
        // 오늘 로그 수
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime tomorrow = today.plusDays(1);
        statistics.put("todayLogs", apiLogRepository.countByDateRange(today, tomorrow));
        
        // 이번 주 로그 수
        LocalDateTime weekStart = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDateTime weekEnd = weekStart.plusDays(7);
        statistics.put("weekLogs", apiLogRepository.countByDateRange(weekStart, weekEnd));
        
        // 이번 달 로그 수
        LocalDateTime monthStart = today.withDayOfMonth(1);
        LocalDateTime monthEnd = monthStart.plusMonths(1);
        statistics.put("monthLogs", apiLogRepository.countByDateRange(monthStart, monthEnd));
        
        return statistics;
    }
    
    /**
     * 특정 로그 조회
     */
    @Transactional(readOnly = true)
    public java.util.Optional<ApiLog> findById(Long id) {
        return apiLogRepository.findById(id);
    }
    
    /**
     * 오래된 로그 정리 (30일 이상)
     */
    public void cleanupOldLogs() {
        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
            // 실제 구현에서는 배치 삭제를 사용하는 것이 좋습니다
            log.info("30일 이상 된 로그 정리 시작: {}", cutoffDate);
        } catch (Exception e) {
            log.error("오래된 로그 정리 실패: {}", e.getMessage(), e);
        }
    }
}
