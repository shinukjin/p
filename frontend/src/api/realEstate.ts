import { apiClient } from './client';
import type { RealEstateFormData } from '../types/realestate';
import type { ApiResponse } from '../types/auth';

// 부동산 목록 조회 (GET)
export const getRealEstates = async () => {
  const response = await apiClient.get<ApiResponse<any[]>>('/real-estates');
  return response.data;
};

// 부동산 상세 조회 (GET)
export const getRealEstate = async (id: number) => {
  const response = await apiClient.get<ApiResponse<any>>(`/real-estates/${id}`);
  return response.data;
};

// 부동산 등록 (POST)
export const registerRealEstate = async (data: RealEstateFormData) => {
  const response = await apiClient.post<ApiResponse<any>>('/real-estates', data);
  return response.data;
};

// 부동산 수정 (POST)
export const updateRealEstate = async (id: number, data: RealEstateFormData) => {
  const response = await apiClient.post<ApiResponse<any>>(`/real-estates/${id}/update`, data);
  return response.data;
};

// 부동산 삭제 (POST)
export const deleteRealEstate = async (id: number) => {
  const response = await apiClient.post<ApiResponse<void>>(`/real-estates/${id}/delete`);
  return response.data;
};

// 북마크 토글 (POST)
export const toggleBookmark = async (id: number) => {
  const response = await apiClient.post<ApiResponse<any>>(`/real-estates/${id}/bookmark`);
  return response.data;
};

// 부동산 검색 (POST)
export const searchRealEstates = async (searchData: any) => {
  const response = await apiClient.post<ApiResponse<any[]>>('/real-estates/search', searchData);
  return response.data;
};
