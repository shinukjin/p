import { apiClient } from './client';
import type { Schedule, ScheduleFormData, ScheduleSummary, ScheduleTypeSummary, ScheduleType } from '../types/schedule';
import type { ApiResponse } from '../types/api';

// 일정 목록 조회
export const getSchedules = async (userId: number, type?: ScheduleType): Promise<ApiResponse<Schedule[]>> => {
  const params = new URLSearchParams({ userId: userId.toString() });
  if (type) {
    params.append('type', type);
  }
  
  const response = await apiClient.get<ApiResponse<Schedule[]>>(`/schedules?${params}`);
  return response.data;
};

// 일정 상세 조회
export const getSchedule = async (scheduleId: number, userId: number): Promise<ApiResponse<Schedule>> => {
  const response = await apiClient.get<ApiResponse<Schedule>>(`/schedules/${scheduleId}?userId=${userId}`);
  return response.data;
};

// 일정 생성
export const createSchedule = async (userId: number, scheduleData: ScheduleFormData): Promise<ApiResponse<Schedule>> => {
  const response = await apiClient.post<ApiResponse<Schedule>>(`/schedules?userId=${userId}`, scheduleData);
  return response.data;
};

// 일정 수정
export const updateSchedule = async (scheduleId: number, userId: number, scheduleData: Partial<ScheduleFormData>): Promise<ApiResponse<Schedule>> => {
  const response = await apiClient.put<ApiResponse<Schedule>>(`/schedules/${scheduleId}?userId=${userId}`, scheduleData);
  return response.data;
};

// 일정 완료 처리
export const completeSchedule = async (scheduleId: number, userId: number): Promise<ApiResponse<Schedule>> => {
  const response = await apiClient.patch<ApiResponse<Schedule>>(`/schedules/${scheduleId}/complete?userId=${userId}`);
  return response.data;
};

// 일정 삭제
export const deleteSchedule = async (scheduleId: number, userId: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/schedules/${scheduleId}?userId=${userId}`);
  return response.data;
};

// 오늘 일정 조회
export const getTodaySchedules = async (userId: number): Promise<ApiResponse<Schedule[]>> => {
  const response = await apiClient.get<ApiResponse<Schedule[]>>(`/schedules/today?userId=${userId}`);
  return response.data;
};

// 이번 주 일정 조회
export const getWeekSchedules = async (userId: number): Promise<ApiResponse<Schedule[]>> => {
  const response = await apiClient.get<ApiResponse<Schedule[]>>(`/schedules/week?userId=${userId}`);
  return response.data;
};

// 임박한 일정 조회 (3일 이내)
export const getUpcomingSchedules = async (userId: number): Promise<ApiResponse<Schedule[]>> => {
  const response = await apiClient.get<ApiResponse<Schedule[]>>(`/schedules/upcoming?userId=${userId}`);
  return response.data;
};

// 기한 초과 일정 조회
export const getOverdueSchedules = async (userId: number): Promise<ApiResponse<Schedule[]>> => {
  const response = await apiClient.get<ApiResponse<Schedule[]>>(`/schedules/overdue?userId=${userId}`);
  return response.data;
};

// D-Day 기준 일정 조회
export const getSchedulesByDDay = async (userId: number, days: number): Promise<ApiResponse<Schedule[]>> => {
  const response = await apiClient.get<ApiResponse<Schedule[]>>(`/schedules/dday/${days}?userId=${userId}`);
  return response.data;
};

// 일정 완료율 통계
export const getScheduleStatsByStatus = async (userId: number): Promise<ApiResponse<ScheduleSummary[]>> => {
  const response = await apiClient.get<ApiResponse<ScheduleSummary[]>>(`/schedules/stats/status?userId=${userId}`);
  return response.data;
};

// 일정 타입별 통계
export const getScheduleStatsByType = async (userId: number): Promise<ApiResponse<ScheduleTypeSummary[]>> => {
  const response = await apiClient.get<ApiResponse<ScheduleTypeSummary[]>>(`/schedules/stats/type?userId=${userId}`);
  return response.data;
};
