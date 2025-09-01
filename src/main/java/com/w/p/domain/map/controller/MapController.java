package com.w.p.domain.map.controller;

import com.w.p.common.ApiResponse;
import com.w.p.domain.map.service.MapService;
import com.w.p.dto.map.MapDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 지도 관련 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/map")
@RequiredArgsConstructor
@Slf4j
public class MapController {

    private final MapService mapService;

    /**
     * 주소를 좌표로 변환 (지오코딩)
     * 
     * @param address 변환할 주소
     * @return 좌표 정보
     */
    @GetMapping("/geocode")
    public ApiResponse<MapDTO.GeocodeResponse> geocodeAddress(
            @RequestParam("address") String address) {
        
        try {
            log.debug("주소 지오코딩 요청 - address: {}", address);
            
            MapDTO.GeocodeResponse response = mapService.geocodeAddress(address);
            
            return ApiResponse.success(response, "주소 변환 성공");
            
        } catch (Exception e) {
            log.error("주소 지오코딩 중 오류 발생", e);
            return ApiResponse.error("주소 변환 실패", e.getMessage());
        }
    }


}
