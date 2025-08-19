import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  AdminLoginResponse,
  SignupRequest,
  SignupResponse,
  ApiResponse,
} from '../types/auth';

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
