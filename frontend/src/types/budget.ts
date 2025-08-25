// 예산 관리 타입 정의

export enum BudgetStatus {
  PLANNED = 'PLANNED',      // 계획됨
  IN_PROGRESS = 'IN_PROGRESS',  // 진행 중
  COMPLETED = 'COMPLETED',    // 완료
  OVERBUDGET = 'OVERBUDGET',   // 예산 초과
  CANCELLED = 'CANCELLED'     // 취소
}

export enum Priority {
  HIGH = 'HIGH',    // 높음
  MEDIUM = 'MEDIUM',  // 보통
  LOW = 'LOW'      // 낮음
}

export const BudgetStatusLabels = {
  [BudgetStatus.PLANNED]: '계획됨',
  [BudgetStatus.IN_PROGRESS]: '진행 중',
  [BudgetStatus.COMPLETED]: '완료',
  [BudgetStatus.OVERBUDGET]: '예산 초과',
  [BudgetStatus.CANCELLED]: '취소'
};

export const PriorityLabels = {
  [Priority.HIGH]: '높음',
  [Priority.MEDIUM]: '보통',
  [Priority.LOW]: '낮음'
};

export interface Budget {
  id: number;
  category: string;
  itemName: string;
  plannedAmount: number;
  actualAmount?: number;
  status: BudgetStatus;
  priority: Priority;
  description?: string;
  vendor?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  isOverBudget: boolean;
  remainingBudget: number;
}

export interface BudgetFormData {
  category: string;
  itemName: string;
  plannedAmount: string;
  actualAmount: string;
  status: BudgetStatus;
  priority: Priority;
  description: string;
  vendor: string;
  dueDate: string;
}

export interface BudgetSummary {
  category: string;
  itemCount: number;
  totalPlannedAmount: number;
  totalActualAmount: number;
  remainingAmount: number;
  completionRate: number;
}

// 예산 카테고리 기본값
export const DEFAULT_BUDGET_CATEGORIES = [
  '웨딩홀',
  '스튜디오',
  '드레스',
  '메이크업',
  '부케/플라워',
  '초대장',
  '답례품',
  '혼수',
  '신혼여행',
  '기타'
];