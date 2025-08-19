import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { adminRoutes } from './adminRoutes';
import { realestateRoutes } from './realestateRoutes';
import { weddingRoutes } from './weddingRoutes';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 인증 라우트 (공개) */}
      {authRoutes}
      
      {/* 관리자 라우트 */}
      {adminRoutes}
      
      {/* 부동산 라우트 (인증 필요) */}
      <Route path="/" element={<ProtectedRoute />}>
        {realestateRoutes}
      </Route>
      
      {/* 웨딩 라우트 (인증 필요) */}
      <Route path="/wedding" element={<ProtectedRoute />}>
        {weddingRoutes}
      </Route>
      
      {/* 기본 리다이렉트 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
