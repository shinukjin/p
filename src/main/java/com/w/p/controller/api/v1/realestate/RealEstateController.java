package com.w.p.controller.api.v1.realestate;

import com.w.p.common.ApiResponse;
import com.w.p.dto.RealEstateDTO;
import com.w.p.service.RealEstateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 부동산 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/real-estates")
@RequiredArgsConstructor
@Slf4j
public class RealEstateController {

    private final RealEstateService realEstateService;

    /**
     * 부동산 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RealEstateDTO>>> getRealEstates(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<RealEstateDTO> estates = realEstateService.getRealEstates(username);
            return ResponseEntity.ok(ApiResponse.success(estates, "부동산 목록 조회 성공"));
        } catch (Exception e) {
            log.error("부동산 목록 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("조회 실패", e.getMessage()));
        }
    }

    /**
     * 부동산 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RealEstateDTO>> getRealEstate(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            RealEstateDTO estate = realEstateService.getRealEstate(username, id);
            return ResponseEntity.ok(ApiResponse.success(estate, "부동산 상세 조회 성공"));
        } catch (Exception e) {
            log.error("부동산 상세 조회 실패 - ID: {}", id, e);
            return ResponseEntity.badRequest().body(ApiResponse.error("조회 실패", e.getMessage()));
        }
    }

    /**
     * 부동산 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RealEstateDTO>> createRealEstate(
            @RequestBody RealEstateDTO.CreateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("부동산 등록 요청 - 사용자: {}, 제목: {}", username, request.getTitle());
            
            RealEstateDTO estate = realEstateService.createRealEstate(username, request);
            return ResponseEntity.ok(ApiResponse.success(estate, "부동산 등록 성공"));
        } catch (Exception e) {
            log.error("부동산 등록 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("등록 실패", e.getMessage()));
        }
    }

    /**
     * 부동산 수정
     */
    @PostMapping("/{id}/update")
    public ResponseEntity<ApiResponse<RealEstateDTO>> updateRealEstate(
            @PathVariable Long id,
            @RequestBody RealEstateDTO.CreateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("부동산 수정 요청 - 사용자: {}, ID: {}", username, id);
            
            RealEstateDTO estate = realEstateService.updateRealEstate(username, id, request);
            return ResponseEntity.ok(ApiResponse.success(estate, "부동산 수정 성공"));
        } catch (Exception e) {
            log.error("부동산 수정 실패 - ID: {}", id, e);
            return ResponseEntity.badRequest().body(ApiResponse.error("수정 실패", e.getMessage()));
        }
    }

    /**
     * 부동산 삭제
     */
    @PostMapping("/{id}/delete")
    public ResponseEntity<ApiResponse<Void>> deleteRealEstate(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("부동산 삭제 요청 - 사용자: {}, ID: {}", username, id);
            
            realEstateService.deleteRealEstate(username, id);
            return ResponseEntity.ok(ApiResponse.success(null, "부동산 삭제 성공"));
        } catch (Exception e) {
            log.error("부동산 삭제 실패 - ID: {}", id, e);
            return ResponseEntity.badRequest().body(ApiResponse.error("삭제 실패", e.getMessage()));
        }
    }

    /**
     * 북마크 토글
     */
    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse<RealEstateDTO>> toggleBookmark(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("북마크 토글 요청 - 사용자: {}, ID: {}", username, id);
            
            RealEstateDTO estate = realEstateService.toggleBookmark(username, id);
            return ResponseEntity.ok(ApiResponse.success(estate, "북마크 변경 성공"));
        } catch (Exception e) {
            log.error("북마크 토글 실패 - ID: {}", id, e);
            return ResponseEntity.badRequest().body(ApiResponse.error("북마크 변경 실패", e.getMessage()));
        }
    }

    /**
     * 부동산 검색
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<RealEstateDTO>>> searchRealEstates(
            @RequestBody RealEstateDTO.SearchRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("부동산 검색 요청 - 사용자: {}, 키워드: {}", username, request.getKeyword());
            
            List<RealEstateDTO> estates = realEstateService.searchRealEstates(username, request);
            return ResponseEntity.ok(ApiResponse.success(estates, "부동산 검색 성공"));
        } catch (Exception e) {
            log.error("부동산 검색 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("검색 실패", e.getMessage()));
        }
    }
}
