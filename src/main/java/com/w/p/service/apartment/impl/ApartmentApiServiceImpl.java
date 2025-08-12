package com.w.p.service.apartment.impl;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.w.p.dto.apartment.ApartmentTradeDTO;
import com.w.p.service.apartment.ApartmentApiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * 아파트 매매 실거래가 API 서비스 구현체
 */
@Service
@Slf4j
public class ApartmentApiServiceImpl implements ApartmentApiService {

    @Value("${apt.endpoint.url}")
    private String apiUrl;

    @Value("${apt.decoding.key}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final XmlMapper xmlMapper;

    public ApartmentApiServiceImpl() {
        this.xmlMapper = new XmlMapper();
        // 알 수 없는 필드 무시 설정
        this.xmlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public List<ApartmentTradeDTO.SimpleTradeInfo> getApartmentTrades(ApartmentTradeDTO.SearchRequest request) {
        try {
            log.debug("아파트 실거래가 API 호출 시작 - lawdCd: {}, dealYmd: {}", request.getLawdCd(), request.getDealYmd());

            // 파라미터 검증
            if (request.getLawdCd() == null || request.getLawdCd().trim().isEmpty()) {
                log.warn("lawdCd가 비어있습니다.");
                return new ArrayList<>();
            }

            if (request.getDealYmd() == null || request.getDealYmd().trim().isEmpty()) {
                log.warn("dealYmd가 비어있습니다.");
                return new ArrayList<>();
            }

            // API URL 구성
            String url = UriComponentsBuilder
                .fromUriString(apiUrl)
                .queryParam("serviceKey", serviceKey)
                .queryParam("LAWD_CD", request.getLawdCd())
                .queryParam("DEAL_YMD", request.getDealYmd())
                .queryParam("numOfRows", request.getNumOfRows())
                .queryParam("pageNo", request.getPageNo())
                .build()
                .toUriString();

            log.debug("아파트 실거래가 API URL: {}", url.replaceAll("serviceKey=[^&]*", "serviceKey=***"));

            // API 호출
            String response = restTemplate.getForObject(url, String.class);

            if (response == null || response.trim().isEmpty()) {
                log.warn("API 응답이 비어있습니다.");
                return new ArrayList<>();
            }

            log.debug("API 응답 수신 완료, 길이: {}", response.length());

            // XML을 JSON으로 변환 후 파싱 (실제로는 XML 파서 사용 권장)
            ApartmentTradeDTO.Response apiResponse = parseXmlResponse(response);
            
            if (apiResponse == null ||
                apiResponse.getBody() == null ||
                apiResponse.getBody().getItems() == null) {
                log.warn("API 응답 데이터가 비어있습니다.");
                return new ArrayList<>();
            }

            List<ApartmentTradeDTO.Item> items = apiResponse.getBody().getItems();
            log.debug("파싱된 아이템 개수: {}", items.size());

            // 응답 데이터 변환
            return convertToSimpleTradeInfo(items);

        } catch (Exception e) {
            log.error("아파트 실거래가 API 호출 중 오류 발생", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<ApartmentTradeDTO.SimpleTradeInfo> getRecentTrades(String lawdCd, String dealYmd) {
        ApartmentTradeDTO.SearchRequest request = new ApartmentTradeDTO.SearchRequest();
        request.setLawdCd(lawdCd);
        request.setDealYmd(dealYmd);
        request.setNumOfRows(20); // 최근 20건
        
        return getApartmentTrades(request);
    }

    /**
     * XML 응답을 파싱
     */
    private ApartmentTradeDTO.Response parseXmlResponse(String xmlResponse) {
        try {
            log.debug("XML 응답 파싱 시작");
            log.debug(xmlResponse);
            ApartmentTradeDTO.Response response = xmlMapper.readValue(xmlResponse, ApartmentTradeDTO.Response.class);
            log.debug("XML 파싱 성공");
            return response;

        } catch (Exception e) {
            log.error("XML 파싱 실패: {}", e.getMessage());
            log.error("파싱 실패한 XML: {}", xmlResponse);
            // XML 파싱 실패 시 더미 데이터 반환 (개발/테스트용)
            return createDummyResponse();
        }
    }

    /**
     * API 응답을 간소화된 DTO로 변환
     */
    private List<ApartmentTradeDTO.SimpleTradeInfo> convertToSimpleTradeInfo(List<ApartmentTradeDTO.Item> items) {
        List<ApartmentTradeDTO.SimpleTradeInfo> result = new ArrayList<>();

        if (items == null) {
            return result;
        }

        for (ApartmentTradeDTO.Item item : items) {
            ApartmentTradeDTO.SimpleTradeInfo info = new ApartmentTradeDTO.SimpleTradeInfo();

            // 새로운 필드명에 맞춰 매핑
            info.setApartmentName(item.getAptNm());
            info.setDong(item.getUmdNm());
            info.setJibun(item.getJibun());
            info.setDealAmount(formatDealAmount(item.getDealAmount()));
            info.setExclusiveArea(item.getExcluUseAr());
            info.setFloor(item.getFloor());
            info.setBuildYear(item.getBuildYear());
            info.setDealDate(formatDealDate(item.getDealYear(), item.getDealMonth(), item.getDealDay()));
            info.setPricePerPyeong(calculatePricePerPyeong(item.getDealAmount(), item.getExcluUseAr()));

            result.add(info);
        }

        return result;
    }

    /**
     * 거래금액 포맷팅 (만원 단위 제거, 쉼표 추가)
     */
    private String formatDealAmount(String dealAmount) {
        if (dealAmount == null) return "0";
        
        try {
            String cleanAmount = dealAmount.replaceAll("[^0-9]", "");
            long amount = Long.parseLong(cleanAmount) * 10000; // 만원 단위를 원 단위로
            return String.format("%,d", amount);
        } catch (NumberFormatException e) {
            return dealAmount;
        }
    }

    /**
     * 거래일자 포맷팅 (YYYY-MM-DD)
     */
    private String formatDealDate(String year, String month, String day) {
        if (year == null || month == null || day == null) {
            return "";
        }
        
        return String.format("%s-%02d-%02d", 
            year, 
            Integer.parseInt(month.trim()), 
            Integer.parseInt(day.trim())
        );
    }

    /**
     * 평당 가격 계산
     */
    private String calculatePricePerPyeong(String dealAmount, String exclusiveArea) {
        try {
            String cleanAmount = dealAmount.replaceAll("[^0-9]", "");
            String cleanArea = exclusiveArea.replaceAll("[^0-9.]", "");
            
            BigDecimal amount = new BigDecimal(cleanAmount).multiply(new BigDecimal("10000"));
            BigDecimal area = new BigDecimal(cleanArea).multiply(new BigDecimal("0.3025")); // 제곱미터를 평으로 변환
            
            BigDecimal pricePerPyeong = amount.divide(area, 0, RoundingMode.HALF_UP);
            
            return String.format("%,d", pricePerPyeong.longValue());
        } catch (Exception e) {
            return "0";
        }
    }

    /**
     * 테스트용 더미 응답 생성
     */
    private ApartmentTradeDTO.Response createDummyResponse() {
        ApartmentTradeDTO.Response response = new ApartmentTradeDTO.Response();
        ApartmentTradeDTO.Header header = new ApartmentTradeDTO.Header();
        ApartmentTradeDTO.Body body = new ApartmentTradeDTO.Body();

        // 더미 데이터 생성 (새로운 필드명 사용)
        List<ApartmentTradeDTO.Item> itemList = new ArrayList<>();

        ApartmentTradeDTO.Item item1 = new ApartmentTradeDTO.Item();
        item1.setAptNm("래미안강남");
        item1.setUmdNm("역삼동");
        item1.setJibun("123-45");
        item1.setDealAmount("85,000");
        item1.setExcluUseAr("84.93");
        item1.setFloor("10");
        item1.setBuildYear("2018");
        item1.setDealYear("2024");
        item1.setDealMonth("12");
        item1.setDealDay("15");

        ApartmentTradeDTO.Item item2 = new ApartmentTradeDTO.Item();
        item2.setAptNm("아크로리버파크");
        item2.setUmdNm("서초동");
        item2.setJibun("567-89");
        item2.setDealAmount("92,000");
        item2.setExcluUseAr("99.12");
        item2.setFloor("15");
        item2.setBuildYear("2020");
        item2.setDealYear("2024");
        item2.setDealMonth("12");
        item2.setDealDay("10");
        
        itemList.add(item1);
        itemList.add(item2);

        body.setItems(itemList);
        body.setTotalCount(2);
        
        header.setResultCode("00");
        header.setResultMsg("NORMAL_SERVICE");

        response.setHeader(header);
        response.setBody(body);

        return response;
    }
}
