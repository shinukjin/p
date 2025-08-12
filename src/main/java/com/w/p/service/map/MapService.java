package com.w.p.service.map;

import com.w.p.dto.map.MapDTO;

/**
 * 지도 관련 서비스 인터페이스
 */
public interface MapService {

    /**
     * 주소를 좌표로 변환 (지오코딩)
     *
     * @param address 변환할 주소
     * @return 좌표 정보
     */
    MapDTO.GeocodeResponse geocodeAddress(String address);
}
