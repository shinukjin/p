package com.w.p.service.budget;

import com.w.p.dto.budget.BudgetDTO;
import com.w.p.entity.Budget;
import com.w.p.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BudgetService {
    
    private final BudgetRepository budgetRepository;
    
    /**
     * 사용자별 예산 목록 조회
     */
    public List<BudgetDTO.Response> getBudgetsByUserId(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return budgets.stream()
                .map(BudgetDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 카테고리별 예산 목록 조회
     */
    public List<BudgetDTO.Response> getBudgetsByCategory(Long userId, String category) {
        List<Budget> budgets = budgetRepository.findByUserIdAndCategoryOrderByCreatedAtDesc(userId, category);
        return budgets.stream()
                .map(BudgetDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 예산 상세 조회
     */
    public BudgetDTO.Response getBudgetById(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        return BudgetDTO.Response.from(budget);
    }
    
    /**
     * 예산 생성
     */
    @Transactional
    public BudgetDTO.Response createBudget(Long userId, BudgetDTO.Request request) {
        Budget budget = request.toEntity(userId);
        Budget savedBudget = budgetRepository.save(budget);
        
        log.info("예산 항목이 생성되었습니다. ID: {}, 사용자: {}", savedBudget.getId(), userId);
        return BudgetDTO.Response.from(savedBudget);
    }
    
    /**
     * 예산 수정
     */
    @Transactional
    public BudgetDTO.Response updateBudget(Long userId, Long budgetId, BudgetDTO.Update updateRequest) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 업데이트 적용
        if (updateRequest.getCategory() != null) budget.setCategory(updateRequest.getCategory());
        if (updateRequest.getItemName() != null) budget.setItemName(updateRequest.getItemName());
        if (updateRequest.getPlannedAmount() != null) budget.setPlannedAmount(updateRequest.getPlannedAmount());
        if (updateRequest.getActualAmount() != null) budget.setActualAmount(updateRequest.getActualAmount());
        if (updateRequest.getStatus() != null) budget.setStatus(updateRequest.getStatus());
        if (updateRequest.getPriority() != null) budget.setPriority(updateRequest.getPriority());
        if (updateRequest.getDescription() != null) budget.setDescription(updateRequest.getDescription());
        if (updateRequest.getVendor() != null) budget.setVendor(updateRequest.getVendor());
        if (updateRequest.getDueDate() != null) budget.setDueDate(updateRequest.getDueDate());
        
        Budget savedBudget = budgetRepository.save(budget);
        
        log.info("예산 항목이 수정되었습니다. ID: {}, 사용자: {}", budgetId, userId);
        return BudgetDTO.Response.from(savedBudget);
    }
    
    /**
     * 예산 삭제
     */
    @Transactional
    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        budgetRepository.delete(budget);
        log.info("예산 항목이 삭제되었습니다. ID: {}, 사용자: {}", budgetId, userId);
    }
    
    /**
     * 임박한 예산 조회 (7일 이내)
     */
    public List<BudgetDTO.Response> getUpcomingBudgets(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekLater = now.plusDays(7);
        
        List<Budget> budgets = budgetRepository.findUpcomingBudgets(userId, now, weekLater);
        return budgets.stream()
                .map(BudgetDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 예산 초과 항목 조회
     */
    public List<BudgetDTO.Response> getOverBudgetItems(Long userId) {
        List<Budget> budgets = budgetRepository.findOverBudgetItems(userId);
        return budgets.stream()
                .map(BudgetDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 카테고리별 예산 요약
     */
    public List<BudgetDTO.Summary> getBudgetSummaryByCategory(Long userId) {
        List<Object[]> stats = budgetRepository.getBudgetStatsByCategory(userId);
        
        return stats.stream()
                .map(stat -> BudgetDTO.Summary.from(
                        (String) stat[0],  // category
                        (Long) stat[1],    // count
                        (BigDecimal) stat[2], // planned
                        (BigDecimal) stat[3]  // actual
                ))
                .collect(Collectors.toList());
    }
    
    /**
     * 전체 예산 요약
     */
    public BudgetDTO.Summary getTotalBudgetSummary(Long userId) {
        BigDecimal totalPlanned = budgetRepository.getTotalPlannedAmount(userId);
        BigDecimal totalActual = budgetRepository.getTotalActualAmount(userId);
        long totalCount = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId).size();
        
        return BudgetDTO.Summary.from("전체", totalCount, totalPlanned, totalActual);
    }
}
