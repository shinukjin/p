package com.w.p.domain.apartment.service.impl;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.w.p.common.util.GlobalUtil;
import com.w.p.domain.apartment.dto.ApartmentTradeDTO;
import com.w.p.domain.apartment.service.ApartmentApiService;
import com.w.p.exception.apartment.ApartmentApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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

    @Value("${spring.profiles.active:prod}")
    private String activeProfile;

    @Value("${dummy.data.enabled:false}")
    private boolean dummyDataEnabled;

    private final RestTemplate restTemplate;
    private final XmlMapper xmlMapper;

    public ApartmentApiServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.xmlMapper = new XmlMapper();
        // 알 수 없는 필드 무시 설정
        this.xmlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public List<ApartmentTradeDTO.SimpleTradeInfo> getApartmentTrades(ApartmentTradeDTO.SearchRequest request) {
        try {
            log.debug("아파트 실거래가 API 호출 시작 - lawdCd: {}, dealYmd: {}", request.getLawdCd(), request.getDealYmd());

            // 파라미터 검증
            validateSearchRequest(request);

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

            log.debug("아파트 실거래가 API URL: {}", GlobalUtil.maskApiKey(url));

            // API 호출
            String response = restTemplate.getForObject(url, String.class);

            if (response == null || response.trim().isEmpty()) {
                log.warn("API 응답이 비어있습니다.");
                throw new ApartmentApiException("API 응답이 비어있습니다.");
            }

            log.debug("API 응답 수신 완료, 길이: {}", response.length());

            // XML을 JSON으로 변환 후 파싱
            ApartmentTradeDTO.Response xmlResponse = parseXmlResponse(response);
            
            if (xmlResponse == null ||
                xmlResponse.getBody() == null ||
            xmlResponse.getBody().getItems() == null) {
                log.warn("API 응답 데이터가 비어있습니다.");
                throw new ApartmentApiException("API 응답 데이터가 비어있습니다.");
            }

            List<ApartmentTradeDTO.Item> items = xmlResponse.getBody().getItems();
            log.debug("파싱된 아이템 개수: {}", items.size());

            // 응답 데이터 변환
            return convertToSimpleTradeInfo(items);

        } catch (HttpClientErrorException e) {
            log.error("API 호출 실패 (HTTP {}): {}", e.getStatusCode(), e.getMessage());
            throw new ApartmentApiException("API 호출 실패: " + e.getStatusCode(), e);
        } catch (RestClientException e) {
            log.error("네트워크 오류: {}", e.getMessage());
            throw new ApartmentApiException("네트워크 오류", e);
        } catch (ApartmentApiException e) {
            // 이미 변환된 예외는 그대로 던지기
            throw e;
        } catch (Exception e) {
            log.error("예상치 못한 오류: {}", e.getMessage());
            throw new ApartmentApiException("시스템 오류", e);
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
     * 검색 요청 파라미터 검증
     */
    private void validateSearchRequest(ApartmentTradeDTO.SearchRequest request) {
        if (GlobalUtil.isEmpty(request.getLawdCd())) {
            throw new ApartmentApiException("법정동코드가 비어있습니다.");
        }
        
        if (!GlobalUtil.isValidLawdCd(request.getLawdCd())) {
            throw new ApartmentApiException("법정동코드는 5자리 숫자여야 합니다: " + request.getLawdCd());
        }

        if (GlobalUtil.isEmpty(request.getDealYmd())) {
            throw new ApartmentApiException("거래년월이 비어있습니다.");
        }
        
        if (!GlobalUtil.isValidDealYmd(request.getDealYmd())) {
            throw new ApartmentApiException("거래년월은 YYYYMM 형식이어야 합니다: " + request.getDealYmd());
        }

        if (request.getNumOfRows() <= 0 || request.getNumOfRows() > 1000) {
            throw new ApartmentApiException("조회 건수는 1~1000 사이여야 합니다: " + request.getNumOfRows());
        }

        if (request.getPageNo() <= 0) {
            throw new ApartmentApiException("페이지 번호는 1 이상이어야 합니다: " + request.getPageNo());
        }
    }

    /**
     * XML 응답을 파싱
     */
    private ApartmentTradeDTO.Response parseXmlResponse(String xmlResponse) {
        try {
            log.debug("XML 응답 파싱 시작");
            // 민감한 정보가 포함될 수 있으므로 응답 길이만 로깅
            log.debug("XML 응답 길이: {}", xmlResponse.length());
            
            ApartmentTradeDTO.Response response = xmlMapper.readValue(xmlResponse, ApartmentTradeDTO.Response.class);
            log.debug("XML 파싱 성공");
            return response;

        } catch (Exception e) {
            log.error("XML 파싱 실패: {}", e.getMessage());
            // 프로덕션 환경에서는 더미 데이터 사용 금지
            if ("prod".equals(activeProfile) || !dummyDataEnabled) {
                log.error("프로덕션 환경이거나 더미 데이터가 비활성화되어 더미 데이터 사용 불가");
                throw new ApartmentApiException("데이터 파싱 실패", e);
            }
            
            log.warn("개발/테스트 환경에서 더미 데이터 사용");
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
            try {
                ApartmentTradeDTO.SimpleTradeInfo info = new ApartmentTradeDTO.SimpleTradeInfo();

                // 새로운 필드명에 맞춰 매핑
                info.setApartmentName(item.getAptNm());
                info.setDong(item.getUmdNm());
                info.setJibun(item.getJibun());
                info.setDealAmount(GlobalUtil.formatDealAmount(item.getDealAmount()));
                info.setExclusiveArea(item.getExcluUseAr());
                info.setFloor(item.getFloor());
                info.setBuildYear(item.getBuildYear());
                info.setDealDate(GlobalUtil.formatDealDate(item.getDealYear(), item.getDealMonth(), item.getDealDay()));
                info.setPricePerPyeong(GlobalUtil.calculatePricePerPyeong(item.getDealAmount(), item.getExcluUseAr()));

                result.add(info);
            } catch (Exception e) {
                log.warn("아이템 변환 중 오류 발생, 건너뜀: {}", e.getMessage());
                // 개별 아이템 변환 실패 시 해당 아이템만 건너뛰고 계속 진행
            }
        }

        return result;
    }



    /**
     * 테스트용 더미 응답 생성 (개발/테스트 환경에서만 사용)
     */
    private ApartmentTradeDTO.Response createDummyResponse() {
        if ("prod".equals(activeProfile)) {
            log.warn("프로덕션 환경에서 더미 데이터 사용 시도");
            return null;
        }
        
        ApartmentTradeDTO.Response response = new ApartmentTradeDTO.Response();
        ApartmentTradeDTO.Header header = new ApartmentTradeDTO.Header();
        ApartmentTradeDTO.Body body = new ApartmentTradeDTO.Body();

        // 더미 데이터 생성 (민감한 정보 제거)
        List<ApartmentTradeDTO.Item> itemList = new ArrayList<>();

        ApartmentTradeDTO.Item item1 = new ApartmentTradeDTO.Item();
        item1.setAptNm("테스트아파트1");
        item1.setUmdNm("테스트동");
        item1.setJibun("000-00");
        item1.setDealAmount("85,000");
        item1.setExcluUseAr("84.93");
        item1.setFloor("10");
        item1.setBuildYear("2018");
        item1.setDealYear("2025");
        item1.setDealMonth("12");
        item1.setDealDay("15");

        ApartmentTradeDTO.Item item2 = new ApartmentTradeDTO.Item();
        item2.setAptNm("테스트아파트2");
        item2.setUmdNm("테스트동");
        item2.setJibun("000-00");
        item2.setDealAmount("92,000");
        item2.setExcluUseAr("99.12");
        item2.setFloor("15");
        item2.setBuildYear("2020");
        item2.setDealYear("2025");
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
