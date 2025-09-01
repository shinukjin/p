package com.w.p.domain.realestate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.w.p.entity.RealEstate;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

/**
 * 부동산 DTO
 */
@Data
@NoArgsConstructor
public class RealEstateDTO {

    private Long id;
    private String title;
    private RealEstate.PropertyType propertyType;
    private RealEstate.TransactionType transactionType;
    private String address;
    private String detailAddress;
    private Double latitude;
    private Double longitude;
    private Long price;
    private Long monthlyRent;
    private Long deposit;
    private Double area;
    private Integer rooms;
    private Integer bathrooms;
    private Integer floor;
    private Integer totalFloors;
    private String buildingType;
    private Integer buildYear;
    private String description;
    private String imageUrl;
    private String images;
    private String facilities;
    private String transportation;
    private Boolean isBookmarked;
    private String memo;
    private String contactInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * 등록/수정 요청 DTO
     */
    @Data
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CreateRequest {
        private String title;
        private String propertyType; // String으로 받아서 Enum으로 변환
        private String transactionType; // String으로 받아서 Enum으로 변환
        private String address;
        private String detailAddress;
        private String latitude; // String으로 받아서 Double로 변환
        private String longitude; // String으로 받아서 Double로 변환
        private String price; // String으로 받아서 Long으로 변환 (원 단위)
        private String monthlyRent; // String으로 받아서 Long으로 변환 (원 단위)
        private String deposit; // String으로 받아서 Long으로 변환 (원 단위)
        private String area; // String으로 받아서 Double로 변환
        private String rooms; // String으로 받아서 Integer로 변환
        private String bathrooms; // String으로 받아서 Integer로 변환
        private String parking; // 프론트엔드에 있는 필드 추가
        private String floor; // String으로 받아서 Integer로 변환
        private String totalFloors; // String으로 받아서 Integer로 변환
        private String yearBuilt; // buildYear -> yearBuilt로 변경
        private String description;
        private String contactName; // 프론트엔드에 있는 필드 추가
        private String contactPhone; // 프론트엔드에 있는 필드 추가
        private String contactEmail; // 프론트엔드에 있는 필드 추가
        private MultipartFile[] images; // 이미지 파일 배열
        
    }

    /**
     * 검색 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class SearchRequest {
        private String keyword;
        private RealEstate.PropertyType propertyType;
        private RealEstate.TransactionType transactionType;
        private Boolean isBookmarked;
    }

    /**
     * Entity를 DTO로 변환
     */
    public static RealEstateDTO from(RealEstate entity) {
        if (entity == null) {
            return null;
        }
        
        RealEstateDTO dto = new RealEstateDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setPropertyType(entity.getPropertyType());
        dto.setTransactionType(entity.getTransactionType());
        dto.setAddress(entity.getAddress());
        dto.setDetailAddress(entity.getDetailAddress());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setPrice(entity.getPrice());
        dto.setMonthlyRent(entity.getMonthlyRent());
        dto.setDeposit(entity.getDeposit());
        dto.setArea(entity.getArea());
        dto.setRooms(entity.getRooms());
        dto.setBathrooms(entity.getBathrooms());
        dto.setFloor(entity.getFloor());
        dto.setTotalFloors(entity.getTotalFloors());
        dto.setBuildingType(entity.getBuildingType());
        dto.setBuildYear(entity.getBuildYear());
        dto.setDescription(entity.getDescription());
        dto.setImageUrl(entity.getImageUrl());
        
        // images JSON 문자열을 배열로 변환
        if (entity.getImages() != null && !entity.getImages().trim().isEmpty()) {
            try {
                // JSON 배열 형태로 저장된 이미지 URL들을 String 배열로 파싱
                ObjectMapper objectMapper = new ObjectMapper();
                String[] imageUrls = objectMapper.readValue(entity.getImages(), String[].class);
                dto.setImages(imageUrls);
            } catch (Exception e) {
                // JSON 파싱 실패 시 빈 배열로 설정
                dto.setImages(new String[0]);
            }
        } else {
            dto.setImages(new String[0]);
        }
        
        dto.setFacilities(entity.getFacilities());
        dto.setTransportation(entity.getTransportation());
        dto.setIsBookmarked(entity.getIsBookmarked());
        dto.setMemo(entity.getMemo());
        dto.setContactInfo(entity.getContactInfo());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
