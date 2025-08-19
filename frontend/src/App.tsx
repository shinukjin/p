import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WeddingHallsPage from './pages/WeddingHallsPage';
import WeddingServicesPage from './pages/WeddingServicesPage';
import RealEstatesPage from './pages/RealEstatesPage';
import ApartmentTradesPage from './pages/ApartmentTradesPage';
import { adminRoutes } from './routes/adminRoutes';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 보호된 라우트 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// 공개 라우트 컴포넌트 (로그인된 사용자는 대시보드로 리다이렉트)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* 공개 라우트 */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            {/* 보호된 라우트 */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wedding-halls"
              element={
                <ProtectedRoute>
                  <WeddingHallsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wedding-services"
              element={
                <ProtectedRoute>
                  <WeddingServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/real-estates"
              element={
                <ProtectedRoute>
                  <RealEstatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apartment-trades"
              element={
                <ProtectedRoute>
                  <ApartmentTradesPage />
                </ProtectedRoute>
              }
            />

            {/* 관리자 라우트 */}
            {adminRoutes}

            {/* 기본 라우트 */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* 토스트 알림 */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
