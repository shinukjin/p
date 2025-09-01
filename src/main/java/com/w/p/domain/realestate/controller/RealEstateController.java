package com.w.p.domain.realestate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.w.p.common.ApiResponse;
import com.w.p.common.util.FileUploadUtil;
import com.w.p.domain.realestate.dto.RealEstateDTO;
import com.w.p.domain.realestate.service.RealEstateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
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
    private final FileUploadUtil fileUploadUtil;

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
     * 간단한 JSON 테스트용 엔드포인트
     */
    @PostMapping("/test-json")
    public ResponseEntity<ApiResponse<String>> testJson(
            @RequestBody String jsonData) {
        try {
            log.info("🧪 JSON 테스트 요청 시작");
            log.info("📝 받은 JSON 데이터: {}", jsonData);
            
            return ResponseEntity.ok(ApiResponse.success("JSON 테스트 성공", "JSON 데이터가 정상적으로 수신되었습니다"));
            
        } catch (Exception e) {
            log.error("❌ JSON 테스트 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("테스트 실패", e.getMessage()));
        }
    }

    /**
     * FormData 테스트용 엔드포인트
     */
    @PostMapping("/test-multipart")
    public ResponseEntity<ApiResponse<String>> testMultipart(
            @RequestPart("data") String jsonData,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {
        try {
            log.info("🧪 FormData 테스트 요청 시작");
            log.info("📝 받은 JSON 데이터: {}", jsonData);
            log.info("📎 이미지 파일 개수: {}", images != null ? images.length : 0);
            
            if (images != null) {
                for (int i = 0; i < images.length; i++) {
                    MultipartFile file = images[i];
                    log.info("🖼️ 파일 {}: 원본명={}, 크기={}, 타입={}", 
                        i, file.getOriginalFilename(), file.getSize(), file.getContentType());
                }
            }
            
            return ResponseEntity.ok(ApiResponse.success("FormData 테스트 성공", "모든 데이터가 정상적으로 수신되었습니다"));
            
        } catch (Exception e) {
            log.error("❌ FormData 테스트 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("테스트 실패", e.getMessage()));
        }
    }

    /**
     * 부동산 등록 (이미지 포함)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RealEstateDTO>> createRealEstate(
            MultipartHttpServletRequest multipartRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("🚀 부동산 등록 요청 시작 - 사용자: {}", username);
            
            // FormData에서 JSON 데이터 추출
            String jsonData = multipartRequest.getParameter("data");
            if (jsonData == null) {
                log.error("❌ JSON 데이터가 없습니다");
                return ResponseEntity.badRequest().body(ApiResponse.error("데이터 누락", "JSON 데이터가 없습니다"));
            }
            
            log.info("📝 받은 JSON 데이터: {}", jsonData);
            
            // JSON을 DTO로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            RealEstateDTO.CreateRequest createRequest = objectMapper.readValue(jsonData, RealEstateDTO.CreateRequest.class);
            
            log.info("📝 파싱된 DTO: {}", createRequest);
            
            // 이미지 파일들 추출
            List<MultipartFile> imageFiles = multipartRequest.getFiles("images");
            MultipartFile[] images = imageFiles.toArray(new MultipartFile[0]);
            
            log.info("📎 이미지 개수: {}", images.length);
            
            // Multipart 디버깅 로깅
            for (int i = 0; i < images.length; i++) {
                MultipartFile file = images[i];
                log.info("🖼️ 이미지 {}: 원본명={}, 크기={}, 타입={}", 
                    i, file.getOriginalFilename(), file.getSize(), file.getContentType());
            }
            
            // 이미지 파일을 request에 설정
            if (images.length > 0) {
                createRequest.setImages(images);
                log.info("✅ 이미지 파일을 request에 설정 완료");
            }
            
            RealEstateDTO estate = realEstateService.createRealEstate(username, createRequest);
            log.info("🎉 부동산 등록 완료 - ID: {}", estate.getId());
            return ResponseEntity.ok(ApiResponse.success(estate, "부동산 등록 성공"));
            
        } catch (Exception e) {
            log.error("❌ 부동산 등록 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("등록 실패", e.getMessage()));
        }
    }

    /**
     * 이미지 업로드 (별도 API)
     */
    @PostMapping("/upload-images")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(
            @RequestParam("images") MultipartFile[] images,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("이미지 업로드 요청 - 사용자: {}, 파일: {}개", username, images.length);
            
            List<String> uploadedUrls = fileUploadUtil.uploadImages(images);
            log.info("이미지 업로드 완료 - 사용자: {}, URL: {}개", username, uploadedUrls.size());
            
            return ResponseEntity.ok(ApiResponse.success(uploadedUrls, "이미지 업로드 성공"));
        } catch (IOException e) {
            log.error("이미지 업로드 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("업로드 실패", e.getMessage()));
        } catch (Exception e) {
            log.error("이미지 업로드 중 예상치 못한 오류", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("업로드 실패", "이미지 업로드 중 오류가 발생했습니다."));
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
            return ResponseEntity.ok(ApiResponse.success(estate, "북마크 토글 성공"));
        } catch (Exception e) {
            log.error("북마크 토글 실패 - ID: {}", id, e);
            return ResponseEntity.badRequest().body(ApiResponse.error("북마크 토글 실패", e.getMessage()));
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
