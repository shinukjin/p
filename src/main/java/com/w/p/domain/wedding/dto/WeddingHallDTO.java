package com.w.p.domain.wedding.dto;

import com.w.p.entity.WeddingHall;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WeddingHallDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String name;
        private String address;
        private String phone;
        private String email;
        private BigDecimal price;
        private Integer capacity;
        private String description;
        private String facilities;
        private String parkingInfo;
        private String website;
        private String imageUrl;
        private Boolean isBookmarked;
        private String memo;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private String address;
        private String phone;
        private String email;
        private BigDecimal price;
        private Integer capacity;
        private String description;
        private String facilities;
        private String parkingInfo;
        private String website;
        private String imageUrl;
        private Boolean isBookmarked;
        private String memo;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public static Response from(WeddingHall weddingHall) {
            return Response.builder()
                    .id(weddingHall.getId())
                    .name(weddingHall.getName())
                    .address(weddingHall.getAddress())
                    .phone(weddingHall.getPhone())
                    .email(null) // WeddingHall 엔티티에 email 필드가 없음
                    .price(weddingHall.getPricePerTable()) // pricePerTable로 변경
                    .capacity(weddingHall.getCapacity())
                    .description(weddingHall.getDescription())
                    .facilities(weddingHall.getFacilities())
                    .parkingInfo(weddingHall.getParkingInfo())
                    .website(weddingHall.getWebsite())
                    .imageUrl(weddingHall.getImageUrl())
                    .isBookmarked(weddingHall.getIsBookmarked())
                    .memo(weddingHall.getMemo())
                    .createdAt(weddingHall.getCreatedAt())
                    .updatedAt(weddingHall.getUpdatedAt())
                    .build();
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Update {
        private String name;
        private String address;
        private String phone;
        private String email;
        private BigDecimal price;
        private Integer capacity;
        private String description;
        private String facilities;
        private String parkingInfo;
        private String website;
        private String imageUrl;
        private Boolean isBookmarked;
        private String memo;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchRequest {
        private String keyword;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private Integer minCapacity;
        private Integer maxCapacity;
        private String location;
        private Boolean isBookmarked;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private java.util.List<Response> weddingHalls;
        private int totalCount;
        private int bookmarkedCount;
        private BigDecimal averagePrice;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuoteRequest {
        private String eventDate;
        private Integer guestCount;
        private String specialRequirements;
        private String contactName;
        private String contactPhone;
        private String contactEmail;
        private String message;
    }
}
