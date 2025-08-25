// 인증 관련 타입 정의

export interface User {
  id: number;
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: number; // 토큰 만료 시간 (Unix timestamp)
  expiresIn: number; // 토큰 만료까지 남은 시간 (초)
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
