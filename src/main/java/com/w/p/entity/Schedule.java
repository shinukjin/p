package com.w.p.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "WP_SCHEDULES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;
    
    @Column(nullable = false)
    private LocalDateTime dueDate;
    
    private LocalDateTime completedAt;
    
    @Column(length = 200)
    private String relatedVendor;
    
    @Column(length = 100)
    private String contactInfo;
    
    // 예산 항목과 연결
    private Long budgetId;
    
    // D-Day 기준 (결혼식 날짜로부터 며칠 전)
    private Integer daysBeforeWedding;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum ScheduleType {
        VENUE_BOOKING,      // 예식장 예약
        CATERING,           // 음식 관련
        PHOTOGRAPHY,        // 사진/영상
        INVITATION,         // 초대장
        DRESS_FITTING,      // 드레스 피팅
        MAKEUP_TRIAL,       // 메이크업 시연
        FLOWER_ORDER,       // 꽃 주문
        MUSIC_SETUP,        // 음향 설정
        HONEYMOON_BOOKING,  // 신혼여행 예약
        DOCUMENT_PREP,      // 서류 준비
        GIFT_PREPARATION,   // 답례품 준비
        REHEARSAL,          // 리허설
        OTHER               // 기타
    }
    
    public enum ScheduleStatus {
        PENDING,      // 대기
        IN_PROGRESS,  // 진행 중
        COMPLETED,    // 완료
        OVERDUE,      // 기한 초과
        CANCELLED     // 취소
    }
    
    public enum Priority {
        HIGH,    // 높음
        MEDIUM,  // 보통
        LOW      // 낮음
    }
    
    // 기한 초과 여부 확인
    public boolean isOverdue() {
        return LocalDateTime.now().isAfter(dueDate) && status != ScheduleStatus.COMPLETED;
    }
    
    // 마감일까지 남은 일수
    public long getDaysUntilDue() {
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), dueDate);
    }
}
