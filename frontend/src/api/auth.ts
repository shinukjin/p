import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  AdminLoginResponse,
  SignupRequest,
  SignupResponse,
  ApiResponse,
} from '../types/auth';

// 사용자 정보 관련 타입 (백엔드 응답과 일치)
export interface UserInfo {
  id: number;
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  role: string;
  roleDescription: string;
  status: string;
  statusDescription: string;
  totalBudget?: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
}

export interface UpdateTotalBudgetRequest {
  totalBudget: number;
}

// 로그인 API
export const login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data;
};

// 관리자 로그인 API
export const adminLogin = async (data: LoginRequest): Promise<ApiResponse<AdminLoginResponse>> => {
  const response = await apiClient.post<ApiResponse<AdminLoginResponse>>('/admin/login', data);
  return response.data;
};

// 회원가입 API
export const signup = async (data: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
  const response = await apiClient.post<ApiResponse<SignupResponse>>('/auth/signup', data);
  return response.data;
};

// 토큰 검증 API (선택사항)
export const validateToken = async (): Promise<boolean> => {
  try {
    await apiClient.get('/auth/validate');
    return true;
  } catch {
    return false;
  }
};

// 로그아웃 (클라이언트 사이드)
export const logout = (): void => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// 현재 사용자 정보 조회 API
export const getCurrentUserInfo = async (): Promise<ApiResponse<UserInfo>> => {
  const response = await apiClient.get<ApiResponse<UserInfo>>('/auth/me');
  return response.data;
};

// 사용자 정보 업데이트 API
export const updateUserInfo = async (data: UpdateUserRequest): Promise<ApiResponse<void>> => {
  const response = await apiClient.put<ApiResponse<void>>('/auth/me', data);
  return response.data;
};

// 사용자 총 예산 업데이트 API
export const updateUserTotalBudget = async (data: UpdateTotalBudgetRequest): Promise<ApiResponse<void>> => {
  const response = await apiClient.put<ApiResponse<void>>('/auth/me/budget', data);
  return response.data;
};
