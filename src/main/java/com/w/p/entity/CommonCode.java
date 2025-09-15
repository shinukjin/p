package com.w.p.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 공통코드 엔티티
 * 시스템에서 사용하는 모든 공통코드를 관리
 */
@Entity
@Table(name = "common_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class CommonCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 코드 그룹 코드 (예: 001, 002, 003 등)
     */
    @Column(name = "code_group", nullable = false, length = 50)
    private String codeGroup;

    /**
     * 코드값 (예: 11680, A1, B1 등)
     */
    @Column(name = "code_value", nullable = false, length = 50)
    private String codeValue;

    /**
     * 코드명 (예: 강남구, 매매, 전세 등)
     */
    @Column(name = "code_name", nullable = false, length = 100)
    private String codeName;

    /**
     * 코드 설명
     */
    @Column(name = "description", length = 500)
    private String description;

    /**
     * 정렬 순서
     */
    @Column(name = "sort_order")
    private Integer sortOrder;

    /**
     * 사용 여부
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * 부모 코드 ID (계층 구조 지원)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private CommonCode parent;

    /**
     * 생성일시
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 수정일시
     */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 생성자
     */
    @Column(name = "created_by", length = 50)
    private String createdBy;

    /**
     * 수정자
     */
    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    /**
     * 코드 그룹 코드 상수
     * 실제 의미는 숨기고 코드값으로만 관리
     */
    public static class CodeGroup {
        public static final String REGION = "001";           // 지역코드
        public static final String PROPERTY_TYPE = "002";    // 부동산 유형
        public static final String TRANSACTION_TYPE = "003"; // 거래 유형
        public static final String LOG_LEVEL = "004";        // 로그 레벨
        public static final String USER_STATUS = "005";      // 사용자 상태
        public static final String USER_ROLE = "006";        // 사용자 역할
        public static final String SYSTEM_CONFIG = "007";    // 시스템 설정
    }

    /**
     * 코드 생성 편의 메서드
     */
    public static CommonCode of(String codeGroup, String codeValue, String codeName) {
        return CommonCode.builder()
                .codeGroup(codeGroup)
                .codeValue(codeValue)
                .codeName(codeName)
                .isActive(true)
                .build();
    }

    /**
     * 코드 생성 편의 메서드 (정렬 순서 포함)
     */
    public static CommonCode of(String codeGroup, String codeValue, String codeName, Integer sortOrder) {
        return CommonCode.builder()
                .codeGroup(codeGroup)
                .codeValue(codeValue)
                .codeName(codeName)
                .sortOrder(sortOrder)
                .isActive(true)
                .build();
    }

    /**
     * 코드 생성 편의 메서드 (설명 포함)
     */
    public static CommonCode of(String codeGroup, String codeValue, String codeName, String description, Integer sortOrder) {
        return CommonCode.builder()
                .codeGroup(codeGroup)
                .codeValue(codeValue)
                .codeName(codeName)
                .description(description)
                .sortOrder(sortOrder)
                .isActive(true)
                .build();
    }
}
