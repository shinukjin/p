package com.w.p.dto.apartment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * 아파트 매매 실거래가 API 응답 DTO
 */
public class ApartmentTradeDTO {

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {
        @JacksonXmlProperty(localName = "header")
        private Header header;

        @JacksonXmlProperty(localName = "body")
        private Body body;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Header {
        @JacksonXmlProperty(localName = "resultCode")
        private String resultCode;

        @JacksonXmlProperty(localName = "resultMsg")
        private String resultMsg;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Body {

        @JacksonXmlElementWrapper(localName = "items")
        @JacksonXmlProperty(localName = "item")
        private List<Item> items;

        @JacksonXmlProperty(localName = "numOfRows")
        private int numOfRows;

        @JacksonXmlProperty(localName = "pageNo")
        private int pageNo;

        @JacksonXmlProperty(localName = "totalCount")
        private int totalCount;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        // 아파트 정보
        @JacksonXmlProperty(localName = "aptDong")
        private String aptDong;           // 아파트 동

        @JacksonXmlProperty(localName = "aptNm")
        private String aptNm;             // 아파트명

        // 건물 정보
        @JacksonXmlProperty(localName = "buildYear")
        private String buildYear;         // 건축년도

        @JacksonXmlProperty(localName = "excluUseAr")
        private String excluUseAr;        // 전용면적

        @JacksonXmlProperty(localName = "floor")
        private String floor;             // 층수

        // 거래 정보
        @JacksonXmlProperty(localName = "dealAmount")
        private String dealAmount;        // 거래금액

        @JacksonXmlProperty(localName = "dealYear")
        private String dealYear;          // 거래년도

        @JacksonXmlProperty(localName = "dealMonth")
        private String dealMonth;         // 거래월

        @JacksonXmlProperty(localName = "dealDay")
        private String dealDay;           // 거래일

        // 위치 정보
        @JacksonXmlProperty(localName = "umdNm")
        private String umdNm;             // 읍면동명

        @JacksonXmlProperty(localName = "jibun")
        private String jibun;             // 지번

        @JacksonXmlProperty(localName = "sggCd")
        private String sggCd;             // 시군구코드

        // 거래 상세
        @JacksonXmlProperty(localName = "buyerGbn")
        private String buyerGbn;          // 매수자구분

        @JacksonXmlProperty(localName = "slerGbn")
        private String slerGbn;           // 매도자구분

        @JacksonXmlProperty(localName = "dealingGbn")
        private String dealingGbn;        // 거래구분

        @JacksonXmlProperty(localName = "cdealType")
        private String cdealType;         // 거래유형

        @JacksonXmlProperty(localName = "cdealDay")
        private String cdealDay;          // 해약일

        // 기타 정보
        @JacksonXmlProperty(localName = "estateAgentSggNm")
        private String estateAgentSggNm;  // 중개사소재지

        @JacksonXmlProperty(localName = "landLeaseholdGbn")
        private String landLeaseholdGbn;  // 토지임대부구분

        @JacksonXmlProperty(localName = "rgstDate")
        private String rgstDate;          // 등록일자
    }

    /**
     * 검색 요청 DTO
     */
    @Getter
    @Setter
    public static class SearchRequest {
        private String lawdCd;      // 지역코드 (법정동코드)
        private String dealYmd;     // 계약월 (YYYYMM)
        private int numOfRows = 10; // 한 페이지 결과 수
        private int pageNo = 1;     // 페이지번호
    }

    /**
     * 프론트엔드용 간소화된 응답 DTO
     */
    @Getter
    @Setter
    public static class SimpleTradeInfo {
        private String apartmentName;   // 아파트명
        private String dong;           // 법정동
        private String jibun;          // 지번
        private String dealAmount;     // 거래금액
        private String exclusiveArea;  // 전용면적
        private String floor;          // 층
        private String buildYear;      // 건축년도
        private String dealDate;       // 거래일자 (YYYY-MM-DD)
        private String pricePerPyeong; // 평당 가격
    }
}
