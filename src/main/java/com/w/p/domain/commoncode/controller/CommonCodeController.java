package com.w.p.domain.commoncode.controller;

import com.w.p.common.ApiResponse;
import com.w.p.domain.commoncode.dto.CommonCodeDTO;
import com.w.p.domain.commoncode.service.CommonCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 공통코드 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/common-codes")
@RequiredArgsConstructor
@Slf4j
public class CommonCodeController {

    private final CommonCodeService commonCodeService;

    /**
     * 코드 그룹으로 활성화된 코드 목록 조회
     */
    @GetMapping("/{codeGroup}")
    public ApiResponse<List<CommonCodeDTO.SimpleCodeInfo>> getActiveCodesByGroup(
            @PathVariable String codeGroup) {
        try {
            List<CommonCodeDTO.SimpleCodeInfo> codes = commonCodeService.getActiveCodesByGroup(codeGroup);
            return ApiResponse.success(codes, "코드 목록 조회 성공");
        } catch (Exception e) {
            log.error("코드 목록 조회 중 오류 발생: codeGroup={}", codeGroup, e);
            return ApiResponse.error("조회 실패", "코드 목록을 불러오는데 실패했습니다.");
        }
    }

    /**
     * 코드 그룹으로 모든 코드 목록 조회 (관리자용)
     */
    @GetMapping("/{codeGroup}/all")
    public ApiResponse<List<CommonCodeDTO>> getAllCodesByGroup(
            @PathVariable String codeGroup) {
        try {
            List<CommonCodeDTO> codes = commonCodeService.getAllCodesByGroup(codeGroup);
            return ApiResponse.success(codes, "코드 목록 조회 성공");
        } catch (Exception e) {
            log.error("코드 목록 조회 중 오류 발생: codeGroup={}", codeGroup, e);
            return ApiResponse.error("조회 실패", "코드 목록을 불러오는데 실패했습니다.");
        }
    }

    /**
     * 코드 그룹과 코드값으로 코드 조회
     */
    @GetMapping("/{codeGroup}/{codeValue}")
    public ApiResponse<CommonCodeDTO> getCodeByGroupAndValue(
            @PathVariable String codeGroup,
            @PathVariable String codeValue) {
        try {
            return commonCodeService.getCodeByGroupAndValue(codeGroup, codeValue)
                    .map(code -> ApiResponse.success(code, "코드 조회 성공"))
                    .orElse(ApiResponse.error("조회 실패", "코드를 찾을 수 없습니다."));
        } catch (Exception e) {
            log.error("코드 조회 중 오류 발생: codeGroup={}, codeValue={}", codeGroup, codeValue, e);
            return ApiResponse.error("조회 실패", "코드 조회에 실패했습니다.");
        }
    }

    /**
     * 코드명으로 검색
     */
    @GetMapping("/search")
    public ApiResponse<List<CommonCodeDTO.SimpleCodeInfo>> searchCodesByName(
            @RequestParam String codeName) {
        try {
            List<CommonCodeDTO.SimpleCodeInfo> codes = commonCodeService.searchCodesByName(codeName);
            return ApiResponse.success(codes, "코드 검색 성공");
        } catch (Exception e) {
            log.error("코드 검색 중 오류 발생: codeName={}", codeName, e);
            return ApiResponse.error("검색 실패", "코드 검색에 실패했습니다.");
        }
    }

    /**
     * 코드 그룹과 코드명으로 검색
     */
    @GetMapping("/{codeGroup}/search")
    public ApiResponse<List<CommonCodeDTO.SimpleCodeInfo>> searchCodesByGroupAndName(
            @PathVariable String codeGroup,
            @RequestParam String codeName) {
        try {
            List<CommonCodeDTO.SimpleCodeInfo> codes = commonCodeService.searchCodesByGroupAndName(codeGroup, codeName);
            return ApiResponse.success(codes, "코드 검색 성공");
        } catch (Exception e) {
            log.error("코드 검색 중 오류 발생: codeGroup={}, codeName={}", codeGroup, codeName, e);
            return ApiResponse.error("검색 실패", "코드 검색에 실패했습니다.");
        }
    }

    /**
     * 부모 코드로 하위 코드 목록 조회
     */
    @GetMapping("/parent/{parentId}/children")
    public ApiResponse<List<CommonCodeDTO.SimpleCodeInfo>> getChildCodes(
            @PathVariable Long parentId) {
        try {
            List<CommonCodeDTO.SimpleCodeInfo> codes = commonCodeService.getChildCodes(parentId);
            return ApiResponse.success(codes, "하위 코드 목록 조회 성공");
        } catch (Exception e) {
            log.error("하위 코드 목록 조회 중 오류 발생: parentId={}", parentId, e);
            return ApiResponse.error("조회 실패", "하위 코드 목록을 불러오는데 실패했습니다.");
        }
    }

