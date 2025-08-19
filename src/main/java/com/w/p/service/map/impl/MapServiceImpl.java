package com.w.p.service.map.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.w.p.dto.map.MapDTO;
import com.w.p.service.map.MapService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * 지도 관련 서비스 구현체
 */
@Service
@Slf4j
public class MapServiceImpl implements MapService {

    @Value("${naver.map.client.id}")
    private String naverMapClientId;

    @Value("${naver.map.client.secret}")
    private String naverMapClientSecret;

    @Value("${naver.map.geocode.url}")
    private String geocodeApiUrl;

    @Value("${naver.map.reverse.geocode.url}")
    private String reverseGeocodeApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public MapDTO.GeocodeResponse geocodeAddress(String address) {
        try {
            log.debug("주소 지오코딩 시작 - address: {}", address);


            // API 키가 설정되지 않은 경우 임시 좌표 반환
            if (naverMapClientId.isEmpty() || naverMapClientSecret.isEmpty()) {
                log.warn("네이버 지도 API 키가 설정되지 않음. 임시 좌표 반환");
                return createMockGeocodeResponse(address);
            }

            // 네이버 지오코딩 API 호출
            // 한글 주소를 URL 인코딩
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            log.info(encodedAddress);

            URI uri = UriComponentsBuilder.fromUriString(geocodeApiUrl)
                    .queryParam("query", encodedAddress)
                    .build(true) // 이미 인코딩된 값이므로 추가 인코딩 방지
                    .toUri();

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-ncp-apigw-api-key-id", naverMapClientId);
            headers.set("x-ncp-apigw-api-key", naverMapClientSecret);
            //headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    uri, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                log.debug("네이버 지오코딩 API 응답: {}", response.getBody());

                MapDTO.NaverGeocodeApiResponse apiResponse =
                    objectMapper.readValue(response.getBody(), MapDTO.NaverGeocodeApiResponse.class);
                    
                if ("OK".equals(apiResponse.getStatus()) && 
                    apiResponse.getAddresses() != null && 
                    !apiResponse.getAddresses().isEmpty()) {

                    MapDTO.NaverGeocodeApiResponse.Address firstAddress = apiResponse.getAddresses().get(0);
                    MapDTO.Coordinates coordinates = new MapDTO.Coordinates(
                        Double.parseDouble(firstAddress.getY()), // 위도
                        Double.parseDouble(firstAddress.getX())  // 경도
                    );

                    String formattedAddress = firstAddress.getRoadAddress() != null ? 
                        firstAddress.getRoadAddress() : firstAddress.getJibunAddress();

                    log.debug("지오코딩 성공 - lat: {}, lng: {}, address: {}", 
                        coordinates.getLat(), coordinates.getLng(), formattedAddress);

                    return new MapDTO.GeocodeResponse(coordinates, formattedAddress);
                } else {
                    log.warn("지오코딩 결과 없음 - address: {}", address);
                    return MapDTO.GeocodeResponse.error("주소를 찾을 수 없습니다.");
                }
            } else {
                log.error("지오코딩 API 호출 실패 - status: {}", response.getStatusCode());
                return MapDTO.GeocodeResponse.error("지오코딩 API 호출 실패");
            }

        } catch (Exception e) {
            log.error("지오코딩 중 오류 발생", e);
            return MapDTO.GeocodeResponse.error("지오코딩 처리 중 오류 발생: " + e.getMessage());
        }
    }



    /**
     * API 키가 없을 때 사용할 임시 지오코딩 응답 생성
     */
    private MapDTO.GeocodeResponse createMockGeocodeResponse(String address) {
        // 서울 중심 근처의 랜덤 좌표 생성
        double baseLat = 37.5665;
        double baseLng = 126.9780;
        double randomLat = baseLat + (Math.random() - 0.5) * 0.02; // ±0.01도 범위
        double randomLng = baseLng + (Math.random() - 0.5) * 0.02;

        MapDTO.Coordinates coordinates = new MapDTO.Coordinates(randomLat, randomLng);
        return new MapDTO.GeocodeResponse(coordinates, address + " (임시 좌표)");
    }


}
