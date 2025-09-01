package com.w.p.domain.budget.dto;

import com.w.p.entity.Budget;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

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
    public static class SearchRequest {
        private String category;
        private Budget.BudgetStatus status;
        private Budget.Priority priority;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String keyword;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private java.util.List<Response> budgets;
        private BigDecimal totalPlannedAmount;
        private BigDecimal totalActualAmount;
        private BigDecimal totalRemainingBudget;
        private int totalCount;
        private int completedCount;
        private int overBudgetCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategorySummary {
        private String category;
        private BigDecimal totalPlannedAmount;
        private BigDecimal totalActualAmount;
        private BigDecimal totalRemainingAmount;
        private int itemCount;
        private int completedCount;
        private int overBudgetCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private BigDecimal totalPlannedAmount;
        private BigDecimal totalActualAmount;
        private BigDecimal totalRemainingAmount;
        private int totalItemCount;
        private int completedItemCount;
        private int overBudgetItemCount;
        private Map<String, CategorySummary> categoryBreakdown;
    }
}
