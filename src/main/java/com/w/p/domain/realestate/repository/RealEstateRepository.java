package com.w.p.domain.realestate.repository;

import com.w.p.entity.RealEstate;
import com.w.p.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 부동산 정보 리포지토리
 */
@Repository
public interface RealEstateRepository extends JpaRepository<RealEstate, Long> {

    /**
     * 사용자별 부동산 목록 조회
     */
    List<RealEstate> findByUserOrderByCreatedAtDesc(User user);

    /**
     * 제목으로 검색
     */
    @Query("SELECT r FROM RealEstate r WHERE r.user = :user AND r.title LIKE %:keyword%")
    List<RealEstate> findByUserAndTitleContaining(@Param("user") User user, @Param("keyword") String keyword);

    /**
     * 주소로 검색
     */
    @Query("SELECT r FROM RealEstate r WHERE r.user = :user AND r.address LIKE %:keyword%")
    List<RealEstate> findByUserAndAddressContaining(@Param("user") User user, @Param("keyword") String keyword);

    /**
     * 매물 타입별 검색
     */
    List<RealEstate> findByUserAndPropertyTypeOrderByCreatedAtDesc(User user, RealEstate.PropertyType propertyType);

    /**
     * 거래 타입별 검색
     */
    List<RealEstate> findByUserAndTransactionTypeOrderByCreatedAtDesc(User user, RealEstate.TransactionType transactionType);

    /**
     * 북마크된 매물 조회
     */
    List<RealEstate> findByUserAndIsBookmarkedTrueOrderByCreatedAtDesc(User user);
}
