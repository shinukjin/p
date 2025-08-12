import { apiClient } from './client';

// 좌표 타입 정의
export interface Coordinates {
  lat: number;
  lng: number;
}

// 지오코딩 요청 타입
export interface GeocodeRequest {
  address: string;
}

// 지오코딩 응답 타입
export interface GeocodeResponse {
  coordinates: Coordinates;
  formattedAddress: string;
}

/**
 * 주소를 좌표로 변환하는 API
 * @param address 변환할 주소
 * @returns 좌표 정보
 */
export const geocodeAddress = async (address: string) => {
  const response = await apiClient.get('/map/geocode', {
    params: { address }
  });
  return response.data;
};



/**
 * 지도에서 사용할 아파트 주소 포맷팅
 * @param dong 동 이름
 * @param jibun 지번
 * @returns 포맷된 주소
 */
export const formatAddressForMap = (dong: string, jibun: string): string => {
  // 기본적인 주소 포맷팅
  return `${dong} ${jibun}`.trim();
};

/**
 * 네이버 부동산 URL 생성 (좌표 기반)
 * @param lat 위도
 * @param lng 경도
 * @param placeName 장소명
 * @param zoom 줌 레벨 (기본값: 17)
 * @returns 네이버 부동산 URL
 */
export const createNaverMapUrl = (
  lat: number,
  lng: number,
  placeName: string,
  zoom: number = 17
): string => {
  // 네이버 부동산 URL 형식
  const encodedPlaceName = encodeURIComponent(placeName);
  console.log('좌표:', lng, lat, '아파트명:', placeName);

  // 네이버 부동산에서 해당 위치의 아파트 목록을 보여주는 URL
  // ms: 지도 중심 좌표 (위도,경도,줌레벨)
  // a: 매물 타입 (APT:아파트, PRE:분양권)
  // b: 거래 타입 (A1:매매, B1:전세, B2:월세, B3:단기임대)
  // e: 기타 옵션 (RETAIL:일반)
  // q: 검색 키워드 (아파트명)
  return `https://new.land.naver.com/complexes?ms=${lat},${lng},${zoom}&a=APT:PRE&b=A1:B1:B2&e=RETAIL&q=${encodedPlaceName}`;
};

/**
 * 네이버 부동산 검색 URL 생성 (주소 기반)
 * @param searchQuery 검색할 주소나 장소명
 * @returns 네이버 부동산 검색 URL
 */
export const createNaverMapSearchUrl = (searchQuery: string): string => {
  const encodedQuery = encodeURIComponent(searchQuery);
  return `https://new.land.naver.com/search?keyword=${encodedQuery}`;
};

/**
 * 매물 정보로 네이버 부동산 URL 생성
 * @param dong 동 이름
 * @param jibun 지번
 * @param apartmentName 아파트명
 * @param coordinates 좌표 (선택사항)
 * @returns 네이버 부동산 URL
 */
export const createPropertyMapUrl = (
  dong: string,
  jibun: string,
  apartmentName: string,
  coordinates?: Coordinates
): string => {
  if (coordinates) {
    // 좌표가 있는 경우 해당 위치의 아파트 단지 목록 표시
    // 아파트명을 검색 키워드로 추가하여 해당 아파트가 하이라이트되도록 함
    const searchKeyword = encodeURIComponent(apartmentName);
    return `https://new.land.naver.com/complexes?ms=${coordinates.lat},${coordinates.lng},17&a=APT:PRE&b=A1&e=RETAIL&q=${searchKeyword}`;
  } else {
    // 좌표가 없는 경우 동, 지번, 아파트명으로 검색
    const searchQuery = `${dong} ${jibun} ${apartmentName}`;
    return createNaverMapSearchUrl(searchQuery);
  }
};


