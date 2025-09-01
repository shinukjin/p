package com.w.p.domain.budget.repository;

import com.w.p.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    // 사용자별 예산 목록 조회
    List<Budget> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 카테고리별 예산 목록 조회
    List<Budget> findByUserIdAndCategoryOrderByCreatedAtDesc(Long userId, String category);
    
    // 상태별 예산 목록 조회
    List<Budget> findByUserIdAndStatusOrderByDueDateAsc(Long userId, Budget.BudgetStatus status);
    
    // 우선순위별 예산 목록 조회
    List<Budget> findByUserIdAndPriorityOrderByDueDateAsc(Long userId, Budget.Priority priority);
    
    // 기한이 임박한 예산 조회 (7일 이내)
    @Query("SELECT b FROM Budget b WHERE b.userId = :userId AND b.dueDate BETWEEN :now AND :weekLater AND b.status IN ('PLANNED', 'IN_PROGRESS') ORDER BY b.dueDate ASC")
    List<Budget> findUpcomingBudgets(@Param("userId") Long userId, 
                                   @Param("now") LocalDateTime now, 
                                   @Param("weekLater") LocalDateTime weekLater);
    
    // 예산 초과 항목 조회
    @Query("SELECT b FROM Budget b WHERE b.userId = :userId AND b.actualAmount > b.plannedAmount ORDER BY b.actualAmount - b.plannedAmount DESC")
    List<Budget> findOverBudgetItems(@Param("userId") Long userId);
    
    // 카테고리별 총 예산 조회
    @Query("SELECT SUM(b.plannedAmount) FROM Budget b WHERE b.userId = :userId AND b.category = :category")
    BigDecimal getTotalPlannedAmountByCategory(@Param("userId") Long userId, @Param("category") String category);
    
    // 카테고리별 실제 지출 조회
    @Query("SELECT SUM(b.actualAmount) FROM Budget b WHERE b.userId = :userId AND b.category = :category")
    BigDecimal getTotalActualAmountByCategory(@Param("userId") Long userId, @Param("category") String category);
    
    // 전체 예산 총액
    @Query("SELECT SUM(b.plannedAmount) FROM Budget b WHERE b.userId = :userId")
    BigDecimal getTotalPlannedAmount(@Param("userId") Long userId);
    
    // 전체 실제 지출 총액
    @Query("SELECT SUM(b.actualAmount) FROM Budget b WHERE b.userId = :userId")
    BigDecimal getTotalActualAmount(@Param("userId") Long userId);
    
    // 카테고리별 예산 통계
    @Query("SELECT b.category, COUNT(b), SUM(b.plannedAmount), SUM(b.actualAmount) FROM Budget b WHERE b.userId = :userId GROUP BY b.category")
    List<Object[]> getBudgetStatsByCategory(@Param("userId") Long userId);
}
