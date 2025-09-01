package com.w.p.domain.wedding.service;

import com.w.p.domain.wedding.dto.WeddingHallDTO;
import com.w.p.entity.WeddingHall;

import java.math.BigDecimal;
import java.util.List;

/**
 * 웨딩홀 서비스 인터페이스
 */
public interface WeddingHallService {
    
    /**
     * 사용자별 웨딩홀 목록 조회
     */
    List<WeddingHallDTO.Response> getWeddingHallsByUserId(Long userId);
    
    /**
     * 웨딩홀 상세 조회
     */
    WeddingHallDTO.Response getWeddingHallById(Long userId, Long weddingHallId);
    
    /**
     * 웨딩홀 생성
     */
    WeddingHallDTO.Response createWeddingHall(Long userId, WeddingHallDTO.Request request);
    
    /**
     * 웨딩홀 수정
     */
    WeddingHallDTO.Response updateWeddingHall(Long userId, Long weddingHallId, WeddingHallDTO.Update updateRequest);
    
    /**
     * 웨딩홀 삭제
     */
    void deleteWeddingHall(Long userId, Long weddingHallId);
    
    /**
     * 웨딩홀 검색
     */
    List<WeddingHallDTO.Response> searchWeddingHalls(Long userId, String keyword);
    
    /**
     * 웨딩홀 검색 (SearchRequest 사용)
     */
    List<WeddingHallDTO.Response> searchWeddingHalls(Long userId, WeddingHallDTO.SearchRequest searchRequest);
    
    /**
     * 북마크 토글
     */
    WeddingHallDTO.Response toggleBookmark(Long userId, Long weddingHallId);
    
    /**
     * 가격대별 웨딩홀 조회
     */
    List<WeddingHallDTO.Response> getWeddingHallsByPriceRange(Long userId, BigDecimal minPrice, BigDecimal maxPrice);
    
    /**
     * 수용 인원별 웨딩홀 조회
     */
    List<WeddingHallDTO.Response> getWeddingHallsByCapacity(Long userId, Integer minCapacity, Integer maxCapacity);
    
    /**
     * 지역별 웨딩홀 조회
     */
    List<WeddingHallDTO.Response> getWeddingHallsByLocation(Long userId, String location);
    
    /**
     * 북마크된 웨딩홀 조회
     */
    List<WeddingHallDTO.Response> getBookmarkedWeddingHalls(Long userId);
    
    /**
     * 웨딩홀 비교
     */
    List<WeddingHallDTO.Response> compareWeddingHalls(Long userId, List<Long> weddingHallIds);
    
    /**
     * 웨딩홀 통계
     */
    WeddingHallDTO.ListResponse getWeddingHallStatistics(Long userId);
    
    /**
     * 웨딩홀 알림 설정
     */
    WeddingHallDTO.Response setWeddingHallAlert(Long userId, Long weddingHallId, BigDecimal priceThreshold);
    
    /**
     * 웨딩홀 공유
     */
    WeddingHallDTO.Response shareWeddingHall(Long userId, Long weddingHallId, String shareWithUsername);
    
    /**
     * 웨딩홀 템플릿 적용
     */
    List<WeddingHallDTO.Response> applyWeddingHallTemplate(Long userId, String templateName);
    
    /**
     * 웨딩홀 내보내기
     */
    String exportWeddingHallToExcel(Long userId, Long weddingHallId, String format);
    
    /**
     * 웨딩홀 가져오기
     */
    List<WeddingHallDTO.Response> importWeddingHallFromExcel(Long userId, String excelData, String format);
    
    /**
     * 웨딩홀 예약 상태 확인
     */
    WeddingHallDTO.Response checkWeddingHallAvailability(Long userId, Long weddingHallId, String date);
    
    /**
     * 웨딩홀 견적 요청
     */
    WeddingHallDTO.Response requestWeddingHallQuote(Long userId, Long weddingHallId, WeddingHallDTO.QuoteRequest quoteRequest);
}
