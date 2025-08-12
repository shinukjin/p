package com.w.p.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 결혼식장 정보 엔티티
 */
@Entity
@Table(name = "WP_WEDDING_HALLS")
@Getter
@Setter
@NoArgsConstructor
public class WeddingHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 식장명

    @Column(nullable = false)
    private String address; // 주소

    @Column
    private String phone; // 전화번호

    @Column
    private String website; // 웹사이트

    @Column
    private BigDecimal pricePerTable; // 테이블당 가격

    @Column
    private Integer capacity; // 수용인원

    @Column
    private String hallType; // 홀 타입 (컨벤션, 호텔, 하우스웨딩 등)

    @Column(length = 1000)
    private String description; // 설명

    @Column
    private String imageUrl; // 대표 이미지 URL

    @Column
    private BigDecimal rating; // 평점

    @Column
    private String parkingInfo; // 주차 정보

    @Column
    private String facilities; // 부대시설 (JSON 형태로 저장)

    @Column
    private Boolean isBookmarked = false; // 북마크 여부

    @Column
    private String memo; // 개인 메모

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

    public WeddingHall(String name, String address, User user) {
        this.name = name;
        this.address = address;
        this.user = user;
    }
}
