package com.w.p.domain.commoncode.dto;

import com.w.p.entity.CommonCode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 공통코드 DTO
 */
@Data
@NoArgsConstructor
public class CommonCodeDTO {

    private Long id;
    private String codeGroup;
    private String codeValue;
    private String codeName;
    private String description;
    private Integer sortOrder;
    private Boolean isActive;
    private Long parentId;
    private String parentCodeName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    /**
     * Entity를 DTO로 변환
     */
    public static CommonCodeDTO from(CommonCode entity) {
        if (entity == null) {
            return null;
        }

        CommonCodeDTO dto = new CommonCodeDTO();
        dto.setId(entity.getId());
        dto.setCodeGroup(entity.getCodeGroup());
        dto.setCodeValue(entity.getCodeValue());
        dto.setCodeName(entity.getCodeName());
        dto.setDescription(entity.getDescription());
        dto.setSortOrder(entity.getSortOrder());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setUpdatedBy(entity.getUpdatedBy());

        // 부모 코드 정보 설정
        if (entity.getParent() != null) {
            dto.setParentId(entity.getParent().getId());
            dto.setParentCodeName(entity.getParent().getCodeName());
        }

        return dto;
    }

    /**
     * Entity 리스트를 DTO 리스트로 변환
     */
    public static List<CommonCodeDTO> fromList(List<CommonCode> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
                .map(CommonCodeDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * 생성 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class CreateRequest {
        private String codeGroup;
        private String codeValue;
        private String codeName;
        private String description;
        private Integer sortOrder;
        private Long parentId;
    }

    /**
     * 수정 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class UpdateRequest {
        private String codeName;
        private String description;
        private Integer sortOrder;
        private Boolean isActive;
        private Long parentId;
    }

    /**
     * 검색 요청 DTO
     */
    @Data
    @NoArgsConstructor
    public static class SearchRequest {
        private String codeGroup;
        private String codeName;
        private Boolean isActive;
        private Long parentId;
    }

    /**
     * 간단한 코드 정보 DTO (API 응답용)
     */
    @Data
    @NoArgsConstructor
    public static class SimpleCodeInfo {
        private String code;
        private String name;
        private String description;
        private Integer sortOrder;

        public static SimpleCodeInfo from(CommonCode entity) {
            if (entity == null) {
                return null;
            }

            SimpleCodeInfo dto = new SimpleCodeInfo();
            dto.setCode(entity.getCodeValue());
            dto.setName(entity.getCodeName());
            dto.setDescription(entity.getDescription());
            dto.setSortOrder(entity.getSortOrder());
            return dto;
        }

        public static List<SimpleCodeInfo> fromList(List<CommonCode> entities) {
            if (entities == null) {
                return List.of();
            }

            return entities.stream()
                    .map(SimpleCodeInfo::from)
                    .collect(Collectors.toList());
        }
    }

    /**
     * 코드 그룹 정보 DTO
     */
    @Data
    @NoArgsConstructor
    public static class CodeGroupInfo {
        private String codeGroup;
        private String description;
        private Long codeCount;

        public static CodeGroupInfo of(String codeGroup, String description, Long codeCount) {
            CodeGroupInfo info = new CodeGroupInfo();
            info.setCodeGroup(codeGroup);
            info.setDescription(description);
            info.setCodeCount(codeCount);
            return info;
        }
    }
}
