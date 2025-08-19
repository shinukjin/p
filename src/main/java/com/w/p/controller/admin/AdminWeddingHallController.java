package com.w.p.controller.admin;

import com.w.p.dto.admin.WeddingHallDTO;
import com.w.p.service.admin.AdminWeddingHallService;
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
        log.info("결혼식장 목록 조회 요청");
        ApiResponse<List<WeddingHallDTO>> response = adminWeddingHallService.getWeddingHalls();
        return ResponseEntity.ok(response);
    }

    /**
     * 결혼식장 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WeddingHallDTO>> getWeddingHall(@PathVariable Long id) {
        log.info("결혼식장 상세 조회 요청 - ID: {}", id);
        ApiResponse<WeddingHallDTO> response = adminWeddingHallService.getWeddingHall(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 결혼식장 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<WeddingHallDTO>> createWeddingHall(@RequestBody WeddingHallDTO dto) {
        log.info("결혼식장 생성 요청 - 이름: {}", dto.getName());
        ApiResponse<WeddingHallDTO> response = adminWeddingHallService.createWeddingHall(dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 결혼식장 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WeddingHallDTO>> updateWeddingHall(
            @PathVariable Long id, 
            @RequestBody WeddingHallDTO dto) {
        log.info("결혼식장 수정 요청 - ID: {}", id);
        ApiResponse<WeddingHallDTO> response = adminWeddingHallService.updateWeddingHall(id, dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 결혼식장 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWeddingHall(@PathVariable Long id) {
        log.info("결혼식장 삭제 요청 - ID: {}", id);
        ApiResponse<Void> response = adminWeddingHallService.deleteWeddingHall(id);
        return ResponseEntity.ok(response);
    }
}
