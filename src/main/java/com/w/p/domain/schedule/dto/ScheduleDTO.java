package com.w.p.domain.schedule.dto;

import com.w.p.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ScheduleDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String title;
        private String description;
        private Schedule.ScheduleType type;
        private Schedule.ScheduleStatus status;
        private Schedule.Priority priority;
        private LocalDateTime dueDate;
        private String relatedVendor;
        private String contactInfo;
        private Long budgetId;
        private Integer daysBeforeWedding;
        
        public Schedule toEntity(Long userId) {
            return Schedule.builder()
                    .userId(userId)
                    .title(title)
                    .description(description)
                    .type(type != null ? type : Schedule.ScheduleType.OTHER)
                    .status(status != null ? status : Schedule.ScheduleStatus.PENDING)
                    .priority(priority != null ? priority : Schedule.Priority.MEDIUM)
                    .dueDate(dueDate)
                    .relatedVendor(relatedVendor)
                    .contactInfo(contactInfo)
                    .budgetId(budgetId)
                    .daysBeforeWedding(daysBeforeWedding)
                    .build();
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private Schedule.ScheduleType type;
        private Schedule.ScheduleStatus status;
        private Schedule.Priority priority;
        private LocalDateTime dueDate;
        private LocalDateTime completedAt;
        private String relatedVendor;
        private String contactInfo;
        private Long budgetId;
        private Integer daysBeforeWedding;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private boolean isOverdue;
        private long daysUntilDue;
        
        public static Response from(Schedule schedule) {
            return Response.builder()
                    .id(schedule.getId())
                    .title(schedule.getTitle())
                    .description(schedule.getDescription())
                    .type(schedule.getType())
                    .status(schedule.getStatus())
                    .priority(schedule.getPriority())
                    .dueDate(schedule.getDueDate())
                    .completedAt(schedule.getCompletedAt())
                    .relatedVendor(schedule.getRelatedVendor())
                    .contactInfo(schedule.getContactInfo())
                    .budgetId(schedule.getBudgetId())
                    .daysBeforeWedding(schedule.getDaysBeforeWedding())
                    .createdAt(schedule.getCreatedAt())
                    .updatedAt(schedule.getUpdatedAt())
                    .isOverdue(schedule.isOverdue())
                    .daysUntilDue(schedule.getDaysUntilDue())
                    .build();
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Update {
        private String title;
        private String description;
        private Schedule.ScheduleType type;
        private Schedule.ScheduleStatus status;
        private Schedule.Priority priority;
        private LocalDateTime dueDate;
        private String relatedVendor;
        private String contactInfo;
        private Long budgetId;
        private Integer daysBeforeWedding;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchRequest {
        private Schedule.ScheduleType type;
        private Schedule.ScheduleStatus status;
        private Schedule.Priority priority;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String keyword;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private java.util.List<Response> schedules;
        private int totalCount;
        private int completedCount;
        private int pendingCount;
        private int overdueCount;
    }
}
