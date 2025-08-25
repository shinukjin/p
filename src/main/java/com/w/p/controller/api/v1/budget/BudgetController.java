package com.w.p.controller.api.v1.budget;

import com.w.p.common.ApiResponse;
import com.w.p.dto.budget.BudgetDTO;
import com.w.p.service.budget.BudgetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Slf4j
public class BudgetController {
    
    private final BudgetService budgetService;
    
    /**
     * 예산 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetDTO.Response>>> getBudgets(
            @RequestParam Long userId,
            @RequestParam(required = false) String category) {
        
        List<BudgetDTO.Response> budgets;
        if (category != null && !category.trim().isEmpty()) {
            budgets = budgetService.getBudgetsByCategory(userId, category);
        } else {
            budgets = budgetService.getBudgetsByUserId(userId);
        }
        
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }
    
    /**
     * 예산 상세 조회
     */
    @GetMapping("/{budgetId}")
    public ResponseEntity<ApiResponse<BudgetDTO.Response>> getBudget(
            @PathVariable Long budgetId,
            @RequestParam Long userId) {
        
        BudgetDTO.Response budget = budgetService.getBudgetById(userId, budgetId);
        return ResponseEntity.ok(ApiResponse.success(budget));
    }
    
    /**
     * 예산 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BudgetDTO.Response>> createBudget(
            @RequestParam Long userId,
            @RequestBody BudgetDTO.Request request) {
        
        BudgetDTO.Response budget = budgetService.createBudget(userId, request);
        return ResponseEntity.ok(ApiResponse.success(budget));
    }
    
    /**
     * 예산 수정
     */
    @PutMapping("/{budgetId}")
    public ResponseEntity<ApiResponse<BudgetDTO.Response>> updateBudget(
            @PathVariable Long budgetId,
            @RequestParam Long userId,
            @RequestBody BudgetDTO.Update updateRequest) {
        
        BudgetDTO.Response budget = budgetService.updateBudget(userId, budgetId, updateRequest);
        return ResponseEntity.ok(ApiResponse.success(budget));
    }
    
    /**
     * 예산 삭제
     */
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @PathVariable Long budgetId,
            @RequestParam Long userId) {
        
        budgetService.deleteBudget(userId, budgetId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    /**
     * 임박한 예산 조회
     */
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<BudgetDTO.Response>>> getUpcomingBudgets(
            @RequestParam Long userId) {
        
        List<BudgetDTO.Response> budgets = budgetService.getUpcomingBudgets(userId);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }
    
    /**
     * 예산 초과 항목 조회
     */
    @GetMapping("/overbudget")
    public ResponseEntity<ApiResponse<List<BudgetDTO.Response>>> getOverBudgetItems(
            @RequestParam Long userId) {
        
        List<BudgetDTO.Response> budgets = budgetService.getOverBudgetItems(userId);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }
    
    /**
     * 카테고리별 예산 요약
     */
    @GetMapping("/summary/category")
    public ResponseEntity<ApiResponse<List<BudgetDTO.Summary>>> getBudgetSummaryByCategory(
            @RequestParam Long userId) {
        
        List<BudgetDTO.Summary> summary = budgetService.getBudgetSummaryByCategory(userId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
    
    /**
     * 전체 예산 요약
     */
    @GetMapping("/summary/total")
    public ResponseEntity<ApiResponse<BudgetDTO.Summary>> getTotalBudgetSummary(
            @RequestParam Long userId) {
        
        BudgetDTO.Summary summary = budgetService.getTotalBudgetSummary(userId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
