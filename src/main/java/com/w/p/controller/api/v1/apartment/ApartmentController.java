package com.w.p.controller.api.v1.apartment;

import com.w.p.common.ApiResponse;
import com.w.p.dto.apartment.ApartmentTradeDTO;
import com.w.p.service.apartment.ApartmentApiService;
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
     * @param dealYmd 거래년월 (예: 202412)
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
            
        } catch (Exception e) {
            log.error("아파트 실거래가 조회 중 오류 발생", e);
            return ApiResponse.error("아파트 실거래가 조회 실패", e.getMessage());
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
            String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
            List<ApartmentTradeDTO.SimpleTradeInfo> trades = apartmentApiService.getRecentTrades(lawdCd, currentMonth);
            
            return ApiResponse.success(trades, "최근 거래 내역 조회 성공");
            
        } catch (Exception e) {
            log.error("최근 거래 내역 조회 중 오류 발생", e);
            return ApiResponse.error("최근 거래 내역 조회 실패", e.getMessage());
        }
    }

    /**
     * 지역코드 목록 조회 (참고용)
     * 
     * @return 주요 지역코드 목록
     */
    @GetMapping("/region-codes")
    public ApiResponse<List<RegionCode>> getRegionCodes() {
        List<RegionCode> regionCodes = List.of(
            new RegionCode("11680", "강남구"),
            new RegionCode("11650", "서초구"),
            new RegionCode("11590", "동작구"),
            new RegionCode("11620", "관악구"),
            new RegionCode("11215", "광진구"),
            new RegionCode("11230", "성동구"),
            new RegionCode("11200", "성북구"),
            new RegionCode("11290", "성북구"),
            new RegionCode("11305", "강서구"),
            new RegionCode("11500", "강동구")
        );
        
        return ApiResponse.success(regionCodes, "지역코드 목록 조회 성공");
    }

    /**
     * 지역코드 정보
     */
    public static class RegionCode {
        private String code;
        private String name;

        public RegionCode(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() { return code; }
        public String getName() { return name; }
    }
}
