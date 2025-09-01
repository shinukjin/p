package com.w.p.domain.schedule.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.w.p.domain.schedule.dto.ScheduleDTO;
import com.w.p.domain.schedule.repository.ScheduleRepository;
import com.w.p.domain.schedule.service.ScheduleService;
import com.w.p.entity.Schedule;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 일정 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ScheduleServiceImpl implements ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    
    /**
     * 사용자별 전체 일정 목록 조회
     * @param userId 사용자 ID
     * @return 일정 목록 (마감일 순으로 정렬)
     */
    @Override
    public List<ScheduleDTO.Response> getSchedulesByUserId(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 사용자별 특정 타입의 일정 목록 조회
     * @param userId 사용자 ID
     * @param type 일정 타입 (VENUE_BOOKING, CATERING, PHOTOGRAPHY 등)
     * @return 해당 타입의 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getSchedulesByType(Long userId, Schedule.ScheduleType type) {
        List<Schedule> schedules = scheduleRepository.findByUserIdAndTypeOrderByDueDateAsc(userId, type);
        return schedules.stream()
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 특정 일정 상세 조회
     * @param userId 사용자 ID
     * @param scheduleId 일정 ID
     * @return 일정 상세 정보
     */
    @Override
    public ScheduleDTO.Response getScheduleById(Long userId, Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        return ScheduleDTO.Response.from(schedule);
    }
    
    /**
     * 새로운 일정 생성
     * @param userId 사용자 ID
     * @param request 일정 생성 요청 데이터
     * @return 생성된 일정 정보
     */
    @Override
    @Transactional
    public ScheduleDTO.Response createSchedule(Long userId, ScheduleDTO.Request request) {
        Schedule schedule = request.toEntity(userId);
        Schedule savedSchedule = scheduleRepository.save(schedule);
        
        log.info("일정이 생성되었습니다. ID: {}, 사용자: {}", savedSchedule.getId(), userId);
        return ScheduleDTO.Response.from(savedSchedule);
    }
    
    /**
     * 일정 정보 수정
     * @param userId 사용자 ID
     * @param scheduleId 일정 ID
     * @param updateRequest 수정할 일정 데이터
     * @return 수정된 일정 정보
     */
    @Override
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
        
        log.info("일정이 수정되었습니다. ID: {}, 사용자: {}", savedSchedule.getId(), userId);
        return ScheduleDTO.Response.from(savedSchedule);
    }
    
    /**
     * 일정 삭제
     * @param userId 사용자 ID
     * @param scheduleId 삭제할 일정 ID
     */
    @Override
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
     * 일정 상태 변경
     * @param userId 사용자 ID
     * @param scheduleId 일정 ID
     * @param status 변경할 상태
     * @return 상태가 변경된 일정 정보
     */
    @Override
    @Transactional
    public ScheduleDTO.Response updateScheduleStatus(Long userId, Long scheduleId, Schedule.ScheduleStatus status) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        schedule.setStatus(status);
        
        // 완료 상태로 변경 시 완료 시간 설정
        if (status == Schedule.ScheduleStatus.COMPLETED) {
            schedule.setCompletedAt(LocalDateTime.now());
        }
        
        Schedule savedSchedule = scheduleRepository.save(schedule);
        
        log.info("일정 상태가 변경되었습니다. ID: {}, 상태: {}, 사용자: {}", 
                savedSchedule.getId(), status, userId);
        return ScheduleDTO.Response.from(savedSchedule);
    }
    
    /**
     * 우선순위별 일정 목록 조회
     * @param userId 사용자 ID
     * @param priority 우선순위 (HIGH, MEDIUM, LOW)
     * @return 해당 우선순위의 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getSchedulesByPriority(Long userId, String priority) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> priority.equals(schedule.getPriority()))
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 기한 범위별 일정 목록 조회
     * @param userId 사용자 ID
     * @param startDate 시작 날짜
     * @param endDate 종료 날짜
     * @return 해당 기한 범위의 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getSchedulesByDueDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> schedule.getDueDate() != null && 
                        !schedule.getDueDate().isBefore(startDate) && 
                        !schedule.getDueDate().isAfter(endDate))
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 완료된 일정 목록 조회
     * @param userId 사용자 ID
     * @return 완료된 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getCompletedSchedules(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> schedule.getStatus() == Schedule.ScheduleStatus.COMPLETED)
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 대기 중인 일정 목록 조회
     * @param userId 사용자 ID
     * @return 대기 중인 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getPendingSchedules(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> schedule.getStatus() == Schedule.ScheduleStatus.PENDING)
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 일정 검색 (제목, 설명, 업체명으로 검색)
     * @param userId 사용자 ID
     * @param keyword 검색 키워드
     * @return 검색 결과 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> searchSchedules(Long userId, String keyword) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> {
                    if (keyword == null || keyword.isEmpty()) return true;
                    String lowerKeyword = keyword.toLowerCase();
                    return schedule.getTitle().toLowerCase().contains(lowerKeyword) ||
                           (schedule.getDescription() != null && schedule.getDescription().toLowerCase().contains(lowerKeyword)) ||
                           (schedule.getRelatedVendor() != null && schedule.getRelatedVendor().toLowerCase().contains(lowerKeyword));
                })
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 일정 검색 (SearchRequest 사용)
     * @param userId 사용자 ID
     * @param searchRequest 검색 조건
     * @return 검색 결과 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> searchSchedules(Long userId, ScheduleDTO.SearchRequest searchRequest) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> {
                    // 타입 필터
                    if (searchRequest.getType() != null && schedule.getType() != searchRequest.getType()) {
                        return false;
                    }
                    // 상태 필터
                    if (searchRequest.getStatus() != null && schedule.getStatus() != searchRequest.getStatus()) {
                        return false;
                    }
                    // 우선순위 필터
                    if (searchRequest.getPriority() != null && schedule.getPriority() != searchRequest.getPriority()) {
                        return false;
                    }
                    // 날짜 범위 필터
                    if (searchRequest.getStartDate() != null && schedule.getDueDate() != null && 
                        schedule.getDueDate().isBefore(searchRequest.getStartDate())) {
                        return false;
                    }
                    if (searchRequest.getEndDate() != null && schedule.getDueDate() != null && 
                        schedule.getDueDate().isAfter(searchRequest.getEndDate())) {
                        return false;
                    }
                    // 키워드 필터
                    if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().trim().isEmpty()) {
                        String lowerKeyword = searchRequest.getKeyword().toLowerCase();
                        return schedule.getTitle().toLowerCase().contains(lowerKeyword) ||
                               (schedule.getDescription() != null && schedule.getDescription().toLowerCase().contains(lowerKeyword)) ||
                               (schedule.getRelatedVendor() != null && schedule.getRelatedVendor().toLowerCase().contains(lowerKeyword));
                    }
                    return true;
                })
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 웨딩 관련 일정 목록 조회 (예식장, 드레스, 메이크업 등)
     * @param userId 사용자 ID
     * @return 웨딩 관련 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getWeddingSchedules(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> schedule.getType() == Schedule.ScheduleType.VENUE_BOOKING ||
                                  schedule.getType() == Schedule.ScheduleType.DRESS_FITTING ||
                                  schedule.getType() == Schedule.ScheduleType.MAKEUP_TRIAL)
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 예산 관련 일정 목록 조회
     * @param userId 사용자 ID
     * @return 예산 관련 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getBudgetSchedules(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> schedule.getType() == Schedule.ScheduleType.CATERING ||
                                  schedule.getType() == Schedule.ScheduleType.FLOWER_ORDER ||
                                  schedule.getType() == Schedule.ScheduleType.GIFT_PREPARATION)
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 업체 관련 일정 목록 조회 (사진, 음향, 기타 업체)
     * @param userId 사용자 ID
     * @return 업체 관련 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getVendorSchedules(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        return schedules.stream()
                .filter(schedule -> schedule.getType() == Schedule.ScheduleType.PHOTOGRAPHY ||
                                  schedule.getType() == Schedule.ScheduleType.MUSIC_SETUP ||
                                  schedule.getType() == Schedule.ScheduleType.OTHER)
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 일정 통계 정보 조회
     * @param userId 사용자 ID
     * @return 일정 통계 정보 (총 개수, 완료 개수, 대기 개수, 기한 초과 개수)
     */
    @Override
    public ScheduleDTO.ListResponse getScheduleStatistics(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        
        int totalCount = schedules.size();
        int completedCount = (int) schedules.stream()
                .filter(s -> s.getStatus() == Schedule.ScheduleStatus.COMPLETED)
                .count();
        int pendingCount = (int) schedules.stream()
                .filter(s -> s.getStatus() == Schedule.ScheduleStatus.PENDING)
                .count();
        int overdueCount = (int) schedules.stream()
                .filter(Schedule::isOverdue)
                .count();
        
        return ScheduleDTO.ListResponse.builder()
                .schedules(schedules.stream()
                        .map(ScheduleDTO.Response::from)
                        .collect(Collectors.toList()))
                .totalCount(totalCount)
                .completedCount(completedCount)
                .pendingCount(pendingCount)
                .overdueCount(overdueCount)
                .build();
    }
    
    /**
     * 일정 알림 설정
     * @param userId 사용자 ID
     * @param scheduleId 일정 ID
     * @param reminderTime 알림 시간
     * @return 알림이 설정된 일정 정보
     */
    @Override
    public ScheduleDTO.Response setScheduleReminder(Long userId, Long scheduleId, LocalDateTime reminderTime) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 알림 시간 설정 로직 (실제 구현에서는 별도 테이블이나 필드에 저장)
        log.info("일정 알림 설정: ID: {}, 알림시간: {}", scheduleId, reminderTime);
        
        return ScheduleDTO.Response.from(schedule);
    }
    
    /**
     * 일정 공유
     * @param userId 사용자 ID
     * @param scheduleId 일정 ID
     * @param shareWithUsername 공유할 사용자명
     * @return 공유된 일정 정보
     */
    @Override
    public ScheduleDTO.Response shareSchedule(Long userId, Long scheduleId, String shareWithUsername) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 일정 공유 로직 (실제 구현에서는 별도 테이블에 저장)
        log.info("일정 공유: ID: {}, 공유 대상: {}", scheduleId, shareWithUsername);
        
        return ScheduleDTO.Response.from(schedule);
    }
    
    /**
     * 일정 템플릿 적용
     * @param userId 사용자 ID
     * @param templateName 템플릿 이름
     * @return 템플릿 기반 생성된 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> applyScheduleTemplate(Long userId, String templateName) {
        // 템플릿 적용 로직 (실제 구현에서는 템플릿 데이터베이스에서 조회)
        log.info("일정 템플릿 적용: 사용자: {}, 템플릿: {}", userId, templateName);
        
        // 빈 리스트 반환 (실제 구현에서는 템플릿 기반 일정 생성)
        return List.of();
    }
    
    /**
     * 일정 캘린더 내보내기
     * @param userId 사용자 ID
     * @param scheduleId 일정 ID
     * @param format 내보낼 형식 (iCal, Google Calendar 등)
     * @return 내보내기 결과 메시지
     */
    @Override
    public String exportScheduleToCalendar(Long userId, Long scheduleId, String format) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));
        
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 캘린더 내보내기 로직 (실제 구현에서는 iCal, Google Calendar 등 형식으로 변환)
        log.info("일정 내보내기: ID: {}, 형식: {}", scheduleId, format);
        
        return "일정이 " + format + " 형식으로 내보내졌습니다.";
    }
    
    /**
     * 외부 캘린더에서 일정 가져오기
     * @param userId 사용자 ID
     * @param calendarData 캘린더 데이터
     * @param format 가져올 형식
     * @return 가져온 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> importScheduleFromCalendar(Long userId, String calendarData, String format) {
        // 캘린더 가져오기 로직 (실제 구현에서는 외부 캘린더 데이터를 파싱하여 일정 생성)
        log.info("일정 가져오기: 사용자: {}, 형식: {}", userId, format);
        
        // 빈 리스트 반환 (실제 구현에서는 파싱된 일정 데이터 반환)
        return List.of();
    }
    
    /**
     * 임박한 일정 조회 (7일 이내)
     * @param userId 사용자 ID
     * @return 7일 이내 마감인 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getUpcomingSchedules(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysLater = now.plusDays(7);
        
        return schedules.stream()
                .filter(schedule -> schedule.getDueDate() != null && 
                        !schedule.getDueDate().isBefore(now) && 
                        !schedule.getDueDate().isAfter(sevenDaysLater) &&
                        schedule.getStatus() != Schedule.ScheduleStatus.COMPLETED)
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 지연된 일정 조회
     * @param userId 사용자 ID
     * @return 마감일이 지난 미완료 일정 목록
     */
    @Override
    public List<ScheduleDTO.Response> getOverdueSchedules(Long userId) {
        List<Schedule> schedules = scheduleRepository.findByUserIdOrderByDueDateAsc(userId);
        LocalDateTime now = LocalDateTime.now();
        
        return schedules.stream()
                .filter(schedule -> schedule.getDueDate() != null && 
                        schedule.getDueDate().isBefore(now) &&
                        schedule.getStatus() != Schedule.ScheduleStatus.COMPLETED)
                .map(ScheduleDTO.Response::from)
                .collect(Collectors.toList());
    }
}
