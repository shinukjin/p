package com.w.p.domain.wedding.controller;

import com.w.p.common.ApiResponse;
import com.w.p.domain.wedding.dto.WeddingHallDTO;
import com.w.p.domain.wedding.service.WeddingHallService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wedding-halls")
@RequiredArgsConstructor
@Slf4j
public class WeddingHallController {
    
    private final WeddingHallService weddingHallService;
    
    /**
     * 웨딩홀 목록 조회
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<WeddingHallDTO.Response>>> getWeddingHalls(
            @RequestParam Long userId) {
        
        List<WeddingHallDTO.Response> weddingHalls = weddingHallService.getWeddingHallsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(weddingHalls));
    }
    
    /**
     * 웨딩홀 상세 조회
     */
    @GetMapping("/{weddingHallId}")
    public ResponseEntity<ApiResponse<WeddingHallDTO.Response>> getWeddingHall(
            @PathVariable Long weddingHallId,
            @RequestParam Long userId) {
        
        WeddingHallDTO.Response weddingHall = weddingHallService.getWeddingHallById(userId, weddingHallId);
        return ResponseEntity.ok(ApiResponse.success(weddingHall));
    }
    
    /**
     * 웨딩홀 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<WeddingHallDTO.Response>> createWeddingHall(
            @RequestParam Long userId,
            @RequestBody WeddingHallDTO.Request request) {
        
        WeddingHallDTO.Response weddingHall = weddingHallService.createWeddingHall(userId, request);
        return ResponseEntity.ok(ApiResponse.success(weddingHall));
    }
    
    /**
     * 웨딩홀 수정
     */
    @PutMapping("/{weddingHallId}")
    public ResponseEntity<ApiResponse<WeddingHallDTO.Response>> updateWeddingHall(
            @PathVariable Long weddingHallId,
            @RequestParam Long userId,
            @RequestBody WeddingHallDTO.Update updateRequest) {
        
        WeddingHallDTO.Response weddingHall = weddingHallService.updateWeddingHall(userId, weddingHallId, updateRequest);
        return ResponseEntity.ok(ApiResponse.success(weddingHall));
    }
    
    /**
     * 웨딩홀 삭제
     */
    @DeleteMapping("/{weddingHallId}")
    public ResponseEntity<ApiResponse<Void>> deleteWeddingHall(
            @PathVariable Long weddingHallId,
            @RequestParam Long userId) {
        
        weddingHallService.deleteWeddingHall(userId, weddingHallId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    /**
     * 북마크 토글
     */
    @PostMapping("/{weddingHallId}/bookmark")
    public ResponseEntity<ApiResponse<WeddingHallDTO.Response>> toggleBookmark(
            @PathVariable Long weddingHallId,
            @RequestParam Long userId) {
        
        WeddingHallDTO.Response weddingHall = weddingHallService.toggleBookmark(userId, weddingHallId);
        return ResponseEntity.ok(ApiResponse.success(weddingHall));
    }
    
    /**
     * 웨딩홀 검색
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<WeddingHallDTO.Response>>> searchWeddingHalls(
            @RequestParam Long userId,
            @RequestBody WeddingHallDTO.SearchRequest searchRequest) {
        
        List<WeddingHallDTO.Response> weddingHalls = weddingHallService.searchWeddingHalls(userId, searchRequest);
        return ResponseEntity.ok(ApiResponse.success(weddingHalls));
    }
    
    /**
     * 웨딩홀 통계 조회
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<WeddingHallDTO.ListResponse>> getWeddingHallStatistics(
            @RequestParam Long userId) {
        
        WeddingHallDTO.ListResponse statistics = weddingHallService.getWeddingHallStatistics(userId);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
}
