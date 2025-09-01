package com.w.p.domain.budget.controller;

import com.w.p.common.ApiResponse;
import com.w.p.domain.budget.dto.BudgetDTO;
import com.w.p.domain.budget.service.BudgetService;
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
     * 카테고리별 예산 요약
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<List<BudgetDTO.Response>>> getBudgetSummaryByCategory(
            @RequestParam Long userId) {
        
        List<BudgetDTO.Response> budgets = budgetService.getBudgetSummaryByCategory(userId);
        return ResponseEntity.ok(ApiResponse.success(budgets));
    }
}
