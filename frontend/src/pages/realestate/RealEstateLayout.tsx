import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  FiHome, 
  FiMapPin, 
  FiGrid,
  FiLogOut 
} from 'react-icons/fi';

const RealEstateLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: '대시보드' },
    { path: '/realestates', icon: FiGrid, label: '부동산 정보' },
    { path: '/apartments', icon: FiMapPin, label: '아파트 매매' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-semibold text-gray-900">부동산 포털</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                안녕하세요, {user?.name || user?.username}님
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 네비게이션 메뉴 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="mr-2 w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RealEstateLayout;
