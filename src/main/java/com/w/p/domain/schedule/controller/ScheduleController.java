package com.w.p.domain.schedule.controller;

import com.w.p.common.ApiResponse;
import com.w.p.domain.schedule.dto.ScheduleDTO;
import com.w.p.entity.Schedule;
import com.w.p.domain.schedule.service.ScheduleService;
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
        
        ScheduleDTO.Response schedule = scheduleService.updateScheduleStatus(userId, scheduleId, Schedule.ScheduleStatus.COMPLETED);
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
     * 일정 검색
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> searchSchedules(
            @RequestParam Long userId,
            @RequestBody ScheduleDTO.SearchRequest searchRequest) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.searchSchedules(userId, searchRequest);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * 일정 통계 조회
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<ScheduleDTO.ListResponse>> getScheduleStatistics(
            @RequestParam Long userId) {
        
        ScheduleDTO.ListResponse statistics = scheduleService.getScheduleStatistics(userId);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
    
    /**
     * 임박한 일정 조회 (7일 이내)
     */
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getUpcomingSchedules(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.getUpcomingSchedules(userId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
    
    /**
     * 지연된 일정 조회
     */
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<ScheduleDTO.Response>>> getOverdueSchedules(
            @RequestParam Long userId) {
        
        List<ScheduleDTO.Response> schedules = scheduleService.getOverdueSchedules(userId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
}
