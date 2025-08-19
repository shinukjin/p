export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
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
