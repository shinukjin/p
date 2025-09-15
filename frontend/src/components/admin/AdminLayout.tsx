import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  FiUsers, 
  FiSettings, 
  FiBarChart2, 
  FiFileText,
  FiLogOut,
  FiUser,
  FiHome,
  FiHeart,
  FiCode
} from 'react-icons/fi';

interface AdminLayoutProps {
  title?: string;
  breadcrumbs?: { name: string; path?: string }[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  title = "관리자 페이지",
  breadcrumbs = []
}) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navigationItems = [
    { name: '대시보드', path: '/admin/dashboard', icon: FiHome },
    { name: '사용자 관리', path: '/admin/users', icon: FiUsers },
    { name: '웨딩홀 관리', path: '/admin/wedding-halls', icon: FiHeart },
    { name: '공통코드 관리', path: '/admin/common-codes', icon: FiCode },
    { name: '시스템 설정', path: '/admin/system', icon: FiSettings },
    { name: '시스템 로그', path: '/admin/logs', icon: FiFileText },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 및 제목 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 ml-3">
                {title}
              </h1>
            </div>

            {/* 우측 헤더 */}
            <div className="flex items-center space-x-4">
              {/* 현재 시간 */}
              <div className="hidden sm:block text-sm text-gray-500">
                {currentTime.toLocaleTimeString()}
              </div>

              {/* 사용자 정보 */}
              <div className="flex items-center space-x-3 bg-gray-100 rounded px-3 py-2 h-10">
                <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-3 h-3 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.username}님
                  </div>
                  <div className="text-xs text-gray-500">관리자</div>
                </div>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:block text-sm">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 네비게이션 메뉴 */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-2 rounded transition-colors
                    ${isActive(item.path)
                      ? 'text-gray-900 font-semibold text-base bg-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 text-base font-medium'
                    }
                  `}
                >
                  <Icon className="mr-2 w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 브레드크럼 */}
      {breadcrumbs.length > 0 && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/admin/dashboard" className="hover:text-gray-700">
                  관리자 홈
                </Link>
              </li>
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center">
                  <span className="mx-2">/</span>
                  {breadcrumb.path ? (
                    <Link to={breadcrumb.path} className="hover:text-gray-700">
                      {breadcrumb.name}
                    </Link>
                  ) : (
                    <span className="text-gray-900">{breadcrumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
