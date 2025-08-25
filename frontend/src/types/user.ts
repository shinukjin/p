export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  totalBudget?: number; // 총 사용가능 예산
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserListResponse {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

export interface EditForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}
