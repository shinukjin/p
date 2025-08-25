package com.w.p.repository;

import com.w.p.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    // 사용자별 일정 목록 조회
    List<Schedule> findByUserIdOrderByDueDateAsc(Long userId);
    
    // 일정 타입별 조회
    List<Schedule> findByUserIdAndTypeOrderByDueDateAsc(Long userId, Schedule.ScheduleType type);
    
    // 상태별 일정 조회
    List<Schedule> findByUserIdAndStatusOrderByDueDateAsc(Long userId, Schedule.ScheduleStatus status);
    
    // 우선순위별 일정 조회
    List<Schedule> findByUserIdAndPriorityOrderByDueDateAsc(Long userId, Schedule.Priority priority);
    
    // 오늘 일정 조회
    @Query("SELECT s FROM Schedule s WHERE s.userId = :userId AND DATE(s.dueDate) = DATE(:today) ORDER BY s.dueDate ASC")
    List<Schedule> findTodaySchedules(@Param("userId") Long userId, @Param("today") LocalDateTime today);
    
    // 이번 주 일정 조회
    @Query("SELECT s FROM Schedule s WHERE s.userId = :userId AND s.dueDate BETWEEN :weekStart AND :weekEnd ORDER BY s.dueDate ASC")
    List<Schedule> findWeekSchedules(@Param("userId") Long userId, 
                                   @Param("weekStart") LocalDateTime weekStart, 
                                   @Param("weekEnd") LocalDateTime weekEnd);
    
    // 기한이 임박한 일정 조회 (3일 이내)
    @Query("SELECT s FROM Schedule s WHERE s.userId = :userId AND s.dueDate BETWEEN :now AND :threeDaysLater AND s.status IN ('PENDING', 'IN_PROGRESS') ORDER BY s.dueDate ASC")
    List<Schedule> findUpcomingSchedules(@Param("userId") Long userId, 
                                       @Param("now") LocalDateTime now, 
                                       @Param("threeDaysLater") LocalDateTime threeDaysLater);
    
    // 기한 초과 일정 조회
    @Query("SELECT s FROM Schedule s WHERE s.userId = :userId AND s.dueDate < :now AND s.status IN ('PENDING', 'IN_PROGRESS') ORDER BY s.dueDate ASC")
    List<Schedule> findOverdueSchedules(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    // D-Day 기준 일정 조회
    List<Schedule> findByUserIdAndDaysBeforeWeddingLessThanEqualOrderByDaysBeforeWeddingAsc(Long userId, Integer days);
    
    // 업체별 일정 조회
    List<Schedule> findByUserIdAndRelatedVendorContainingOrderByDueDateAsc(Long userId, String vendor);
    
    // 예산 항목과 연결된 일정 조회
    List<Schedule> findByUserIdAndBudgetIdOrderByDueDateAsc(Long userId, Long budgetId);
    
    // 일정 완료율 통계
    @Query("SELECT s.status, COUNT(s) FROM Schedule s WHERE s.userId = :userId GROUP BY s.status")
    List<Object[]> getScheduleStatsByStatus(@Param("userId") Long userId);
    
    // 일정 타입별 통계
    @Query("SELECT s.type, COUNT(s) FROM Schedule s WHERE s.userId = :userId GROUP BY s.type")
    List<Object[]> getScheduleStatsByType(@Param("userId") Long userId);
}
