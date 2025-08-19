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

    /**
     * 지역코드 목록 조회 (참고용)
     * 
     * @return 주요 지역코드 목록
     */
    @GetMapping("/region-codes")
    public ApiResponse<List<RegionCode>> getRegionCodes() {
        List<RegionCode> regionCodes = List.of(
            // 서울시
            new RegionCode("11680", "강남구"),
            new RegionCode("11650", "서초구"),
            new RegionCode("11590", "동작구"),
            new RegionCode("11620", "관악구"),
            new RegionCode("11560", "영등포구"),
            new RegionCode("11530", "구로구"),
            new RegionCode("11500", "강서구"),
            new RegionCode("11470", "양천구"),
            new RegionCode("11440", "마포구"),
            new RegionCode("11410", "서대문구"),
            
            // 경기도 (안양, 부천 근처)
            new RegionCode("41171", "안양시 만안구"),
            new RegionCode("41173", "안양시 동안구"),
            new RegionCode("41185", "과천시"),
            new RegionCode("41210", "의왕시"),
            new RegionCode("41220", "하남시"),
            new RegionCode("41250", "용인시 기흥구"),
            new RegionCode("41271", "용인시 수지구"),
            new RegionCode("41281", "용인시 처인구"),
            new RegionCode("41290", "파주시"),
            new RegionCode("41310", "김포시"),
            new RegionCode("41360", "광주시"),
            new RegionCode("41370", "여주시"),
            new RegionCode("41410", "오산시"),
            new RegionCode("41430", "시흥시"),
            new RegionCode("41450", "군포시"),
            new RegionCode("41460", "의정부시"),
            new RegionCode("41480", "남양주시"),
            new RegionCode("41500", "고양시 덕양구"),
            new RegionCode("41590", "고양시 일산동구"),
            new RegionCode("41610", "고양시 일산서구"),
            new RegionCode("41630", "양주시"),
            new RegionCode("41650", "구리시"),
            new RegionCode("41670", "포천시"),
            new RegionCode("41690", "연천군"),
            new RegionCode("41800", "가평군"),
            new RegionCode("41820", "양평군"),
            
            // 부천시 및 인근 지역
            new RegionCode("41190", "부천시"),
            new RegionCode("41192", "부천시 원미구"),
            new RegionCode("41195", "부천시 소사구"),
            new RegionCode("41199", "부천시 오정구"),
            
            // 인천시 (부천 근처)
            new RegionCode("28110", "인천시 중구"),
            new RegionCode("28140", "인천시 동구"),
            new RegionCode("28177", "인천시 미추홀구"),
            new RegionCode("28185", "인천시 연수구"),
            new RegionCode("28200", "인천시 남동구"),
            new RegionCode("28237", "인천시 부평구"),
            new RegionCode("28245", "인천시 계양구"),
            new RegionCode("28260", "인천시 서구"),
            new RegionCode("28710", "인천시 강화군"),
            new RegionCode("28720", "인천시 옹진군"),
            
            // 성남시 (안양 근처)
            new RegionCode("41131", "성남시 수정구"),
            new RegionCode("41135", "성남시 중원구"),
            new RegionCode("41150", "성남시 분당구"),
            
            // 수원시 (안양 근처)
            new RegionCode("41110", "수원시 장안구"),
            new RegionCode("41113", "수원시 권선구"),
            new RegionCode("41117", "수원시 팔달구"),
            new RegionCode("41131", "수원시 영통구"),
            
            // 평택시 (안양 근처)
            new RegionCode("41220", "평택시"),
            
            // 안산시 (부천 근처)
            new RegionCode("41270", "안산시 상록구"),
            new RegionCode("41273", "안산시 단원구")
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
        public void setCode(String code) { this.code = code; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