    /**
     * 최상위 코드 목록 조회
     */
    @GetMapping("/top-level")
    public ApiResponse<List<CommonCodeDTO.SimpleCodeInfo>> getTopLevelCodes() {
        try {
            List<CommonCodeDTO.SimpleCodeInfo> codes = commonCodeService.getTopLevelCodes();
            return ApiResponse.success(codes, "최상위 코드 목록 조회 성공");
        } catch (Exception e) {
            log.error("최상위 코드 목록 조회 중 오류 발생", e);
            return ApiResponse.error("조회 실패", "최상위 코드 목록을 불러오는데 실패했습니다.");
        }
    }

    /**
     * 모든 활성화된 코드 그룹 목록 조회
     */
    @GetMapping("/groups")
    public ApiResponse<List<CommonCodeDTO.CodeGroupInfo>> getAllActiveCodeGroups() {
        try {
            List<CommonCodeDTO.CodeGroupInfo> groups = commonCodeService.getAllActiveCodeGroups();
            return ApiResponse.success(groups, "코드 그룹 목록 조회 성공");
        } catch (Exception e) {
            log.error("코드 그룹 목록 조회 중 오류 발생", e);
            return ApiResponse.error("조회 실패", "코드 그룹 목록을 불러오는데 실패했습니다.");
        }
    }

    /**
     * 코드 생성 (관리자용)
     */
    @PostMapping
    public ApiResponse<CommonCodeDTO> createCode(@RequestBody CommonCodeDTO.CreateRequest request) {
        try {
            CommonCodeDTO createdCode = commonCodeService.createCode(request);
            return ApiResponse.success(createdCode, "코드 생성 성공");
        } catch (IllegalArgumentException e) {
            log.warn("코드 생성 중 유효성 검사 실패: {}", e.getMessage());
            return ApiResponse.error("생성 실패", e.getMessage());
        } catch (Exception e) {
            log.error("코드 생성 중 오류 발생", e);
            return ApiResponse.error("생성 실패", "코드 생성에 실패했습니다.");
        }
    }

    /**
     * 코드 수정 (관리자용)
     */
    @PutMapping("/{codeId}")
    public ApiResponse<CommonCodeDTO> updateCode(
            @PathVariable Long codeId,
            @RequestBody CommonCodeDTO.UpdateRequest request) {
        try {
            CommonCodeDTO updatedCode = commonCodeService.updateCode(codeId, request);
            return ApiResponse.success(updatedCode, "코드 수정 성공");
        } catch (IllegalArgumentException e) {
            log.warn("코드 수정 중 유효성 검사 실패: {}", e.getMessage());
            return ApiResponse.error("수정 실패", e.getMessage());
        } catch (Exception e) {
            log.error("코드 수정 중 오류 발생: codeId={}", codeId, e);
            return ApiResponse.error("수정 실패", "코드 수정에 실패했습니다.");
        }
    }

    /**
     * 코드 비활성화 (관리자용)
     */
    @DeleteMapping("/{codeId}/deactivate")
    public ApiResponse<Void> deactivateCode(@PathVariable Long codeId) {
        try {
            commonCodeService.deactivateCode(codeId);
            return ApiResponse.success(null, "코드 비활성화 성공");
        } catch (IllegalArgumentException e) {
            log.warn("코드 비활성화 중 유효성 검사 실패: {}", e.getMessage());
            return ApiResponse.error("비활성화 실패", e.getMessage());
        } catch (Exception e) {
            log.error("코드 비활성화 중 오류 발생: codeId={}", codeId, e);
            return ApiResponse.error("비활성화 실패", "코드 비활성화에 실패했습니다.");
        }
    }

    /**
     * 코드 완전 삭제 (관리자용)
     */
    @DeleteMapping("/{codeId}")
    public ApiResponse<Void> deleteCode(@PathVariable Long codeId) {
        try {
            commonCodeService.deleteCode(codeId);
            return ApiResponse.success(null, "코드 삭제 성공");
        } catch (IllegalArgumentException e) {
            log.warn("코드 삭제 중 유효성 검사 실패: {}", e.getMessage());
            return ApiResponse.error("삭제 실패", e.getMessage());
        } catch (Exception e) {
            log.error("코드 삭제 중 오류 발생: codeId={}", codeId, e);
            return ApiResponse.error("삭제 실패", "코드 삭제에 실패했습니다.");
        }
    }
}
