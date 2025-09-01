package com.w.p.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "WP_BUDGETS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 100)
    private String category;
    
    @Column(nullable = false, length = 200)
    private String itemName;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal plannedAmount;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal actualAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;
    
    @Column(length = 500)
    private String description;
    
    @Column(length = 200)
    private String vendor;
    
    private LocalDateTime dueDate;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum BudgetStatus {
        PLANNED,      // 계획됨
        IN_PROGRESS,  // 진행 중
        COMPLETED,    // 완료
        OVERBUDGET,   // 예산 초과
        CANCELLED,    // 취소
        APPROVED,     // 승인됨
        REJECTED      // 반려됨
    }
    
    public enum Priority {
        HIGH,    // 높음
        MEDIUM,  // 보통
        LOW      // 낮음
    }
    
    // 예산 초과 여부 확인
    public boolean isOverBudget() {
        if (actualAmount == null || plannedAmount == null) {
            return false;
        }
        return actualAmount.compareTo(plannedAmount) > 0;
    }
    
    // 잔여 예산 계산
    public BigDecimal getRemainingBudget() {
        if (actualAmount == null || plannedAmount == null) {
            return plannedAmount != null ? plannedAmount : BigDecimal.ZERO;
        }
        return plannedAmount.subtract(actualAmount);
    }
}
