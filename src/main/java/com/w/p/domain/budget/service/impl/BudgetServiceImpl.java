package com.w.p.domain.budget.service.impl;

import com.w.p.domain.budget.dto.BudgetDTO;
import com.w.p.domain.budget.service.BudgetService;
import com.w.p.domain.budget.repository.BudgetRepository;
import com.w.p.entity.Budget;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 예산 서비스 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetServiceImpl implements BudgetService {
    
    private final BudgetRepository budgetRepository;
    
    @Override
    public List<BudgetDTO.Response> getBudgetsByUserId(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return budgets.stream()
                .map(BudgetDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BudgetDTO.Response> getBudgetsByCategory(Long userId, String category) {
        List<Budget> budgets = budgetRepository.findByUserIdAndCategoryOrderByCreatedAtDesc(userId, category);
        return budgets.stream()
                .map(BudgetDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public BudgetDTO.Response getBudgetById(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        return BudgetDTO.Response.from(budget);
    }
    
    @Override
    @Transactional
    public BudgetDTO.Response createBudget(Long userId, BudgetDTO.Request request) {
        Budget budget = request.toEntity(userId);
        Budget savedBudget = budgetRepository.save(budget);
        
        log.info("예산 항목이 생성되었습니다. ID: {}, 사용자: {}", savedBudget.getId(), userId);
        return BudgetDTO.Response.from(savedBudget);
    }
    
    @Override
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
    
    @Override
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
    
    @Override
    @Transactional
    public BudgetDTO.Response updateBudgetStatus(Long userId, Long budgetId, Budget.BudgetStatus status) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        budget.setStatus(status);
        Budget savedBudget = budgetRepository.save(budget);
        
        log.info("예산 상태가 변경되었습니다. ID: {}, 상태: {}, 사용자: {}", 
                savedBudget.getId(), status, userId);
        return BudgetDTO.Response.from(savedBudget);
    }
    
    @Override
    public List<BudgetDTO.Response> searchBudgets(Long userId, String keyword) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return budgets.stream()
                .filter(budget -> {
                    if (keyword == null || keyword.isEmpty()) return true;
                    String lowerKeyword = keyword.toLowerCase();
                    return budget.getItemName().toLowerCase().contains(lowerKeyword) ||
                           (budget.getDescription() != null && budget.getDescription().toLowerCase().contains(lowerKeyword)) ||
                           (budget.getVendor() != null && budget.getVendor().toLowerCase().contains(lowerKeyword));
                })
                .map(BudgetDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<BudgetDTO.CategorySummary> getBudgetByCategory(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return budgets.stream()
                .collect(Collectors.groupingBy(Budget::getCategory))
                .values()
                .stream()
                .map(categoryBudgets -> {
                    BigDecimal totalPlanned = categoryBudgets.stream()
                            .map(Budget::getPlannedAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    BigDecimal totalActual = categoryBudgets.stream()
                            .map(Budget::getActualAmount)
                            .filter(amount -> amount != null)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    int completedCount = (int) categoryBudgets.stream()
                            .filter(b -> b.getStatus() == Budget.BudgetStatus.COMPLETED)
                            .count();
                    int overBudgetCount = (int) categoryBudgets.stream()
                            .filter(Budget::isOverBudget)
                            .count();
                    
                    return BudgetDTO.CategorySummary.builder()
                            .category(categoryBudgets.get(0).getCategory())
                            .totalPlannedAmount(totalPlanned)
                            .totalActualAmount(totalActual)
                            .totalRemainingAmount(totalPlanned.subtract(totalActual))
                            .itemCount(categoryBudgets.size())
                            .completedCount(completedCount)
                            .overBudgetCount(overBudgetCount)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public BudgetDTO.Summary getBudgetSummary(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        BigDecimal totalPlannedAmount = budgets.stream()
                .map(Budget::getPlannedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalActualAmount = budgets.stream()
                .map(Budget::getActualAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalRemainingBudget = totalPlannedAmount.subtract(totalActualAmount);
        
        int totalCount = budgets.size();
        int completedCount = (int) budgets.stream()
                .filter(b -> b.getStatus() == Budget.BudgetStatus.COMPLETED)
                .count();
        int overBudgetCount = (int) budgets.stream()
                .filter(Budget::isOverBudget)
                .count();
        
        return BudgetDTO.Summary.builder()
                .totalPlannedAmount(totalPlannedAmount)
                .totalActualAmount(totalActualAmount)
                .totalRemainingAmount(totalRemainingBudget)
                .totalItemCount(totalCount)
                .completedItemCount(completedCount)
                .overBudgetItemCount(overBudgetCount)
                .build();
    }
    
    @Override
    public BudgetDTO.Response setBudgetAlert(Long userId, Long budgetId, BigDecimal alertThreshold) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 알림 임계값 설정 로직 (실제 구현에서는 별도 테이블이나 필드에 저장)
        log.info("예산 알림 설정: ID: {}, 임계값: {}", budgetId, alertThreshold);
        
        return BudgetDTO.Response.from(budget);
    }
    
    @Override
    public List<BudgetDTO.Response> applyBudgetTemplate(Long userId, String templateName) {
        // 템플릿 적용 로직 (실제 구현에서는 템플릿 데이터베이스에서 조회)
        log.info("예산 템플릿 적용: 사용자: {}, 템플릿: {}", userId, templateName);
        
        // 빈 리스트 반환 (실제 구현에서는 템플릿 기반 예산 생성)
        return List.of();
    }
    
    @Override
    public String exportBudgetToExcel(Long userId, String format) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // Excel 내보내기 로직 (실제 구현에서는 Apache POI 등을 사용)
        log.info("예산 Excel 내보내기: 사용자: {}, 형식: {}", userId, format);
        
        return "예산이 " + format + " 형식으로 내보내졌습니다.";
    }
    
    @Override
    public List<BudgetDTO.Response> importBudgetFromExcel(Long userId, String excelData, String format) {
        // Excel 가져오기 로직 (실제 구현에서는 Excel 파일을 파싱하여 예산 생성)
        log.info("예산 Excel 가져오기: 사용자: {}, 형식: {}", userId, format);
        
        // 빈 리스트 반환 (실제 구현에서는 파싱된 예산 데이터 반환)
        return List.of();
    }
    
    @Override
    public BudgetDTO.Response shareBudget(Long userId, Long budgetId, String shareWithUsername) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 예산 공유 로직 (실제 구현에서는 별도 테이블에 저장)
        log.info("예산 공유: ID: {}, 공유 대상: {}", budgetId, shareWithUsername);
        
        return BudgetDTO.Response.from(budget);
    }
    
    @Override
    public BudgetDTO.Response approveBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        budget.setStatus(Budget.BudgetStatus.APPROVED);
        Budget savedBudget = budgetRepository.save(budget);
        
        log.info("예산 승인: ID: {}, 사용자: {}", budgetId, userId);
        return BudgetDTO.Response.from(savedBudget);
    }
    
    @Override
    public BudgetDTO.Response rejectBudget(Long userId, Long budgetId, String reason) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("예산 항목을 찾을 수 없습니다."));
        
        if (!budget.getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        budget.setStatus(Budget.BudgetStatus.REJECTED);
        Budget savedBudget = budgetRepository.save(budget);
        
        log.info("예산 반려: ID: {}, 사유: {}, 사용자: {}", budgetId, reason, userId);
        return BudgetDTO.Response.from(savedBudget);
    }
    
    @Override
    public List<BudgetDTO.Response> getBudgetHistory(Long userId, Long budgetId) {
        // 예산 이력 조회 로직 (실제 구현에서는 별도 테이블에서 조회)
        log.info("예산 이력 조회: ID: {}, 사용자: {}", budgetId, userId);
        
        // 빈 리스트 반환 (실제 구현에서는 이력 데이터 반환)
        return List.of();
    }
    
    @Override
    public String generateBudgetReport(Long userId, String reportType) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // 리포트 생성 로직 (실제 구현에서는 PDF, Excel 등으로 생성)
        log.info("예산 리포트 생성: 사용자: {}, 리포트 타입: {}", userId, reportType);
        
        return "예산 리포트가 " + reportType + " 형식으로 생성되었습니다.";
    }
    

    
    /**
     * 카테고리별 예산 요약
     * @param userId 사용자 ID
     * @return 카테고리별 예산 요약 목록
     */
    @Override
    public List<BudgetDTO.Response> getBudgetSummaryByCategory(Long userId) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // 카테고리별로 그룹화하여 요약 정보 생성
        return budgets.stream()
                .collect(Collectors.groupingBy(Budget::getCategory))
                .values()
                .stream()
                .map(categoryBudgets -> {
                    // 각 카테고리의 첫 번째 예산을 기준으로 Response 생성
                    Budget representativeBudget = categoryBudgets.get(0);
                    
                    // 카테고리별 총계 계산
                    BigDecimal totalPlanned = categoryBudgets.stream()
                            .map(Budget::getPlannedAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal totalActual = categoryBudgets.stream()
                            .map(Budget::getActualAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    // 대표 예산의 정보로 Response 생성하되, 총계 정보를 포함
                    BudgetDTO.Response response = BudgetDTO.Response.from(representativeBudget);
                    response.setPlannedAmount(totalPlanned);
                    response.setActualAmount(totalActual);
                    response.setRemainingBudget(totalPlanned.subtract(totalActual));
                    
                    return response;
                })
                .collect(Collectors.toList());
    }
}
