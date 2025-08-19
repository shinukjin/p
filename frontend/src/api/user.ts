import { apiClient } from './client';
import type { ApiResponse } from '../types/auth';

// 사용자 정보 조회
export const getUserInfo = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/user/info');
  return response.data;
};

// 사용자 정보 수정
export const updateUserInfo = async (userData: any) => {
  const response = await apiClient.put<ApiResponse<any>>('/user/info', userData);
  return response.data;
};

// 사용자 비밀번호 변경
export const changePassword = async (passwordData: any) => {
  const response = await apiClient.put<ApiResponse<void>>('/user/password', passwordData);
  return response.data;
};

// 사용자 계정 삭제
export const deleteUserAccount = async () => {
  const response = await apiClient.delete<ApiResponse<void>>('/user/account');
  return response.data;
};

// 사용자 활동 기록 조회
export const getUserActivityLog = async (params: string) => {
  const response = await apiClient.get<ApiResponse<any>>(`/user/activity?${params}`);
  return response.data;
};
