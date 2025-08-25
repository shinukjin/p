import { apiClient } from './client';
import type { Budget, BudgetFormData, BudgetSummary } from '../types/budget';
import type { ApiResponse } from '../types/api';

// 예산 목록 조회
export const getBudgets = async (userId: number, category?: string): Promise<ApiResponse<Budget[]>> => {
  const params = new URLSearchParams({ userId: userId.toString() });
  if (category) {
    params.append('category', category);
  }
  
  const response = await apiClient.get<ApiResponse<Budget[]>>(`/budgets?${params}`);
  return response.data;
};

// 예산 상세 조회
export const getBudget = async (budgetId: number, userId: number): Promise<ApiResponse<Budget>> => {
  const response = await apiClient.get<ApiResponse<Budget>>(`/budgets/${budgetId}?userId=${userId}`);
  return response.data;
};

// 예산 생성
export const createBudget = async (userId: number, budgetData: BudgetFormData): Promise<ApiResponse<Budget>> => {
  const response = await apiClient.post<ApiResponse<Budget>>(`/budgets?userId=${userId}`, budgetData);
  return response.data;
};

// 예산 수정
export const updateBudget = async (budgetId: number, userId: number, budgetData: Partial<BudgetFormData>): Promise<ApiResponse<Budget>> => {
  const response = await apiClient.put<ApiResponse<Budget>>(`/budgets/${budgetId}?userId=${userId}`, budgetData);
  return response.data;
};

// 예산 삭제
export const deleteBudget = async (budgetId: number, userId: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/budgets/${budgetId}?userId=${userId}`);
  return response.data;
};

// 임박한 예산 조회 (7일 이내)
export const getUpcomingBudgets = async (userId: number): Promise<ApiResponse<Budget[]>> => {
  const response = await apiClient.get<ApiResponse<Budget[]>>(`/budgets/upcoming?userId=${userId}`);
  return response.data;
};

// 예산 초과 항목 조회
export const getOverBudgetItems = async (userId: number): Promise<ApiResponse<Budget[]>> => {
  const response = await apiClient.get<ApiResponse<Budget[]>>(`/budgets/overbudget?userId=${userId}`);
  return response.data;
};

// 카테고리별 예산 요약
export const getBudgetSummaryByCategory = async (userId: number): Promise<ApiResponse<BudgetSummary[]>> => {
  const response = await apiClient.get<ApiResponse<BudgetSummary[]>>(`/budgets/summary/category?userId=${userId}`);
  return response.data;
};

// 전체 예산 요약
export const getTotalBudgetSummary = async (userId: number): Promise<ApiResponse<BudgetSummary>> => {
  const response = await apiClient.get<ApiResponse<BudgetSummary>>(`/budgets/summary/total?userId=${userId}`);
  return response.data;
};
