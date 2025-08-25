// 인증 관련 타입 정의

export interface User {
  id: number;
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  roleDescription?: string; // 역할 한글 설명
  status?: string;
  statusDescription?: string; // 상태 한글 설명
  totalBudget?: number; // 총 사용가능 예산
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string; // 수정일 추가
}

// 로그인 API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: number;
  expiresIn: number;
  user: User; // 사용자 정보 추가
}

export interface SignupRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  message: string;
}

export interface AdminLoginResponse {
  token: string;
  adminInfo: User;
  expiresAt: number; // 토큰 만료 시간 (Unix timestamp)
  expiresIn: number; // 토큰 만료까지 남은 시간 (초)
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}

// 토큰 업데이트 응답 타입
export interface TokenUpdateResponse {
  token: string;
  expiresAt: number;
  expiresIn: number;
  user: User; // 사용자 정보 추가
}
