import { apiClient } from './client';
import type { ApiResponse } from '../types/auth';

// 관리자 대시보드 통계 조회
export const getDashboardStats = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/admin/dashboard');
  return response.data;
};

// 사용자 목록 조회 (간단한 버전)
export const getUsers = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/admin/users?size=100');
  return response.data;
};

// 사용자 삭제
export const deleteUser = async (userId: number) => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${userId}`);
  return response.data;
};

// 관리자 대시보드 통계 조회 (기존 함수명 유지)
export const getAdminDashboard = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/admin/dashboard');
  return response.data;
};

// 관리자 목록 조회
export const getAdminList = async (params: string) => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/list?${params}`);
  return response.data;
};

// 관리자 정보 조회
export const getAdminInfo = async (adminId: number) => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/${adminId}`);
  return response.data;
};

// 관리자 상태 변경
export const updateAdminStatus = async (adminId: number, status: string) => {
  const response = await apiClient.put<ApiResponse<void>>(`/admin/${adminId}/status?status=${status}`);
  return response.data;
};

// 관리자 삭제
export const deleteAdmin = async (adminId: number) => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/${adminId}`);
  return response.data;
};

// 사용자 목록 조회 (관리자용)
export const getUserListForAdmin = async (params: string) => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/users?${params}`);
  return response.data;
};

// 사용자 정보 조회 (관리자용)
export const getUserInfoForAdmin = async (userId: number) => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/users/${userId}`);
  return response.data;
};

// 사용자 상태 변경 (관리자용)
export const updateUserStatus = async (userId: number, status: string) => {
  const response = await apiClient.put<ApiResponse<void>>(`/admin/users/${userId}/status?status=${status}`);
  return response.data;
};

// 사용자 역할 변경 (관리자용)
export const updateUserRole = async (userId: number, role: string) => {
  const response = await apiClient.put<ApiResponse<void>>(`/admin/users/${userId}/role?role=${role}`);
  return response.data;
};

// 사용자 계정 잠금 해제 (관리자용)
export const unlockUser = async (userId: number) => {
  const response = await apiClient.put<ApiResponse<void>>(`/admin/users/${userId}/unlock`);
  return response.data;
};

// 사용자 통계 조회 (관리자용)
export const getUserStatistics = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/admin/users/statistics');
  return response.data;
};

// 결혼식장 목록 조회
export const getWeddingHalls = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/admin/wedding-halls');
  return response.data;
};

// 결혼식장 상세 조회
export const getWeddingHall = async (id: number) => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/wedding-halls/${id}`);
  return response.data;
};

// 결혼식장 생성
export const createWeddingHall = async (data: any) => {
  const response = await apiClient.post<ApiResponse<any>>('/admin/wedding-halls', data);
  return response.data;
};

// 결혼식장 수정
export const updateWeddingHall = async (id: number, data: any) => {
  const response = await apiClient.put<ApiResponse<any>>(`/admin/wedding-halls/${id}`, data);
  return response.data;
};

// 결혼식장 삭제
export const deleteWeddingHall = async (id: number) => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/wedding-halls/${id}`);
  return response.data;
};
