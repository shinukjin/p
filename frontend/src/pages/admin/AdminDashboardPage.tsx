import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiHome, 
  FiSettings, 
  FiBarChart, 
  FiShield,
  FiDatabase,
  FiActivity,
  FiHeart
} from 'react-icons/fi';
import { getDashboardStats } from '../../api/admin';

interface DashboardStats {
  totalUsers: number;
  totalApartments: number;
  totalWeddingHalls: number;
  totalWeddingServices: number;
  todayVisitors: number;
  thisMonthVisitors: number;
  weeklyVisitors: number[];
  monthlyVisitors: number[];
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || '대시보드 데이터를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">총 사용자</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats?.totalUsers || 0}명</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/admin/users" className="font-medium text-blue-700 hover:text-blue-900">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiHome className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">아파트 매매</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats?.totalApartments || 0}건</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/apartment-trades" className="font-medium text-blue-700 hover:text-blue-900">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiHeart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">결혼식장</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats?.totalWeddingHalls || 0}개</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/admin/wedding-halls" className="font-medium text-blue-700 hover:text-blue-900">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiDatabase className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">웨딩 서비스</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats?.totalWeddingServices || 0}개</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/wedding-services" className="font-medium text-blue-700 hover:text-blue-900">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 방문자 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">오늘 방문자</h3>
              <div className="text-3xl font-bold text-gray-900">{stats?.todayVisitors || 0}명</div>
              <p className="text-sm text-gray-500 mt-2">전일 대비 +12% 증가</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">이번 달 방문자</h3>
              <div className="text-3xl font-bold text-gray-900">{stats?.thisMonthVisitors || 0}명</div>
              <p className="text-sm text-gray-500 mt-2">지난 달 대비 +8% 증가</p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboardPage;
