package com.w.p.repository;

import com.w.p.entity.ApiLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApiLogRepository extends JpaRepository<ApiLog, Long> {
    
    // 로그 레벨별 조회
    Page<ApiLog> findByLogLevel(ApiLog.LogLevel logLevel, Pageable pageable);
    
    // 사용자별 조회
    Page<ApiLog> findByUserId(Long userId, Pageable pageable);
    
    // 엔드포인트별 조회
    Page<ApiLog> findByEndpointContaining(String endpoint, Pageable pageable);
    
    // 날짜 범위별 조회
    Page<ApiLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    // 에러 로그만 조회
    Page<ApiLog> findByLogLevelIn(List<ApiLog.LogLevel> logLevels, Pageable pageable);
    
    // 복합 검색
    @Query("SELECT l FROM ApiLog l WHERE " +
           "(:userId IS NULL OR l.userId = :userId) AND " +
           "(:endpoint IS NULL OR l.endpoint LIKE %:endpoint%) AND " +
           "(:logLevel IS NULL OR l.logLevel = :logLevel) AND " +
           "(:startDate IS NULL OR l.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR l.createdAt <= :endDate)")
    Page<ApiLog> findByFilters(
        @Param("userId") Long userId,
        @Param("endpoint") String endpoint,
        @Param("logLevel") ApiLog.LogLevel logLevel,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    // 통계 조회
    @Query("SELECT COUNT(l) FROM ApiLog l WHERE l.logLevel = :logLevel")
    Long countByLogLevel(@Param("logLevel") ApiLog.LogLevel logLevel);
    
    @Query("SELECT COUNT(l) FROM ApiLog l WHERE l.createdAt >= :startDate AND l.createdAt <= :endDate")
    Long countByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
