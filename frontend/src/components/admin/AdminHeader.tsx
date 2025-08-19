import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiActivity 
} from 'react-icons/fi';

interface AdminHeaderProps {
  title: string;
  currentPath: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, currentPath }) => {
  const { user } = useAuthStore();

  const navItems = [
    { path: '/admin/dashboard', icon: FiHome, label: '대시보드' },
    { path: '/admin/users', icon: FiUsers, label: '사용자 관리' },
    { path: '/admin/system', icon: FiSettings, label: '시스템 설정' },
    { path: '/admin/logs', icon: FiActivity, label: '시스템 로그' },
  ];

  return (
    <>
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                안녕하세요, {user?.name || user?.username}님
              </span>
              <Link
                to="/admin/dashboard"
                className="btn-secondary"
              >
                대시보드로
              </Link>
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
              const isActive = currentPath === item.path;
              
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
    </>
  );
};

export default AdminHeader;
