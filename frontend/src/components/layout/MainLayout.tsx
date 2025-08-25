import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useTokenExpiration } from '../../hooks/useTokenExpiration';
import { 
  FiHome, 
  FiHeart, 
  FiCamera, 
  FiMapPin, 
  FiTrendingUp,
  FiLogOut,
  FiUser
} from 'react-icons/fi';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ name: string; path?: string }>;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, breadcrumbs = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 토큰 만료 감지
  useTokenExpiration();
  
  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: '대시보드' },
    { path: '/wedding-halls', icon: FiHeart, label: '결혼식장' },
    { path: '/wedding-services', icon: FiCamera, label: '스드메' },
    { path: '/real-estates', icon: FiMapPin, label: '부동산' },
    { path: '/apartment-trades', icon: FiMapPin, label: '실거래가' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 기본 브레드크럼 설정
  const defaultBreadcrumbs = [
    { name: '홈', path: '/dashboard' },
    ...breadcrumbs
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              {/* 로고 및 브랜드 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                  <FiHeart className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center h-8">
                  <span className="text-lg font-medium text-gray-900">
                    부동산 정보 포트폴리오
                  </span>
                </div>
              </div>
            </div>
            
            {/* 우측 사용자 정보 및 액션 */}
            <div className="flex items-center space-x-4">
              {/* 현재 시간 */}
              <div className="hidden md:block text-right">
                <div className="text-xs text-gray-500">현재 시간</div>
                <div className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
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
                  <div className="text-xs text-gray-500">사용자</div>
                </div>
              </div>
              
              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 px-3 py-2 rounded flex items-center space-x-2 transition-colors h-10"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm font-medium">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 네비게이션 메뉴 */}
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex space-x-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                             (item.path === '/wedding-halls' && location.pathname.startsWith('/wedding-halls')) ||
                             (item.path === '/wedding-services' && location.pathname.startsWith('/wedding-services')) ||
                             (item.path === '/real-estates' && location.pathname.startsWith('/real-estates')) ||
                             (item.path === '/apartment-trades' && location.pathname.startsWith('/apartment-trades'));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded transition-colors ${
                    isActive 
                      ? 'text-gray-900 font-semibold text-base' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 text-base font-medium'
                  }`}
                >
                  <Icon className={`mr-2 w-4 h-4 ${isActive ? 'text-gray-700' : 'text-gray-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 브레드크럼 */}
      <div className="bg-gray-200 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-1">
            <nav className="flex items-center space-x-2 text-xs">
              {defaultBreadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="text-gray-500 mx-2">/</span>
                  )}
                  {crumb.path ? (
                    <Link
                      to={crumb.path}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">
                      {crumb.name}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 페이지 제목 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            
            {children}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm">© 2025 부동산 정보 포트폴리오. All rights reserved.</div>
              <div className="text-xs text-gray-400 mt-1">부동산 정보 관리 시스템</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
