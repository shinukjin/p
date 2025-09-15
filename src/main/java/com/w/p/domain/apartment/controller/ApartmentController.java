package com.w.p.domain.apartment.controller;

import com.w.p.common.ApiResponse;
import com.w.p.domain.apartment.dto.ApartmentTradeDTO;
import com.w.p.domain.apartment.service.ApartmentApiService;
import com.w.p.exception.apartment.ApartmentApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 아파트 매매 실거래가 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/apartment")
@RequiredArgsConstructor
@Slf4j
public class ApartmentController {

    private final ApartmentApiService apartmentApiService;

    /**
     * 아파트 매매 실거래가 조회
     * 
     * @param lawdCd 법정동코드 (예: 11680)
     * @param dealYmd 거래년월 (예: 202512)
     * @param numOfRows 조회 건수 (기본값: 10)
     * @param pageNo 페이지 번호 (기본값: 1)
     * @return 실거래가 목록
     */
    @GetMapping("/trades")
    public ApiResponse<List<ApartmentTradeDTO.SimpleTradeInfo>> getApartmentTrades(
            @RequestParam("lawdCd") String lawdCd,
            @RequestParam(value = "dealYmd", required = false) String dealYmd,
            @RequestParam(value = "numOfRows", defaultValue = "10") int numOfRows,
            @RequestParam(value = "pageNo", defaultValue = "1") int pageNo) {

        try {
            log.debug("아파트 실거래가 조회 요청 - lawdCd: {}, dealYmd: {}, numOfRows: {}, pageNo: {}",
                     lawdCd, dealYmd, numOfRows, pageNo);

            // 기본 입력 검증
            if (lawdCd == null || lawdCd.trim().isEmpty()) {
                return ApiResponse.error("잘못된 요청", "법정동코드는 필수입니다.");
            }

            // dealYmd가 없으면 현재 월 사용
            if (dealYmd == null || dealYmd.isEmpty()) {
                dealYmd = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
                log.debug("dealYmd가 없어서 현재 월로 설정: {}", dealYmd);
            }
            
            ApartmentTradeDTO.SearchRequest request = new ApartmentTradeDTO.SearchRequest();
            request.setLawdCd(lawdCd);
            request.setDealYmd(dealYmd);
            request.setNumOfRows(numOfRows);
            request.setPageNo(pageNo);
            
            List<ApartmentTradeDTO.SimpleTradeInfo> trades = apartmentApiService.getApartmentTrades(request);
            
            return ApiResponse.success(trades, "아파트 실거래가 조회 성공");
            
        } catch (ApartmentApiException e) {
            log.warn("아파트 실거래가 조회 중 비즈니스 오류: {}", e.getMessage());
            return ApiResponse.error("조회 실패", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("잘못된 입력 파라미터: {}", e.getMessage());
            return ApiResponse.error("잘못된 요청", e.getMessage());
        } catch (Exception e) {
            log.error("아파트 실거래가 조회 중 예상치 못한 오류 발생", e);
            return ApiResponse.error("시스템 오류", "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    /**
     * 최근 거래 내역 조회
     * 
     * @param lawdCd 법정동코드
     * @return 최근 거래 내역
     */
    @GetMapping("/recent-trades")
    public ApiResponse<List<ApartmentTradeDTO.SimpleTradeInfo>> getRecentTrades(
            @RequestParam("lawdCd") String lawdCd) {
        
        try {
            if (lawdCd == null || lawdCd.trim().isEmpty()) {
                return ApiResponse.error("잘못된 요청", "법정동코드는 필수입니다.");
            }

            String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
            List<ApartmentTradeDTO.SimpleTradeInfo> trades = apartmentApiService.getRecentTrades(lawdCd, currentMonth);
            
            return ApiResponse.success(trades, "최근 거래 내역 조회 성공");
            
        } catch (ApartmentApiException e) {
            log.warn("최근 거래 내역 조회 중 비즈니스 오류: {}", e.getMessage());
            return ApiResponse.error("조회 실패", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("잘못된 입력 파라미터: {}", e.getMessage());
            return ApiResponse.error("잘못된 요청", e.getMessage());
        } catch (Exception e) {
            log.error("최근 거래 내역 조회 중 예상치 못한 오류 발생", e);
            return ApiResponse.error("시스템 오류", "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

}
