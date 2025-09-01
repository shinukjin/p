import { apiClient } from './client';
import type { ApiResponse } from '../types/api';

// 관리자 관련 타입 정의
export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminInfo {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminLoginResponse {
  token: string;
  adminInfo: AdminInfo;
  expiresAt: number;
  expiresIn: number;
}

export interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export interface DashboardData {
  totalUsers: number;
  totalApartments: number;
  totalWeddingHalls: number;
  totalWeddingServices: number;
  todayVisitors: number;
  thisMonthVisitors: number;
  weeklyVisitors: number[];
  monthlyVisitors: number[];
}

export interface ChartData {
  label: string;
  value: number;
}

export interface UserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// 관리자 로그인
export const adminLogin = async (request: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> => {
  const response = await apiClient.post<ApiResponse<AdminLoginResponse>>('/admin/login', request);
  return response.data;
};

// 시스템 통계 조회
export const getSystemStatistics = async (): Promise<ApiResponse<SystemStatistics>> => {
  const response = await apiClient.get<ApiResponse<SystemStatistics>>('/admin/statistics');
  return response.data;
};

// 대시보드 데이터 조회
export const getDashboard = async (): Promise<ApiResponse<DashboardData>> => {
  const response = await apiClient.get<ApiResponse<DashboardData>>('/admin/dashboard');
  return response.data;
};

// 방문자 차트 데이터 조회
export const getVisitorChartData = async (): Promise<ApiResponse<ChartData[]>> => {
  const response = await apiClient.get<ApiResponse<ChartData[]>>('/admin/charts/visitors');
  return response.data;
};

// 월별 차트 데이터 조회
export const getMonthlyChartData = async (): Promise<ApiResponse<ChartData[]>> => {
  const response = await apiClient.get<ApiResponse<ChartData[]>>('/admin/charts/monthly');
  return response.data;
};

// 전체 사용자 목록 조회
export const getAllUsers = async (): Promise<ApiResponse<UserInfo[]>> => {
  const response = await apiClient.get<ApiResponse<UserInfo[]>>('/admin/users');
  return response.data;
};

// 사용자 목록 조회 (간단한 버전)
export const getUsers = async () => {
  const response = await apiClient.get<ApiResponse<any>>('/admin/users?size=100');
  return response.data;
};

// 사용자 검색
export const searchUsers = async (keyword: string): Promise<ApiResponse<UserInfo[]>> => {
  const response = await apiClient.get<ApiResponse<UserInfo[]>>(`/admin/users/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data;
};

// 사용자 상태 업데이트
export const updateUserStatus = async (userId: number, status: string): Promise<ApiResponse<UserInfo>> => {
  const response = await apiClient.put<ApiResponse<UserInfo>>(`/admin/users/${userId}/status?status=${status}`);
  return response.data;
};

// 사용자 역할 업데이트
export const updateUserRole = async (userId: number, role: string): Promise<ApiResponse<UserInfo>> => {
  const response = await apiClient.put<ApiResponse<UserInfo>>(`/admin/users/${userId}/role?role=${role}`);
  return response.data;
};

// 사용자 삭제
export const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${userId}`);
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

