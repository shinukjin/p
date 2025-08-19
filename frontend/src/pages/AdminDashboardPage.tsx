import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getAdminDashboard } from '../api/admin';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiHome, 
  FiSettings, 
  FiBarChart, 
  FiShield,
  FiDatabase,
  FiActivity
} from 'react-icons/fi';

interface DashboardData {
  totalUsers: number;
  totalApartments: number;
  totalWeddingHalls: number;
  totalWeddingServices: number;
  todayVisitors: number;
  thisMonthVisitors: number;
  weeklyVisitors: Array<{ label: string; value: number }>;
  monthlyVisitors: Array<{ label: string; value: number }>;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboard();
        
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.message || '대시보드 데이터를 불러올 수 없습니다.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리
    // navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-semibold text-gray-900">관리자 대시보드</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">안녕하세요, {user?.name || user?.username}님</span>
              <button
                onClick={handleLogout}
                className="btn-danger"
              >
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
            <Link
              to="/admin/dashboard"
              className="nav-link active"
            >
              <FiHome className="mr-2 w-4 h-4" />
              대시보드
            </Link>
            <Link
              to="/admin/users"
              className="nav-link"
            >
              <FiUsers className="mr-2 w-4 h-4" />
              사용자 관리
            </Link>
            <Link
              to="/admin/system"
              className="nav-link"
            >
              <FiSettings className="mr-2 w-4 h-4" />
              시스템 설정
            </Link>
            <Link
              to="/admin/logs"
              className="nav-link"
            >
              <FiActivity className="mr-2 w-4 h-4" />
              시스템 로그
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiUsers className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 사용자</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiDatabase className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 아파트</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.totalApartments || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiShield className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">웨딩홀</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.totalWeddingHalls || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiBarChart className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">웨딩 서비스</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.totalWeddingServices || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 방문자 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">오늘 방문자</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.todayVisitors || 0}
              </p>
              <p className="text-sm text-gray-600">명</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">이번 달 방문자</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.thisMonthVisitors || 0}
              </p>
              <p className="text-sm text-gray-600">명</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
