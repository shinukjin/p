import { apiClient } from './client';

// 아파트 실거래가 관련 타입
export interface ApartmentTrade {
  apartmentName: string;
  dong: string;
  jibun: string;
  dealAmount: string;
  exclusiveArea: string;
  floor: string;
  buildYear: string;
  dealDate: string;
  pricePerPyeong: string;
}

export interface RegionCode {
  code: string;
  name: string;
}

export interface ApartmentSearchParams {
  lawdCd: string;      // 법정동코드
  dealYmd?: string;    // 거래년월 (YYYYMM)
  numOfRows?: number;  // 조회 건수
  pageNo?: number;     // 페이지 번호
}

// 아파트 실거래가 조회
export const getApartmentTrades = async (params: ApartmentSearchParams) => {
  const response = await apiClient.get('/apartment/trades', { params });
  return response.data;
};

// 최근 거래 내역 조회
export const getRecentTrades = async (lawdCd: string) => {
  const response = await apiClient.get('/apartment/recent-trades', {
    params: { lawdCd }
  });
  return response.data;
};

// 지역코드 목록 조회
export const getRegionCodes = async () => {
  const response = await apiClient.get('/apartment/region-codes');
  return response.data;
};
