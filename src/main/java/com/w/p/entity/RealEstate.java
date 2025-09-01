package com.w.p.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 부동산 정보 엔티티
 */
@Entity
@Table(name = "WP_REAL_ESTATES")
@Getter
@Setter
@NoArgsConstructor
public class RealEstate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // 매물명

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType; // 매물 타입

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType; // 거래 타입

    @Column(nullable = false)
    private String address; // 주소

    @Column
    private String detailAddress; // 상세 주소

    @Column
    private Double latitude; // 위도 (네이버 지도 API용)

    @Column
    private Double longitude; // 경도 (네이버 지도 API용)

    @Column
    private Long price; // 가격 (매매가/전세가) - 원 단위

    @Column
    private Long monthlyRent; // 월세 (전세/월세인 경우) - 원 단위

    @Column
    private Long deposit; // 보증금 - 원 단위

    @Column
    private Double area; // 면적 (평수)

    @Column
    private Integer rooms; // 방 개수

    @Column
    private Integer bathrooms; // 화장실 개수

    @Column
    private Integer floor; // 층수

    @Column
    private Integer totalFloors; // 총 층수

    @Column
    private String buildingType; // 건물 타입 (아파트, 빌라, 오피스텔 등)

    @Column
    private Integer buildYear; // 건축년도

    @Column(length = 1000)
    private String description; // 설명

    @Column
    private String imageUrl; // 대표 이미지 URL

    @Column
    private String images; // 추가 이미지들 (JSON 배열)

    @Column
    private String facilities; // 편의시설 (JSON 배열)

    @Column
    private String transportation; // 교통 정보

    @Column
    private Boolean isBookmarked = false; // 북마크 여부

    @Column
    private String memo; // 개인 메모

    @Column
    private String contactInfo; // 연락처 정보

    @Column
    private Integer parking; // 주차 정보

    @Column
    private String contactName; // 연락처 이름

    @Column
    private String contactPhone; // 연락처 전화번호

    @Column
    private String contactEmail; // 연락처 이메일

    @Column
    private Boolean isAvailable; // 매물 상태 (true: 판매중, false: 판매완료)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 등록한 사용자

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PropertyType {
        APARTMENT("아파트"),
        VILLA("빌라"),
        OFFICETEL("오피스텔"),
        HOUSE("단독주택"),
        STUDIO("원룸");

        private final String displayName;

        PropertyType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum TransactionType {
        SALE("매매"),
        JEONSE("전세"),
        MONTHLY_RENT("월세");

        private final String displayName;

        TransactionType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public RealEstate(String title, PropertyType propertyType, TransactionType transactionType, String address, User user) {
        this.title = title;
        this.propertyType = propertyType;
        this.transactionType = transactionType;
        this.address = address;
        this.user = user;
    }
}
