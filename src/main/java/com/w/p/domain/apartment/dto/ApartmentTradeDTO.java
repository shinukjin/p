package com.w.p.domain.apartment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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

        @JacksonXmlProperty(localName = "sggNm")
        private String sggNm;             // 시군구명

        @JacksonXmlProperty(localName = "emdCd")
        private String emdCd;             // 읍면동코드

        @JacksonXmlProperty(localName = "emdNm")
        private String emdNm;             // 읍면동명

        @JacksonXmlProperty(localName = "lawdCd")
        private String lawdCd;            // 법정동코드

        @JacksonXmlProperty(localName = "lawdNm")
        private String lawdNm;            // 법정동명
    }

    /**
     * 검색 요청 DTO
     */
    @Getter
    @Setter
    public static class SearchRequest {
        private String lawdCd;        // 법정동코드
        private String dealYmd;       // 거래년월
        private int numOfRows = 10;   // 조회 건수
        private int pageNo = 1;       // 페이지 번호
    }

    /**
     * 간소화된 거래 정보 DTO
     */
    @Getter
    @Setter
    public static class SimpleTradeInfo {
        private String apartmentName;     // 아파트명
        private String dong;              // 동
        private String jibun;             // 지번
        private String dealAmount;        // 거래금액
        private String exclusiveArea;     // 전용면적
        private String floor;             // 층수
        private String buildYear;         // 건축년도
        private String dealDate;          // 거래일자
        private String pricePerPyeong;    // 평당 가격
    }
}
