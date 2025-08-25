package com.w.p.controller.api.v1.schedule;

import com.w.p.common.ApiResponse;
import com.w.p.dto.schedule.ScheduleDTO;
import com.w.p.entity.Schedule;
import com.w.p.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    
    /**
     * 일정 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getSchedules(
            @RequestParam Long userId,
            @RequestParam(required = false) String type) {
        
        List<ScheduleDTO.Response> schedules;
        if (type != null && !type.trim().isEmpty()) {
            Schedule.ScheduleType scheduleType = Schedule.ScheduleType.valueOf(type.toUpperCase());
            schedules = scheduleService.getSchedulesByType(userId, scheduleType);
        } else {
            schedules = scheduleService.getSchedulesByUserId(userId);
        }
        
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * 일정 상세 조회
     */
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<ScheduleDTO.Response>> getSchedule(
            @PathVariable Long scheduleId,
            @RequestParam Long userId) {
        
        ScheduleDTO.Response schedule = scheduleService.getScheduleById(userId, scheduleId);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }
    
    /**
     * 일정 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleDTO.Response>> createSchedule(
            @RequestParam Long userId,
            @RequestBody ScheduleDTO.Request request) {
        
        ScheduleDTO.Response schedule = scheduleService.createSchedule(userId, request);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }
    
    /**
     * 일정 수정
     */
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<ScheduleDTO.Response>> updateSchedule(
            @PathVariable Long scheduleId,
            @RequestParam Long userId,
            @RequestBody ScheduleDTO.Update updateRequest) {
        
        ScheduleDTO.Response schedule = scheduleService.updateSchedule(userId, scheduleId, updateRequest);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }
    
    /**
     * 일정 완료 처리
     */
    @PatchMapping("/{scheduleId}/complete")
    public ResponseEntity<ApiResponse<ScheduleDTO.Response>> completeSchedule(
            @PathVariable Long scheduleId,
            @RequestParam Long userId) {
        
        ScheduleDTO.Response schedule = scheduleService.completeSchedule(userId, scheduleId);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }
    
    /**
     * 일정 삭제
     */
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
            @PathVariable Long scheduleId,
            @RequestParam Long userId) {
        
        scheduleService.deleteSchedule(userId, scheduleId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    /**
     * 오늘 일정 조회
     */
    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getTodaySchedules(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.getTodaySchedules(userId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * 이번 주 일정 조회
     */
    @GetMapping("/week")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getWeekSchedules(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.getWeekSchedules(userId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * 임박한 일정 조회
     */
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getUpcomingSchedules(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.getUpcomingSchedules(userId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * 기한 초과 일정 조회
     */
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getOverdueSchedules(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.getOverdueSchedules(userId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * D-Day 기준 일정 조회
     */
    @GetMapping("/dday/{days}")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getSchedulesByDDay(
            @PathVariable Integer days,
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.getSchedulesByDDay(userId, days);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * 일정 완료율 통계
     */
    @GetMapping("/stats/status")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Summary>>> getScheduleStatsByStatus(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Summary> stats = scheduleService.getScheduleStatsByStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    
    /**
     * 일정 타입별 통계
     */
    @GetMapping("/stats/type")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.TypeSummary>>> getScheduleStatsByType(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.TypeSummary> stats = scheduleService.getScheduleStatsByType(userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
