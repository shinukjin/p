import { apiClient } from './client';

export interface ApiLog {
  id: number;
  userId?: number;
  username: string;
  endpoint: string;
  method: string;
  requestBody?: string;
  queryParameters?: string;
  responseStatus: number;
  errorMessage?: string;
  executionTime: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  logLevel: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
}

export interface LogFilters {
  userId?: number;
  endpoint?: string;
  logLevel?: ApiLog['logLevel'];
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface LogStatistics {
  totalLogs: number;
  infoLogs: number;
  warningLogs: number;
  errorLogs: number;
  debugLogs: number;
  todayLogs: number;
  weekLogs: number;
  monthLogs: number;
}

export interface PaginatedLogs {
  content: ApiLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 로그 목록 조회 (필터링)
export const getLogs = async (filters: LogFilters): Promise<PaginatedLogs> => {
  const params = new URLSearchParams();
  
  if (filters.userId) params.append('userId', filters.userId.toString());
  if (filters.endpoint) params.append('endpoint', filters.endpoint);
  if (filters.logLevel) params.append('logLevel', filters.logLevel);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.size !== undefined) params.append('size', filters.size.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortDir) params.append('sortDir', filters.sortDir);
  
  const response = await apiClient.get(`/admin/logs?${params.toString()}`);
  return response.data.data;
};

// 로그 레벨별 조회
export const getLogsByLevel = async (logLevel: ApiLog['logLevel'], page = 0, size = 20): Promise<PaginatedLogs> => {
  const response = await apiClient.get(`/admin/logs/level/${logLevel}?page=${page}&size=${size}`);
  return response.data.data;
};

// 사용자별 로그 조회
export const getLogsByUser = async (userId: number, page = 0, size = 20): Promise<PaginatedLogs> => {
  const response = await apiClient.get(`/admin/logs/user/${userId}?page=${page}&size=${size}`);
  return response.data.data;
};

// 엔드포인트별 로그 조회
export const getLogsByEndpoint = async (endpoint: string, page = 0, size = 20): Promise<PaginatedLogs> => {
  const response = await apiClient.get(`/admin/logs/endpoint?endpoint=${endpoint}&page=${page}&size=${size}`);
  return response.data.data;
};

// 날짜 범위별 로그 조회
export const getLogsByDateRange = async (startDate: string, endDate: string, page = 0, size = 20): Promise<PaginatedLogs> => {
  const response = await apiClient.get(`/admin/logs/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`);
  return response.data.data;
};

// 에러 로그만 조회
export const getErrorLogs = async (page = 0, size = 20): Promise<PaginatedLogs> => {
  const response = await apiClient.get(`/admin/logs/errors?page=${page}&size=${size}`);
  return response.data.data;
};

// 로그 통계 조회
export const getLogStatistics = async (): Promise<LogStatistics> => {
  const response = await apiClient.get('/admin/logs/statistics');
  return response.data.data;
};

// 특정 로그 상세 조회
export const getLogById = async (logId: number): Promise<ApiLog> => {
  const response = await apiClient.get(`/admin/logs/${logId}`);
  return response.data.data;
};

// 오래된 로그 정리
export const cleanupOldLogs = async (): Promise<string> => {
  const response = await apiClient.post('/admin/logs/cleanup');
  return response.data.data;
};
