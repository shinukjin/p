import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUserManagementPage from '../pages/admin/AdminUserManagementPage';
import AdminWeddingHallsPage from '../pages/admin/AdminWeddingHallsPage';
import AdminWeddingHallFormPage from '../pages/admin/AdminWeddingHallFormPage';
import AdminWeddingHallDetailPage from '../pages/admin/AdminWeddingHallDetailPage';
import { useAuthStore } from '../store/authStore';

// 관리자 보호된 라우트 컴포넌트
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // 관리자 권한 체크 (ADMIN, SUPER_ADMIN, OPERATOR)
  if (!user || !user.role || !['ADMIN', 'SUPER_ADMIN', 'OPERATOR'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// 관리자 공개 라우트 (이미 로그인된 관리자는 대시보드로)
const AdminPublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated && user && user.role && ['ADMIN', 'SUPER_ADMIN', 'OPERATOR'].includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export const adminRoutes = (
  <>
    <Route path="/admin/login" element={<AdminPublicRoute><AdminLoginPage /></AdminPublicRoute>} />
    <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="users" element={<AdminUserManagementPage />} />
      <Route path="wedding-halls">
        <Route index element={<AdminWeddingHallsPage />} />
        <Route path="new" element={<AdminWeddingHallFormPage />} />
        <Route path=":id" element={<AdminWeddingHallDetailPage />} />
        <Route path=":id/edit" element={<AdminWeddingHallFormPage />} />
      </Route>
      {/* 추가 관리자 페이지들 */}
      <Route path="system" element={<div>시스템 설정 페이지</div>} />
      <Route path="logs" element={<div>시스템 로그 페이지</div>} />
    </Route>
  </>
);
