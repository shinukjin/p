package com.w.p.domain.realestate.service;

import com.w.p.domain.realestate.dto.RealEstateDTO;

import java.util.List;

/**
 * 부동산 서비스 인터페이스
 */
public interface RealEstateService {

    /**
     * 사용자별 부동산 목록 조회
     */
    List<RealEstateDTO> getRealEstates(String username);

    /**
     * 부동산 상세 조회
     */
    RealEstateDTO getRealEstate(String username, Long id);

    /**
     * 부동산 등록
     */
    RealEstateDTO createRealEstate(String username, RealEstateDTO.CreateRequest request);

    /**
     * 부동산 수정
     */
    RealEstateDTO updateRealEstate(String username, Long id, RealEstateDTO.CreateRequest request);

    /**
     * 부동산 삭제
     */
    void deleteRealEstate(String username, Long id);

    /**
     * 북마크 토글
     */
    RealEstateDTO toggleBookmark(String username, Long id);

    /**
     * 부동산 검색
     */
    List<RealEstateDTO> searchRealEstates(String username, RealEstateDTO.SearchRequest request);
}
