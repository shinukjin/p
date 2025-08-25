import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTokenExpiration } from '../../hooks/useTokenExpiration';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiActivity,
  FiHeart,
  FiLogOut,
  FiUser
} from 'react-icons/fi';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
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
  
  // 현재 경로에 따른 제목 설정
  const getTitle = (pathname: string) => {
    if (pathname.startsWith('/admin/wedding-halls')) {
      if (pathname.includes('/new')) return '새 결혼식장 추가';
      if (pathname.includes('/edit')) return '결혼식장 수정';
      if (pathname.match(/\/\d+$/)) return '결혼식장 상세';
      return '결혼식장 관리';
    }
    
    switch (pathname) {
      case '/admin/dashboard':
        return '관리자 대시보드';
      case '/admin/users':
        return '사용자 관리';
      case '/admin/system':
        return '시스템 설정';
      case '/admin/logs':
        return '시스템 로그';
      default:
        return '관리자';
    }
  };

  const navItems = [
    { path: '/admin/dashboard', icon: FiHome, label: '대시보드' },
    { path: '/admin/users', icon: FiUsers, label: '사용자 관리' },
    { path: '/admin/wedding-halls', icon: FiHeart, label: '결혼식장 관리' },
    { path: '/admin/system', icon: FiSettings, label: '시스템 설정' },
    { path: '/admin/logs', icon: FiActivity, label: '시스템 로그' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              {/* 로고 및 브랜드 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <FiSettings className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center h-8">
                  <span className="text-lg font-medium text-gray-900">
                    관리자 시스템
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
                    {user?.name || user?.username}님
                  </div>
                  <div className="text-xs text-gray-500">관리자</div>
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
                             (item.path === '/admin/wedding-halls' && location.pathname.startsWith('/admin/wedding-halls'));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                                     className={`flex items-center px-4 py-2 rounded transition-colors ${
                     isActive 
                       ? 'text-gray-900 font-semibold text-base' 
                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 text-sm font-medium'
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
              <span className="text-gray-600">관리자</span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-900 font-medium">{getTitle(location.pathname)}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <FiSettings className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium">관리자 시스템</span>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm">© 2025 관리자 시스템. All rights reserved.</div>
              <div className="text-xs text-gray-400 mt-1">보안 및 모니터링 시스템</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
