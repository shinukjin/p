package com.w.p.dto.admin;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 관리자용 결혼식장 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeddingHallDTO {

    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private Integer capacity;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private String status; // active, inactive
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 추가 필드들
    private String website;
    private String hallType;
    private BigDecimal rating;
    private String parkingInfo;
    private String facilities;
    private String memo;
    private Long userId;
    private String userName;
}
