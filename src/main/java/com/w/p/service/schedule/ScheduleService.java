package com.w.p.service.schedule;

import com.w.p.dto.schedule.ScheduleDTO;
import com.w.p.entity.Schedule;
import com.w.p.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    
    /**
     * 사용자별 일정 목록 조회
     */
    public List<ScheduleDTO.Response> getSchedulesByUserId(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 일정 타입별 조회
     */
    public List<ScheduleDTO.Response> getSchedulesByType(Long userId, Schedule.ScheduleType type) {
        List<Schedule> schedules = scheduleRepository.findByUserIdAndTypeOrderByDueDateAsc(userId, type);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 일정 상세 조회
     */
    public ScheduleDTO.Response getScheduleById(Long userId, Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        return ScheduleDTO.Response.from(schedule);
    }
    
    /**
     * 일정 생성
     */
    @Transactional
    public ScheduleDTO.Response createSchedule(Long userId, ScheduleDTO.Request request) {
        Schedule schedule = request.toEntity(userId);
        Schedule savedSchedule = scheduleRepository.save(schedule);
        
        log.info("일정이 생성되었습니다. ID: {}, 사용자: {}", savedSchedule.getId(), userId);
        return ScheduleDTO.Response.from(savedSchedule);
    }
    
    /**
     * 일정 수정
     */
    @Transactional
    public ScheduleDTO.Response updateSchedule(Long userId, Long scheduleId, ScheduleDTO.Update updateRequest) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 업데이트 적용
        if (updateRequest.getTitle() != null) schedule.setTitle(updateRequest.getTitle());
        if (updateRequest.getDescription() != null) schedule.setDescription(updateRequest.getDescription());
        if (updateRequest.getType() != null) schedule.setType(updateRequest.getType());
        if (updateRequest.getStatus() != null) {
            schedule.setStatus(updateRequest.getStatus());
            // 완료 상태로 변경 시 완료 시간 설정
            if (updateRequest.getStatus() == Schedule.ScheduleStatus.COMPLETED) {
                schedule.setCompletedAt(LocalDateTime.now());
            }
        }
        if (updateRequest.getPriority() != null) schedule.setPriority(updateRequest.getPriority());
        if (updateRequest.getDueDate() != null) schedule.setDueDate(updateRequest.getDueDate());
        if (updateRequest.getRelatedVendor() != null) schedule.setRelatedVendor(updateRequest.getRelatedVendor());
        if (updateRequest.getContactInfo() != null) schedule.setContactInfo(updateRequest.getContactInfo());
        if (updateRequest.getBudgetId() != null) schedule.setBudgetId(updateRequest.getBudgetId());
        if (updateRequest.getDaysBeforeWedding() != null) schedule.setDaysBeforeWedding(updateRequest.getDaysBeforeWedding());
        
        Schedule savedSchedule = scheduleRepository.save(schedule);
        
        log.info("일정이 수정되었습니다. ID: {}, 사용자: {}", scheduleId, userId);
        return ScheduleDTO.Response.from(savedSchedule);
    }
    
    /**
     * 일정 완료 처리
     */
    @Transactional
    public ScheduleDTO.Response completeSchedule(Long userId, Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        schedule.setStatus(Schedule.ScheduleStatus.COMPLETED);
        schedule.setCompletedAt(LocalDateTime.now());
        
        Schedule savedSchedule = scheduleRepository.save(schedule);
        
        log.info("일정이 완료되었습니다. ID: {}, 사용자: {}", scheduleId, userId);
        return ScheduleDTO.Response.from(savedSchedule);
    }
    
    /**
     * 일정 삭제
     */
    @Transactional
    public void deleteSchedule(Long userId, Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        scheduleRepository.delete(schedule);
        log.info("일정이 삭제되었습니다. ID: {}, 사용자: {}", scheduleId, userId);
    }
    
    /**
     * 오늘 일정 조회
     */
    public List<ScheduleDTO.Response> getTodaySchedules(Long userId) {
        LocalDateTime today = LocalDateTime.now();
        List<Schedule> schedules = scheduleRepository.findTodaySchedules(userId, today);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 이번 주 일정 조회
     */
    public List<ScheduleDTO.Response> getWeekSchedules(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekStart = now.truncatedTo(ChronoUnit.DAYS);
        LocalDateTime weekEnd = weekStart.plusDays(7);
        
        List<Schedule> schedules = scheduleRepository.findWeekSchedules(userId, weekStart, weekEnd);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 임박한 일정 조회 (3일 이내)
     */
    public List<ScheduleDTO.Response> getUpcomingSchedules(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threeDaysLater = now.plusDays(3);
        
        List<Schedule> schedules = scheduleRepository.findUpcomingSchedules(userId, now, threeDaysLater);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 기한 초과 일정 조회
     */
    public List<ScheduleDTO.Response> getOverdueSchedules(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Schedule> schedules = scheduleRepository.findOverdueSchedules(userId, now);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * D-Day 기준 일정 조회
     */
    public List<ScheduleDTO.Response> getSchedulesByDDay(Long userId, Integer days) {
        List<Schedule> schedules = scheduleRepository.findByUserIdAndDaysBeforeWeddingLessThanEqualOrderByDaysBeforeWeddingAsc(userId, days);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 일정 완료율 통계
     */
    public List<ScheduleDTO.Summary> getScheduleStatsByStatus(Long userId) {
        List<Object[]> stats = scheduleRepository.getScheduleStatsByStatus(userId);
        
        return stats.stream()
                .map(stat -> ScheduleDTO.Summary.from(
                        (Schedule.ScheduleStatus) stat[0],  // status
                        (Long) stat[1]                      // count
                ))
                .collect(Collectors.toList());
    }
    
    /**
     * 일정 타입별 통계
     */
    public List<ScheduleDTO.TypeSummary> getScheduleStatsByType(Long userId) {
        List<Object[]> stats = scheduleRepository.getScheduleStatsByType(userId);
        
        return stats.stream()
                .map(stat -> ScheduleDTO.TypeSummary.from(
                        (Schedule.ScheduleType) stat[0],    // type
                        (Long) stat[1]                      // count
                ))
                .collect(Collectors.toList());
    }
}
