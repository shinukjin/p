package com.w.p.domain.commoncode.service;

import com.w.p.domain.commoncode.dto.CommonCodeDTO;
import com.w.p.domain.commoncode.repository.CommonCodeRepository;
import com.w.p.entity.CommonCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 공통코드 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CommonCodeService {

    private final CommonCodeRepository commonCodeRepository;

    /**
     * 코드 그룹으로 활성화된 코드 목록 조회
     */
    public List<CommonCodeDTO.SimpleCodeInfo> getActiveCodesByGroup(String codeGroup) {
        log.debug("코드 그룹으로 활성화된 코드 목록 조회: {}", codeGroup);
        
        List<CommonCode> codes = commonCodeRepository.findByCodeGroupAndActiveOrderBySortOrder(codeGroup);
        return CommonCodeDTO.SimpleCodeInfo.fromList(codes);
    }

    /**
     * 코드 그룹으로 모든 코드 목록 조회 (관리자용)
     */
    public List<CommonCodeDTO> getAllCodesByGroup(String codeGroup) {
        log.debug("코드 그룹으로 모든 코드 목록 조회: {}", codeGroup);
        
        List<CommonCode> codes = commonCodeRepository.findByCodeGroupOrderBySortOrder(codeGroup);
        return CommonCodeDTO.fromList(codes);
    }

    /**
     * 코드 그룹과 코드값으로 코드 조회
     */
    public Optional<CommonCodeDTO> getCodeByGroupAndValue(String codeGroup, String codeValue) {
        log.debug("코드 조회: group={}, value={}", codeGroup, codeValue);
        
        return commonCodeRepository.findByCodeGroupAndCodeValueAndIsActiveTrue(codeGroup, codeValue)
                .map(CommonCodeDTO::from);
    }

    /**
     * 코드 그룹과 코드명으로 코드 조회
     */
    public Optional<CommonCodeDTO> getCodeByGroupAndName(String codeGroup, String codeName) {
        log.debug("코드 조회: group={}, name={}", codeGroup, codeName);
        
        return commonCodeRepository.findByCodeGroupAndCodeNameAndIsActiveTrue(codeGroup, codeName)
                .map(CommonCodeDTO::from);
    }

    /**
     * 코드명으로 검색 (부분 일치)
     */
    public List<CommonCodeDTO.SimpleCodeInfo> searchCodesByName(String codeName) {
        log.debug("코드명으로 검색: {}", codeName);
        
        List<CommonCode> codes = commonCodeRepository.findByCodeNameContainingAndActive(codeName);
        return CommonCodeDTO.SimpleCodeInfo.fromList(codes);
    }

    /**
     * 코드 그룹과 코드명으로 검색 (부분 일치)
     */
    public List<CommonCodeDTO.SimpleCodeInfo> searchCodesByGroupAndName(String codeGroup, String codeName) {
        log.debug("코드 검색: group={}, name={}", codeGroup, codeName);
        
        List<CommonCode> codes = commonCodeRepository.findByCodeGroupAndCodeNameContainingAndActive(codeGroup, codeName);
        return CommonCodeDTO.SimpleCodeInfo.fromList(codes);
    }

    /**
     * 부모 코드로 하위 코드 목록 조회
     */
    public List<CommonCodeDTO.SimpleCodeInfo> getChildCodes(Long parentId) {
        log.debug("하위 코드 목록 조회: parentId={}", parentId);
        
        List<CommonCode> codes = commonCodeRepository.findByParentIdAndActive(parentId);
        return CommonCodeDTO.SimpleCodeInfo.fromList(codes);
    }

    /**
     * 최상위 코드 목록 조회
     */
    public List<CommonCodeDTO.SimpleCodeInfo> getTopLevelCodes() {
        log.debug("최상위 코드 목록 조회");
        
        List<CommonCode> codes = commonCodeRepository.findTopLevelCodes();
        return CommonCodeDTO.SimpleCodeInfo.fromList(codes);
    }

    /**
     * 모든 활성화된 코드 그룹 목록 조회
     */
    public List<CommonCodeDTO.CodeGroupInfo> getAllActiveCodeGroups() {
        log.debug("활성화된 코드 그룹 목록 조회");
        
        List<String> groups = commonCodeRepository.findAllActiveCodeGroups();
        return groups.stream()
                .map(group -> {
                    Long count = commonCodeRepository.countByCodeGroupAndIsActiveTrue(group);
                    String description = getCodeGroupDescription(group);
                    return CommonCodeDTO.CodeGroupInfo.of(group, description, count);
                })
                .collect(Collectors.toList());
    }

    /**
     * 코드 그룹 설명 조회
     */
    private String getCodeGroupDescription(String codeGroup) {
        switch (codeGroup) {
            case "001": return "지역코드";
            case "002": return "부동산 유형";
            case "003": return "거래 유형";
            case "004": return "로그 레벨";
            case "005": return "사용자 상태";
            case "006": return "사용자 역할";
            default: return "기타";
        }
    }

    /**
     * 코드 생성
     */
    @Transactional
    public CommonCodeDTO createCode(CommonCodeDTO.CreateRequest request) {
        log.debug("코드 생성: {}", request);

        // 중복 검사
        if (commonCodeRepository.existsByCodeGroupAndCodeValue(request.getCodeGroup(), request.getCodeValue())) {
            throw new IllegalArgumentException("이미 존재하는 코드입니다: " + request.getCodeGroup() + " - " + request.getCodeValue());
        }

        // 부모 코드 조회
        CommonCode parent = null;
        if (request.getParentId() != null) {
            parent = commonCodeRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 코드를 찾을 수 없습니다: " + request.getParentId()));
        }

        // 코드 생성
        CommonCode code = CommonCode.builder()
                .codeGroup(request.getCodeGroup())
                .codeValue(request.getCodeValue())
                .codeName(request.getCodeName())
                .description(request.getDescription())
                .sortOrder(request.getSortOrder())
                .parent(parent)
                .isActive(true)
                .build();

        CommonCode savedCode = commonCodeRepository.save(code);
        return CommonCodeDTO.from(savedCode);
    }

    /**
     * 코드 수정
     */
    @Transactional
    public CommonCodeDTO updateCode(Long codeId, CommonCodeDTO.UpdateRequest request) {
        log.debug("코드 수정: id={}, request={}", codeId, request);

        CommonCode code = commonCodeRepository.findById(codeId)
                .orElseThrow(() -> new IllegalArgumentException("코드를 찾을 수 없습니다: " + codeId));

        // 부모 코드 조회
        CommonCode parent = null;
        if (request.getParentId() != null) {
            parent = commonCodeRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 코드를 찾을 수 없습니다: " + request.getParentId()));
        }

        // 코드 수정
        if (request.getCodeName() != null) {
            code.setCodeName(request.getCodeName());
        }
        if (request.getDescription() != null) {
            code.setDescription(request.getDescription());
        }
        if (request.getSortOrder() != null) {
            code.setSortOrder(request.getSortOrder());
        }
        if (request.getIsActive() != null) {
            code.setIsActive(request.getIsActive());
        }
        if (request.getParentId() != null) {
            code.setParent(parent);
        }

        CommonCode savedCode = commonCodeRepository.save(code);
        return CommonCodeDTO.from(savedCode);
    }

    /**
     * 코드 삭제 (비활성화)
     */
    @Transactional
    public void deactivateCode(Long codeId) {
        log.debug("코드 비활성화: id={}", codeId);

        CommonCode code = commonCodeRepository.findById(codeId)
                .orElseThrow(() -> new IllegalArgumentException("코드를 찾을 수 없습니다: " + codeId));

        code.setIsActive(false);
        commonCodeRepository.save(code);
    }

    /**
     * 코드 완전 삭제
     */
    @Transactional
    public void deleteCode(Long codeId) {
        log.debug("코드 삭제: id={}", codeId);

        if (!commonCodeRepository.existsById(codeId)) {
            throw new IllegalArgumentException("코드를 찾을 수 없습니다: " + codeId);
        }

        commonCodeRepository.deleteById(codeId);
    }

    /**
     * 지역코드 목록 조회 (기존 ApartmentController 호환성)
     */
    public List<CommonCodeDTO.SimpleCodeInfo> getRegionCodes() {
        return getActiveCodesByGroup(CommonCode.CodeGroup.REGION);
    }
}
