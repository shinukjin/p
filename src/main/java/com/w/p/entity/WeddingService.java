package com.w.p.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 스드메(스튜디오/드레스/메이크업) 정보 엔티티
 */
@Entity
@Table(name = "WP_WEDDING_SERVICES")
@Getter
@Setter
@NoArgsConstructor
public class WeddingService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 업체명

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ServiceType serviceType; // 서비스 타입

    @Column(nullable = false)
    private String address; // 주소

    @Column
    private String phone; // 전화번호

    @Column
    private String website; // 웹사이트

    @Column
    private BigDecimal price; // 가격

    @Column(length = 1000)
    private String description; // 설명

    @Column
    private String imageUrl; // 대표 이미지 URL

    @Column
    private BigDecimal rating; // 평점

    @Column
    private String portfolio; // 포트폴리오 URL (JSON 배열)

    @Column
    private String specialties; // 전문 분야 (JSON 배열)

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

    public enum ServiceType {
        STUDIO("스튜디오"),
        DRESS("드레스"),
        MAKEUP("메이크업");

        private final String displayName;

        ServiceType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public WeddingService(String name, ServiceType serviceType, String address, User user) {
        this.name = name;
        this.serviceType = serviceType;
        this.address = address;
        this.user = user;
    }
}
