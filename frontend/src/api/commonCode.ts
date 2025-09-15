import { apiClient } from './client';

// 공통코드 타입 정의
export interface CommonCode {
  id: number;
  codeGroup: string;
  codeValue: string;
  codeName: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CommonCodeGroup {
  codeGroup: string;
  description: string;
  codeCount: number;
}

export interface CreateCommonCodeRequest {
  codeGroup: string;
  codeValue: string;
  codeName: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  parentId?: number;
}

export interface UpdateCommonCodeRequest {
  codeName?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  parentId?: number;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// 공통코드 API 서비스
export const commonCodeApi = {
  // 코드 그룹별 활성 코드 목록 조회
  getActiveCodesByGroup: async (codeGroup: string): Promise<ApiResponse<CommonCode[]>> => {
    const response = await apiClient.get(`/common-codes/${codeGroup}`);
    return response.data;
  },

  // 코드 그룹별 모든 코드 목록 조회 (관리자용)
  getAllCodesByGroup: async (codeGroup: string): Promise<ApiResponse<CommonCode[]>> => {
    const response = await apiClient.get(`/common-codes/${codeGroup}/all`);
    return response.data;
  },

  // 코드 그룹과 값으로 특정 코드 조회
  getCodeByGroupAndValue: async (codeGroup: string, codeValue: string): Promise<ApiResponse<CommonCode>> => {
    const response = await apiClient.get(`/common-codes/${codeGroup}/${codeValue}`);
    return response.data;
  },

  // 코드명으로 검색
  searchCodesByName: async (codeName: string): Promise<ApiResponse<CommonCode[]>> => {
    const response = await apiClient.get(`/common-codes/search?codeName=${encodeURIComponent(codeName)}`);
    return response.data;
  },

  // 코드 그룹과 코드명으로 검색
  searchCodesByGroupAndName: async (codeGroup: string, codeName: string): Promise<ApiResponse<CommonCode[]>> => {
    const response = await apiClient.get(`/common-codes/${codeGroup}/search?codeName=${encodeURIComponent(codeName)}`);
    return response.data;
  },

  // 부모 코드로 하위 코드 목록 조회
  getChildCodes: async (parentId: number): Promise<ApiResponse<CommonCode[]>> => {
    const response = await apiClient.get(`/common-codes/parent/${parentId}/children`);
    return response.data;
  },

  // 최상위 코드 목록 조회
  getTopLevelCodes: async (): Promise<ApiResponse<CommonCode[]>> => {
    const response = await apiClient.get('/common-codes/top-level');
    return response.data;
  },

  // 모든 활성화된 코드 그룹 목록 조회
  getCodeGroups: async (): Promise<ApiResponse<CommonCodeGroup[]>> => {
    const response = await apiClient.get('/common-codes/groups');
    return response.data;
  },

  // 코드 생성 (관리자용)
  createCode: async (request: CreateCommonCodeRequest): Promise<ApiResponse<CommonCode>> => {
    const response = await apiClient.post('/common-codes', request);
    return response.data;
  },

  // 코드 수정 (관리자용)
  updateCode: async (codeId: number, request: UpdateCommonCodeRequest): Promise<ApiResponse<CommonCode>> => {
    const response = await apiClient.put(`/common-codes/${codeId}`, request);
    return response.data;
  },

  // 코드 비활성화 (관리자용)
  deactivateCode: async (codeId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/common-codes/${codeId}/deactivate`);
    return response.data;
  },

  // 코드 완전 삭제 (관리자용)
  deleteCode: async (codeId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/common-codes/${codeId}`);
    return response.data;
  }
};

// 편의 함수들
export const getCommonCodes = commonCodeApi.getAllCodesByGroup;
export const getCommonCodeGroups = commonCodeApi.getCodeGroups;
export const createCommonCode = commonCodeApi.createCode;
export const updateCommonCode = commonCodeApi.updateCode;
export const deleteCommonCode = commonCodeApi.deleteCode;
