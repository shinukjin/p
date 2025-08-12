package com.w.p.dto.map;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 지도 관련 DTO
 */
public class MapDTO {

    /**
     * 좌표 정보
     */
    @Getter
    @Setter
    public static class Coordinates {
        private double lat;  // 위도
        private double lng;  // 경도

        public Coordinates() {}

        public Coordinates(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    /**
     * 지오코딩 응답
     */
    @Getter
    @Setter
    public static class GeocodeResponse {
        private Coordinates coordinates;
        private String formattedAddress;
        private String status;
        private String errorMessage;

        public GeocodeResponse() {}

        public GeocodeResponse(Coordinates coordinates, String formattedAddress) {
            this.coordinates = coordinates;
            this.formattedAddress = formattedAddress;
            this.status = "OK";
        }

        public static GeocodeResponse error(String errorMessage) {
            GeocodeResponse response = new GeocodeResponse();
            response.setStatus("ERROR");
            response.setErrorMessage(errorMessage);
            return response;
        }
    }

    /**
     * API 키 검증 결과
     */
    @Getter
    @Setter
    public static class ApiKeyValidation {
        private boolean valid;
        private String message;
    }

    /**
     * 지도 설정 정보
     */
    @Getter
    @Setter
    public static class MapConfig {
        private String clientId;        // 네이버 지도 클라이언트 ID (마스킹된 버전)
        private int defaultZoom;        // 기본 줌 레벨
        private Coordinates defaultCenter; // 기본 중심 좌표
        private boolean apiKeyConfigured; // API 키 설정 여부

        public MapConfig() {
            this.defaultZoom = 17;
            this.defaultCenter = new Coordinates(37.5665, 126.9780); // 서울 시청
            this.apiKeyConfigured = false;
        }
    }

    /**
     * 주변 부동산 정보
     */
    @Getter
    @Setter
    public static class NearbyProperty {
        private String apartmentName;
        private String address;
        private Coordinates coordinates;
        private String recentDealAmount;
        private String recentDealDate;
        private double distance; // 중심점으로부터의 거리 (미터)
    }

    /**
     * 주변 부동산 조회 응답
     */
    @Getter
    @Setter
    public static class NearbyPropertiesResponse {
        private List<NearbyProperty> properties;
        private int totalCount;
        private Coordinates searchCenter;
        private int searchRadius;

        public NearbyPropertiesResponse() {}

        public NearbyPropertiesResponse(List<NearbyProperty> properties, 
                                      Coordinates searchCenter, 
                                      int searchRadius) {
            this.properties = properties;
            this.totalCount = properties != null ? properties.size() : 0;
            this.searchCenter = searchCenter;
            this.searchRadius = searchRadius;
        }
    }

    /**
     * 네이버 지오코딩 API 응답 (내부 사용)
     */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NaverGeocodeApiResponse {

        private String status;
        private Meta meta;
        private List<Address> addresses;

        @Getter
        @Setter
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Meta {
            private int totalCount;
            private int page;
            private int count;
        }

        @Getter
        @Setter
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Address {
            private String roadAddress;
            private String jibunAddress;
            private String englishAddress;
            private AddressElement[] addressElements;
            private String x; // 경도
            private String y; // 위도
            private double distance;

            @Getter
            @Setter
            @JsonIgnoreProperties(ignoreUnknown = true)
            public static class AddressElement {
                private String[] types;
                private String longName;
                private String shortName;
                private String code;
            }
        }
    }

    /**
     * 네이버 역지오코딩 API 응답 (내부 사용)
     */
    @Getter
    @Setter
    public static class NaverReverseGeocodeApiResponse {
        private String status;
        private List<Result> results;

        @Getter
        @Setter
        public static class Result {
            private String name;
            private Code code;
            private Region region;

            @Getter
            @Setter
            public static class Code {
                private String id;
                private String type;
                private String mappingId;
            }

            @Getter
            @Setter
            public static class Region {
                private Area area0;
                private Area area1;
                private Area area2;
                private Area area3;
                private Area area4;

                @Getter
                @Setter
                public static class Area {
                    private String name;
                    private Coords coords;

                    @Getter
                    @Setter
                    public static class Coords {
                        private Center center;

                        @Getter
                        @Setter
                        public static class Center {
                            private String crs;
                            private double x;
                            private double y;
                        }
                    }
                }
            }
        }
    }
}
