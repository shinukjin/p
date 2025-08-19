import { apiClient } from './client';
import type { ApiResponse } from '../types/auth';

// 지도 관련 타입 정의
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressInfo {
  address: string;
  roadAddress?: string;
  coordinates: Coordinates;
  regionCode: string;
}

// 주소 검색 (지오코딩)
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    const response = await apiClient.get<ApiResponse<AddressInfo>>(`/map/geocode?address=${encodeURIComponent(address)}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data.coordinates;
    }
    return null;
  } catch (error) {
    console.error('지오코딩 실패:', error);
    return null;
  }
};

// 좌표로 주소 검색 (역지오코딩)
export const getAddressFromCoordinates = async (lat: number, lng: number) => {
  const response = await apiClient.get<ApiResponse<AddressInfo>>(`/map/reverse-geocode?lat=${lat}&lng=${lng}`);
  return response.data;
};

// 지역 정보 조회
export const getRegionInfo = async (regionCode: string) => {
  const response = await apiClient.get<ApiResponse<any>>(`/map/region/${regionCode}`);
  return response.data;
};

// 지도 설정 조회
export const getMapSettings = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/map/settings');
  return response.data;
};

// 부동산 지도 URL 생성 (좌표 기반 진입)
export const createPropertyMapUrl = (coordinates: Coordinates, type: String, zoom: number = 15): string => {
  return `https://new.land.naver.com/complexes?ms=${coordinates.lat},${coordinates.lng}&a=APT&b=${type}&e=RETAIL`;
};


