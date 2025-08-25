package com.w.p.dto.budget;

import com.w.p.entity.Budget;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BudgetDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String category;
        private String itemName;
        private BigDecimal plannedAmount;
        private BigDecimal actualAmount;
        private Budget.BudgetStatus status;
        private Budget.Priority priority;
        private String description;
        private String vendor;
        private LocalDateTime dueDate;
        
        public Budget toEntity(Long userId) {
            return Budget.builder()
                    .userId(userId)
                    .category(category)
                    .itemName(itemName)
                    .plannedAmount(plannedAmount)
                    .actualAmount(actualAmount)
                    .status(status != null ? status : Budget.BudgetStatus.PLANNED)
                    .priority(priority != null ? priority : Budget.Priority.MEDIUM)
                    .description(description)
                    .vendor(vendor)
                    .dueDate(dueDate)
                    .build();
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String category;
        private String itemName;
        private BigDecimal plannedAmount;
        private BigDecimal actualAmount;
        private Budget.BudgetStatus status;
        private Budget.Priority priority;
        private String description;
        private String vendor;
        private LocalDateTime dueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private boolean isOverBudget;
        private BigDecimal remainingBudget;
        
        public static Response from(Budget budget) {
            return Response.builder()
                    .id(budget.getId())
                    .category(budget.getCategory())
                    .itemName(budget.getItemName())
                    .plannedAmount(budget.getPlannedAmount())
                    .actualAmount(budget.getActualAmount())
                    .status(budget.getStatus())
                    .priority(budget.getPriority())
                    .description(budget.getDescription())
                    .vendor(budget.getVendor())
                    .dueDate(budget.getDueDate())
                    .createdAt(budget.getCreatedAt())
                    .updatedAt(budget.getUpdatedAt())
                    .isOverBudget(budget.isOverBudget())
                    .remainingBudget(budget.getRemainingBudget())
                    .build();
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Update {
        private String category;
        private String itemName;
        private BigDecimal plannedAmount;
        private BigDecimal actualAmount;
        private Budget.BudgetStatus status;
        private Budget.Priority priority;
        private String description;
        private String vendor;
        private LocalDateTime dueDate;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private String category;
        private long itemCount;
        private BigDecimal totalPlannedAmount;
        private BigDecimal totalActualAmount;
        private BigDecimal remainingAmount;
        private double completionRate;
        
        public static Summary from(String category, long count, BigDecimal planned, BigDecimal actual) {
            BigDecimal plannedAmount = planned != null ? planned : BigDecimal.ZERO;
            BigDecimal actualAmount = actual != null ? actual : BigDecimal.ZERO;
            BigDecimal remaining = plannedAmount.subtract(actualAmount);
            double rate = plannedAmount.compareTo(BigDecimal.ZERO) > 0 ? 
                    actualAmount.divide(plannedAmount, 4, BigDecimal.ROUND_HALF_UP).doubleValue() * 100 : 0.0;
            
            return Summary.builder()
                    .category(category)
                    .itemCount(count)
                    .totalPlannedAmount(plannedAmount)
                    .totalActualAmount(actualAmount)
                    .remainingAmount(remaining)
                    .completionRate(rate)
                    .build();
        }
    }
}
