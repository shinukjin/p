import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { 
  FiHome, 
  FiCalendar, 
  FiDollarSign, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiUser,
  FiHeart,
  FiCamera,
  FiMapPin,
  FiTrendingUp,
  FiBarChart
} from 'react-icons/fi';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { name: string; path?: string }[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, breadcrumbs = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 네비게이션 아이템들
  const navigationItems = [
    { name: '대시보드', path: '/dashboard', icon: FiHome },
    { name: '결혼식장', path: '/wedding-halls', icon: FiHeart },
    { name: '스드메', path: '/wedding-services', icon: FiCamera },
    { name: '부동산', path: '/real-estates', icon: FiMapPin },
    { name: '실거래가', path: '/apartment-trades', icon: FiTrendingUp },
    { name: '예산 & 일정', path: '/budget-schedule', icon: FiCalendar },
    { name: '나의 페이지', path: '/my-page', icon: FiUser },
  ];

  // 관리자 전용 네비게이션 아이템들
  const adminNavigationItems = [
    { name: '사용자 관리', path: '/admin/users', icon: FiUsers },
    { name: '시스템 설정', path: '/admin/settings', icon: FiSettings },
  ];

  // 현재 경로가 활성화된지 확인
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 및 제목 */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
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
              <Link
                to="/my-page"
                className="flex items-center space-x-3 bg-gray-100 rounded px-3 py-2 h-10 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-3 h-3 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name || user?.username}님
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.roleDescription || user?.role}
                  </div>
                </div>
              </Link>

              {/* 로그아웃 버튼 */}
              <button
                onClick={logout}
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

            {/* 관리자 전용 메뉴 */}
            {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'OPERATOR' ? (
              <>
                <div className="border-l border-gray-300 mx-2"></div>
                {adminNavigationItems.map((item) => {
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
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* 브레드크럼 */}
      {breadcrumbs.length > 0 && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/dashboard" className="hover:text-gray-700">
                  홈
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
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
