package com.w.p.domain.budget.service;

import com.w.p.domain.budget.dto.BudgetDTO;
import com.w.p.entity.Budget;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 예산 서비스 인터페이스
 */
public interface BudgetService {
    
    /**
     * 사용자별 예산 목록 조회
     */
    List<BudgetDTO.Response> getBudgetsByUserId(Long userId);
    
    /**
     * 카테고리별 예산 목록 조회
     */
    List<BudgetDTO.Response> getBudgetsByCategory(Long userId, String category);
    
    /**
     * 예산 상세 조회
     */
    BudgetDTO.Response getBudgetById(Long userId, Long budgetId);
    
    /**
     * 예산 생성
     */
    BudgetDTO.Response createBudget(Long userId, BudgetDTO.Request request);
    
    /**
     * 예산 수정
     */
    BudgetDTO.Response updateBudget(Long userId, Long budgetId, BudgetDTO.Update updateRequest);
    
    /**
     * 예산 삭제
     */
    void deleteBudget(Long userId, Long budgetId);
    
    /**
     * 예산 상태 변경
     */
    BudgetDTO.Response updateBudgetStatus(Long userId, Long budgetId, Budget.BudgetStatus status);
    
    /**
     * 예산 검색
     */
    List<BudgetDTO.Response> searchBudgets(Long userId, String keyword);
    
    /**
     * 카테고리별 예산 통계
     */
    List<BudgetDTO.CategorySummary> getBudgetByCategory(Long userId);
    
    /**
     * 전체 예산 요약
     */
    BudgetDTO.Summary getBudgetSummary(Long userId);
    
    /**
     * 예산 알림 설정
     */
    BudgetDTO.Response setBudgetAlert(Long userId, Long budgetId, BigDecimal alertThreshold);
    
    /**
     * 예산 템플릿 적용
     * 
     */
    List<BudgetDTO.Response> applyBudgetTemplate(Long userId, String templateName);
    
    /**
     * 예산 내보내기
     */
    String exportBudgetToExcel(Long userId, String format);
    
    /**
     * 예산 가져오기
     */
    List<BudgetDTO.Response> importBudgetFromExcel(Long userId, String excelData, String format);
    
    /**
     * 예산 공유
     */
    BudgetDTO.Response shareBudget(Long userId, Long budgetId, String shareWithUsername);
    
    /**
     * 예산 승인
     */
    BudgetDTO.Response approveBudget(Long userId, Long budgetId);
    
    /**
     * 예산 반려
     */
    BudgetDTO.Response rejectBudget(Long userId, Long budgetId, String reason);
    
    /**
     * 예산 이력 조회
     */
    List<BudgetDTO.Response> getBudgetHistory(Long userId, Long budgetId);
    
    /**
     * 예산 리포트 생성
     */
    String generateBudgetReport(Long userId, String reportType);
    
    /**
     * 카테고리별 예산 요약
     */
    List<BudgetDTO.Response> getBudgetSummaryByCategory(Long userId);
}
