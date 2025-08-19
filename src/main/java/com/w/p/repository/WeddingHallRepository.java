package com.w.p.repository;

import com.w.p.entity.WeddingHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 결혼식장 Repository
 */
@Repository
public interface WeddingHallRepository extends JpaRepository<WeddingHall, Long> {

    /**
     * 활성 상태의 결혼식장 목록 조회
     */
    List<WeddingHall> findByStatusOrderByCreatedAtDesc(String status);

    /**
     * 이름으로 검색
     */
    List<WeddingHall> findByNameContainingIgnoreCase(String name);

    /**
     * 주소로 검색
     */
    List<WeddingHall> findByAddressContainingIgnoreCase(String address);

    /**
     * 사용자별 결혼식장 목록 조회
     */
    List<WeddingHall> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * 활성 상태의 사용자별 결혼식장 목록 조회
     */
    List<WeddingHall> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);

    /**
     * 복합 검색 (이름 또는 주소)
     */
    @Query("SELECT w FROM WeddingHall w WHERE LOWER(w.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(w.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<WeddingHall> findByNameOrAddressContainingIgnoreCase(@Param("keyword") String keyword);

    /**
     * 활성 상태의 복합 검색 (이름 또는 주소)
     */
    @Query("SELECT w FROM WeddingHall w WHERE w.status = 'active' AND (LOWER(w.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(w.address) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<WeddingHall> findActiveByNameOrAddressContainingIgnoreCase(@Param("keyword") String keyword);

    /**
     * 총 결혼식장 수 조회
     */
    @Query("SELECT COUNT(w) FROM WeddingHall w")
    long countAllWeddingHalls();

    /**
     * 활성 결혼식장 수 조회
     */
    @Query("SELECT COUNT(w) FROM WeddingHall w WHERE w.status = 'active'")
    long countActiveWeddingHalls();

    /**
     * 비활성 결혼식장 수 조회
     */
    @Query("SELECT COUNT(w) FROM WeddingHall w WHERE w.status = 'inactive'")
    long countInactiveWeddingHalls();

    /**
     * 삭제된 결혼식장 수 조회
     */
    @Query("SELECT COUNT(w) FROM WeddingHall w WHERE w.status = 'deleted'")
    long countDeletedWeddingHalls();
}
