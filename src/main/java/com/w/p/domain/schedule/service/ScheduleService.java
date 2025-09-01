package com.w.p.domain.schedule.service;

import com.w.p.domain.schedule.dto.ScheduleDTO;
import com.w.p.entity.Schedule;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 일정 서비스 인터페이스
 */
public interface ScheduleService {
    
    /**
     * 사용자별 일정 목록 조회
     */
    List<ScheduleDTO.Response> getSchedulesByUserId(Long userId);
    
    /**
     * 일정 타입별 조회
     */
    List<ScheduleDTO.Response> getSchedulesByType(Long userId, Schedule.ScheduleType type);
    
    /**
     * 일정 상세 조회
     */
    ScheduleDTO.Response getScheduleById(Long userId, Long scheduleId);
    
    /**
     * 일정 생성
     */
    ScheduleDTO.Response createSchedule(Long userId, ScheduleDTO.Request request);
    
    /**
     * 일정 수정
     */
    ScheduleDTO.Response updateSchedule(Long userId, Long scheduleId, ScheduleDTO.Update updateRequest);
    
    /**
     * 일정 삭제
     */
    void deleteSchedule(Long userId, Long scheduleId);
    
    /**
     * 일정 상태 변경
     */
    ScheduleDTO.Response updateScheduleStatus(Long userId, Long scheduleId, Schedule.ScheduleStatus status);
    
    /**
     * 우선순위별 일정 조회
     */
    List<ScheduleDTO.Response> getSchedulesByPriority(Long userId, String priority);
    
    /**
     * 기한별 일정 조회
     */
    List<ScheduleDTO.Response> getSchedulesByDueDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * 완료된 일정 조회
     */
    List<ScheduleDTO.Response> getCompletedSchedules(Long userId);
    
    /**
     * 미완료 일정 조회
     */
    List<ScheduleDTO.Response> getPendingSchedules(Long userId);
    
    /**
     * 일정 검색
     */
    List<ScheduleDTO.Response> searchSchedules(Long userId, String keyword);
    
    /**
     * 일정 검색 (SearchRequest 사용)
     */
    List<ScheduleDTO.Response> searchSchedules(Long userId, ScheduleDTO.SearchRequest searchRequest);
    
    /**
     * 웨딩 관련 일정 조회
     */
    List<ScheduleDTO.Response> getWeddingSchedules(Long userId);
    
    /**
     * 예산 관련 일정 조회
     */
    List<ScheduleDTO.Response> getBudgetSchedules(Long userId);
    
    /**
     * 벤더 관련 일정 조회
     */
    List<ScheduleDTO.Response> getVendorSchedules(Long userId);
    
    /**
     * 일정 통계 조회
     */
    ScheduleDTO.ListResponse getScheduleStatistics(Long userId);
    
    /**
     * 일정 알림 설정
     */
    ScheduleDTO.Response setScheduleReminder(Long userId, Long scheduleId, LocalDateTime reminderTime);
    
    /**
     * 일정 공유
     */
    ScheduleDTO.Response shareSchedule(Long userId, Long scheduleId, String shareWithUsername);
    
    /**
     * 일정 템플릿 적용
     */
    List<ScheduleDTO.Response> applyScheduleTemplate(Long userId, String templateName);
    
    /**
     * 일정 내보내기
     */
    String exportScheduleToCalendar(Long userId, Long scheduleId, String format);
    
    /**
     * 일정 가져오기
     */
    List<ScheduleDTO.Response> importScheduleFromCalendar(Long userId, String calendarData, String format);
    
    /**
     * 임박한 일정 조회 (7일 이내)
     */
    List<ScheduleDTO.Response> getUpcomingSchedules(Long userId);
    
    /**
     * 지연된 일정 조회
     */
    List<ScheduleDTO.Response> getOverdueSchedules(Long userId);
}
