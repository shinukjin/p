import { apiClient } from './client';
import type { ApiResponse } from '../types/auth';

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
  
  // 추가 필터링 조건
  apartmentName?: string;  // 아파트명 (부분 검색)
  dong?: string;           // 동
  minPrice?: number;       // 최소 거래금액 (만원)
  maxPrice?: number;       // 최대 거래금액 (만원)
  minArea?: number;        // 최소 전용면적 (제곱미터)
  maxArea?: number;        // 최대 전용면적 (제곱미터)
  minFloor?: number;       // 최소 층수
  maxFloor?: number;       // 최대 층수
  buildYear?: number;      // 건축년도
  dealDateFrom?: string;   // 거래일자 시작 (YYYY-MM-DD)
  dealDateTo?: string;     // 거래일자 종료 (YYYY-MM-DD)
  
  // 정렬 조건
  sortBy?: string;         // 정렬 기준 (dealDate, dealAmount, exclusiveArea, floor, buildYear)
  sortOrder?: string;      // 정렬 순서 (asc, desc)
}

// 지역코드 조회 (공통코드 API 사용)
export const getRegionCodes = async () => {
  const response = await apiClient.get<ApiResponse<RegionCode[]>>('/common-codes/001');
  return response.data;
};

// 아파트 매매 실거래가 조회
export const getApartmentTrades = async (params: ApartmentSearchParams) => {
  const response = await apiClient.get<ApiResponse<ApartmentTrade[]>>('/apartment/trades', { params });
  return response.data;
};

// 아파트 매매 실거래가 상세 조회
export const getApartmentTradeDetail = async (tradeId: string) => {
  const response = await apiClient.get<ApiResponse<ApartmentTrade>>(`/apartment/trades/${tradeId}`);
  return response.data;
};

// 아파트 매매 통계 조회
export const getApartmentStatistics = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/apartment/statistics');
  return response.data;
};

// 아파트 검색
export const searchApartments = async (params: ApartmentSearchParams) => {
  const response = await apiClient.post<ApiResponse<ApartmentTrade[]>>('/apartment/search', params);
  return response.data;
};

// 최근 거래 내역 조회
export const getRecentTrades = async (lawdCd: string) => {
  const response = await apiClient.get('/apartments/recent-trades', {
    params: { lawdCd }
  });
  return response.data;
};
