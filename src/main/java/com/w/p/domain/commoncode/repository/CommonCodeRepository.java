package com.w.p.domain.commoncode.repository;

import com.w.p.entity.CommonCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 공통코드 리포지토리
 */
@Repository
public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {

    /**
     * 코드 그룹으로 활성화된 코드 목록 조회 (정렬 순서대로)
     */
    @Query("SELECT c FROM CommonCode c WHERE c.codeGroup = :codeGroup AND c.isActive = true ORDER BY c.sortOrder ASC, c.codeName ASC")
    List<CommonCode> findByCodeGroupAndActiveOrderBySortOrder(@Param("codeGroup") String codeGroup);

    /**
     * 코드 그룹으로 모든 코드 목록 조회 (정렬 순서대로)
     */
    @Query("SELECT c FROM CommonCode c WHERE c.codeGroup = :codeGroup ORDER BY c.sortOrder ASC, c.codeName ASC")
    List<CommonCode> findByCodeGroupOrderBySortOrder(@Param("codeGroup") String codeGroup);

    /**
     * 코드 그룹과 코드값으로 조회
     */
    Optional<CommonCode> findByCodeGroupAndCodeValue(String codeGroup, String codeValue);

    /**
     * 코드 그룹과 코드값으로 활성화된 코드 조회
     */
    Optional<CommonCode> findByCodeGroupAndCodeValueAndIsActiveTrue(String codeGroup, String codeValue);

    /**
     * 코드 그룹과 코드명으로 조회
     */
    Optional<CommonCode> findByCodeGroupAndCodeName(String codeGroup, String codeName);

    /**
     * 코드 그룹과 코드명으로 활성화된 코드 조회
     */
    Optional<CommonCode> findByCodeGroupAndCodeNameAndIsActiveTrue(String codeGroup, String codeName);

    /**
     * 코드 그룹 존재 여부 확인
     */
    boolean existsByCodeGroup(String codeGroup);

    /**
     * 코드 그룹과 코드값 조합의 중복 확인
     */
    boolean existsByCodeGroupAndCodeValue(String codeGroup, String codeValue);

    /**
     * 코드명으로 검색 (부분 일치)
     */
    @Query("SELECT c FROM CommonCode c WHERE c.codeName LIKE %:codeName% AND c.isActive = true ORDER BY c.sortOrder ASC, c.codeName ASC")
    List<CommonCode> findByCodeNameContainingAndActive(@Param("codeName") String codeName);

    /**
     * 코드 그룹과 코드명으로 검색 (부분 일치)
     */
    @Query("SELECT c FROM CommonCode c WHERE c.codeGroup = :codeGroup AND c.codeName LIKE %:codeName% AND c.isActive = true ORDER BY c.sortOrder ASC, c.codeName ASC")
    List<CommonCode> findByCodeGroupAndCodeNameContainingAndActive(@Param("codeGroup") String codeGroup, @Param("codeName") String codeName);

    /**
     * 부모 코드로 하위 코드 목록 조회
     */
    @Query("SELECT c FROM CommonCode c WHERE c.parent.id = :parentId AND c.isActive = true ORDER BY c.sortOrder ASC, c.codeName ASC")
    List<CommonCode> findByParentIdAndActive(@Param("parentId") Long parentId);

    /**
     * 최상위 코드 목록 조회 (부모가 없는 코드들)
     */
    @Query("SELECT c FROM CommonCode c WHERE c.parent IS NULL AND c.isActive = true ORDER BY c.sortOrder ASC, c.codeName ASC")
    List<CommonCode> findTopLevelCodes();

    /**
     * 모든 활성화된 코드 그룹 목록 조회
     */
    @Query("SELECT DISTINCT c.codeGroup FROM CommonCode c WHERE c.isActive = true ORDER BY c.codeGroup ASC")
    List<String> findAllActiveCodeGroups();

    /**
     * 코드 그룹별 활성화된 코드 개수 조회
     */
    @Query("SELECT COUNT(c) FROM CommonCode c WHERE c.codeGroup = :codeGroup AND c.isActive = true")
    Long countByCodeGroupAndIsActiveTrue(@Param("codeGroup") String codeGroup);
}
