package com.w.p.service.apartment;

import com.w.p.dto.apartment.ApartmentTradeDTO;

import java.util.List;

/**
 * 아파트 매매 실거래가 API 서비스 인터페이스
 */
public interface ApartmentApiService {
    
    /**
     * 아파트 매매 실거래가 조회
     * 
     * @param request 검색 조건
     * @return 실거래가 목록
     */
    List<ApartmentTradeDTO.SimpleTradeInfo> getApartmentTrades(ApartmentTradeDTO.SearchRequest request);
    
    /**
     * 지역코드로 최근 거래 내역 조회
     * 
     * @param lawdCd 법정동코드
     * @param dealYmd 거래년월 (YYYYMM)
     * @return 실거래가 목록
     */
    List<ApartmentTradeDTO.SimpleTradeInfo> getRecentTrades(String lawdCd, String dealYmd);
}
