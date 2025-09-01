package com.w.p.domain.admin.controller;

import com.w.p.dto.admin.WeddingHallDTO;
import com.w.p.domain.admin.service.AdminWeddingHallService;
import com.w.p.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자용 결혼식장 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/admin/wedding-halls")
@RequiredArgsConstructor
@Slf4j
public class AdminWeddingHallController {

    private final AdminWeddingHallService adminWeddingHallService;

    /**
     * 결혼식장 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<WeddingHallDTO>>> getWeddingHalls() {
        try {
            ApiResponse<List<WeddingHallDTO>> response = adminWeddingHallService.getWeddingHalls();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("결혼식장 목록 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("결혼식장 목록 조회에 실패했습니다."));
        }
    }

    /**
     * 결혼식장 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WeddingHallDTO>> getWeddingHall(@PathVariable Long id) {
        try {
            ApiResponse<WeddingHallDTO> response = adminWeddingHallService.getWeddingHall(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("결혼식장 상세 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("결혼식장 상세 조회에 실패했습니다."));
        }
    }

    /**
     * 결혼식장 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<WeddingHallDTO>> createWeddingHall(@RequestBody WeddingHallDTO dto) {
        try {
            ApiResponse<WeddingHallDTO> response = adminWeddingHallService.createWeddingHall(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("결혼식장 생성 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("결혼식장 생성에 실패했습니다."));
        }
    }

    /**
     * 결혼식장 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WeddingHallDTO>> updateWeddingHall(
            @PathVariable Long id,
            @RequestBody WeddingHallDTO dto) {
        try {
            ApiResponse<WeddingHallDTO> response = adminWeddingHallService.updateWeddingHall(id, dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("결혼식장 수정 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("결혼식장 수정에 실패했습니다."));
        }
    }

    /**
     * 결혼식장 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWeddingHall(@PathVariable Long id) {
        try {
            ApiResponse<Void> response = adminWeddingHallService.deleteWeddingHall(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("결혼식장 삭제 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("결혼식장 삭제에 실패했습니다."));
        }
    }
}
