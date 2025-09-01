import { apiClient } from './client';
import type { RealEstateFormData, RealEstate } from '../types/realestate';
import type { ApiResponse } from '../types/auth';

// 부동산 목록 조회 (GET)
export const getRealEstates = async () => {
  const response = await apiClient.get<ApiResponse<RealEstate[]>>('/real-estates');
  return response.data;
};

// 부동산 상세 조회 (GET)
export const getRealEstate = async (id: number) => {
  const response = await apiClient.get<ApiResponse<RealEstate>>(`/real-estates/${id}`);
  return response.data;
};

// 부동산 등록 (POST)
export const registerRealEstate = async (data: FormData | RealEstateFormData) => {
  // FormData인 경우 헤더 설정하지 않음 (브라우저가 자동으로 boundary 설정)
  console.log("🚀 FormData 전송 시작");
  if (data instanceof FormData) {    
    console.log("formdata인경우 =================");
    // FormData 전송 시 Content-Type 헤더를 명시적으로 제거
    const response = await apiClient.post<ApiResponse<RealEstate>>('/real-estates', data, {
      headers: {
        'Content-Type': 'multipart/form-data' // 명시적으로 multipart 설정
      }
    });
    return response.data;
  } else {
    // 기존 방식 (JSON 데이터)
    const response = await apiClient.post<ApiResponse<RealEstate>>('/real-estates', data);
    return response.data;
  }
};

// 부동산 수정 (POST)
export const updateRealEstate = async (id: number, data: RealEstateFormData) => {
  const response = await apiClient.post<ApiResponse<RealEstate>>(`/real-estates/${id}/update`, data);
  return response.data;
};

// 부동산 삭제 (POST)
export const deleteRealEstate = async (id: number) => {
  const response = await apiClient.post<ApiResponse<void>>(`/real-estates/${id}/delete`);
  return response.data;
};

// 북마크 토글 (POST)
export const toggleBookmark = async (id: number) => {
  const response = await apiClient.post<ApiResponse<RealEstate>>(`/real-estates/${id}/bookmark`);
  return response.data;
};

// 부동산 검색 (POST)
export const searchRealEstates = async (searchData: any) => {
  const response = await apiClient.post<ApiResponse<RealEstate[]>>('/real-estates/search', searchData);
  return response.data;
};
