import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiHome,
  FiHeart,
  FiCalendar,
  FiTrendingUp,
  FiEye,
  FiBarChart,
  FiRefreshCw,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiShield
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import * as adminApi from '../../api/admin';
import type { DashboardData, SystemStatistics, UserInfo, ChartData } from '../../api/admin';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);


const AdminDashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStatistics | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [visitorChartData, setVisitorChartData] = useState<ChartData[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, statsRes, usersRes, visitorRes, monthlyRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getSystemStatistics(),
        adminApi.getAllUsers(),
        adminApi.getVisitorChartData(),
        adminApi.getMonthlyChartData()
      ]);

      if (dashboardRes.success) setDashboardData(dashboardRes.data);
      if (statsRes.success) setSystemStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (visitorRes.success) setVisitorChartData(visitorRes.data);
      if (monthlyRes.success) setMonthlyChartData(monthlyRes.data);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
      toast.error('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchKeyword.trim()) {
      await loadDashboardData();
      return;
    }

    try {
      const response = await adminApi.searchUsers(searchKeyword);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('사용자 검색 실패:', error);
      toast.error('사용자 검색에 실패했습니다.');
    }
  };

  const handleUpdateUserStatus = async (userId: number, status: string) => {
    try {
      const response = await adminApi.updateUserStatus(userId, status);
      if (response.success) {
        toast.success('사용자 상태가 업데이트되었습니다.');
        await loadDashboardData();
      }
    } catch (error) {
      console.error('사용자 상태 업데이트 실패:', error);
      toast.error('사용자 상태 업데이트에 실패했습니다.');
    }
  };

  const handleUpdateUserRole = async (userId: number, role: string) => {
    try {
      const response = await adminApi.updateUserRole(userId, role);
      if (response.success) {
        toast.success('사용자 역할이 업데이트되었습니다.');
        await loadDashboardData();
      }
    } catch (error) {
      console.error('사용자 역할 업데이트 실패:', error);
      toast.error('사용자 역할 업데이트에 실패했습니다.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    try {
      await adminApi.deleteUser(userId);
      toast.success('사용자가 삭제되었습니다.');
      await loadDashboardData();
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
      toast.error('사용자 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-gray-600">시스템 현황과 사용자 관리를 한눈에 확인하세요</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '개요', icon: FiBarChart },
              { id: 'users', label: '사용자 관리', icon: FiUsers },
              { id: 'analytics', label: '분석', icon: FiTrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: '전체 사용자',
                  value: systemStats?.totalUsers || 0,
                  icon: FiUsers,
                  color: 'bg-blue-500',
                  change: '+12%'
                },
                {
                  title: '활성 사용자',
                  value: systemStats?.activeUsers || 0,
                  icon: FiShield,
                  color: 'bg-green-500',
                  change: '+8%'
                },
                {
                  title: '웨딩홀',
                  value: dashboardData?.totalWeddingHalls || 0,
                  icon: FiHeart,
                  color: 'bg-pink-500',
                  change: '+15%'
                },
                {
                  title: '이번 달 방문자',
                  value: dashboardData?.thisMonthVisitors || 0,
                  icon: FiEye,
                  color: 'bg-purple-500',
                  change: '+22%'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">지난 달 대비</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 주간 방문자 차트 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">주간 방문자 현황</h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: visitorChartData.map(d => d.label),
                      datasets: [
                        {
                          label: '방문자 수',
                          data: visitorChartData.map(d => d.value),
                          backgroundColor: 'rgba(59, 130, 246, 0.8)',
                          borderColor: 'rgba(59, 130, 246, 1)',
                          borderWidth: 2,
                          borderRadius: 8,
                          borderSkipped: false,
                          hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                          hoverBorderColor: 'rgba(59, 130, 246, 1)',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: 'rgba(59, 130, 246, 0.5)',
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: false,
                          callbacks: {
                            title: function(context) {
                              return context[0].label;
                            },
                            label: function(context) {
                              const value = context.parsed.y;
                              const index = context.dataIndex;
                              let changeText = '';
                              
                              if (index > 0 && visitorChartData[index - 1]) {
                                const prevValue = visitorChartData[index - 1].value;
                                if (value > prevValue) {
                                  const change = ((value - prevValue) / prevValue * 100).toFixed(1);
                                  changeText = ` (↗ +${change}%)`;
                                } else if (value < prevValue) {
                                  const change = ((prevValue - value) / prevValue * 100).toFixed(1);
                                  changeText = ` (↘ -${change}%)`;
                                }
                              }
                              
                              return `방문자: ${value.toLocaleString()}명${changeText}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        }
                      },
                      interaction: {
                        intersect: false,
                        mode: 'index'
                      }
                    }}
                  />
                </div>
              </div>

              {/* 월별 방문자 차트 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 방문자 현황</h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: monthlyChartData.slice(0, 6).map(d => d.label),
                      datasets: [
                        {
                          label: '월별 방문자',
                          data: monthlyChartData.slice(0, 6).map(d => d.value),
                          backgroundColor: 'rgba(16, 185, 129, 0.8)',
                          borderColor: 'rgba(16, 185, 129, 1)',
                          borderWidth: 2,
                          borderRadius: 8,
                          borderSkipped: false,
                          hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
                          hoverBorderColor: 'rgba(16, 185, 129, 1)',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: 'rgba(16, 185, 129, 0.5)',
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: false,
                          callbacks: {
                            title: function(context) {
                              return context[0].label;
                            },
                            label: function(context) {
                              const value = context.parsed.y;
                              const index = context.dataIndex;
                              let changeText = '';
                              
                              if (index > 0 && monthlyChartData[index - 1]) {
                                const prevValue = monthlyChartData[index - 1].value;
                                if (value > prevValue) {
                                  const change = ((value - prevValue) / prevValue * 100).toFixed(1);
                                  changeText = ` (↗ +${change}%)`;
                                } else if (value < prevValue) {
                                  const change = ((prevValue - value) / prevValue * 100).toFixed(1);
                                  changeText = ` (↘ -${change}%)`;
                                }
                              }
                              
                              return `방문자: ${(value / 1000).toFixed(1)}k명${changeText}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            },
                            callback: function(value) {
                              return (Number(value) / 1000).toFixed(1) + 'k';
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        }
                      },
                      interaction: {
                        intersect: false,
                        mode: 'index'
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* 추가 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* 사용자 역할 분포 도넛 차트 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 역할 분포</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <Doughnut
                      data={{
                        labels: ['일반 사용자', '관리자'],
                        datasets: [
                          {
                            data: systemStats ? [systemStats.regularUsers, systemStats.adminUsers] : [0, 0],
                            backgroundColor: [
                              'rgba(59, 130, 246, 0.8)',
                              'rgba(139, 92, 246, 0.8)'
                            ],
                            borderColor: [
                              'rgba(59, 130, 246, 1)',
                              'rgba(139, 92, 246, 1)'
                            ],
                            borderWidth: 3,
                            hoverBackgroundColor: [
                              'rgba(59, 130, 246, 1)',
                              'rgba(139, 92, 246, 1)'
                            ],
                            hoverBorderColor: [
                              'rgba(59, 130, 246, 1)',
                              'rgba(139, 92, 246, 1)'
                            ]
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: 'rgba(59, 130, 246, 0.5)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                              label: function(context) {
                                const value = context.parsed;
                                const total = systemStats?.totalUsers || 1;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value.toLocaleString()}명 (${percentage}%)`;
                              }
                            }
                          }
                        }
                      }}
                    />
                    
                    {/* 중앙 텍스트 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-2xl font-bold text-gray-900">
                        {systemStats?.totalUsers || 0}
                      </div>
                      <div className="text-sm text-gray-600">전체 사용자</div>
                    </div>
                  </div>
                </div>
                
                {/* 범례 */}
                <div className="mt-6 space-y-3">
                  {systemStats && [
                    { role: '일반 사용자', value: systemStats.regularUsers, color: '#3b82f6' },
                    { role: '관리자', value: systemStats.adminUsers, color: '#8b5cf6' }
                  ].map((item) => (
                    <div key={item.role} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-gray-700">{item.role}</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {item.value.toLocaleString()}명
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 사용자 상태별 라인 차트 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 상태별 현황</h3>
                <div className="h-48">
                  <Line
                    data={{
                      labels: ['사용자 상태'],
                      datasets: [
                        {
                          label: '활성',
                          data: [systemStats?.activeUsers || 0],
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          borderColor: 'rgba(16, 185, 129, 1)',
                          borderWidth: 3,
                          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                          pointBorderColor: 'white',
                          pointBorderWidth: 2,
                          pointRadius: 8,
                          pointHoverRadius: 10,
                          fill: true
                        },
                        {
                          label: '비활성',
                          data: [systemStats?.inactiveUsers || 0],
                          backgroundColor: 'rgba(245, 158, 11, 0.2)',
                          borderColor: 'rgba(245, 158, 11, 1)',
                          borderWidth: 3,
                          pointBackgroundColor: 'rgba(245, 158, 11, 1)',
                          pointBorderColor: 'white',
                          pointBorderWidth: 2,
                          pointRadius: 8,
                          pointHoverRadius: 10,
                          fill: true
                        },
                        {
                          label: '정지',
                          data: [systemStats ? (systemStats.totalUsers - systemStats.activeUsers - systemStats.inactiveUsers) : 0],
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          borderColor: 'rgba(239, 68, 68, 1)',
                          borderWidth: 3,
                          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                          pointBorderColor: 'white',
                          pointBorderWidth: 2,
                          pointRadius: 8,
                          pointHoverRadius: 10,
                          fill: true
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: 'rgba(59, 130, 246, 0.5)',
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: true,
                          callbacks: {
                            label: function(context) {
                              const value = context.parsed.y;
                              const total = systemStats?.totalUsers || 1;
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${context.dataset.label}: ${value.toLocaleString()}명 (${percentage}%)`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#6b7280',
                            font: {
                              size: 12
                            }
                          }
                        }
                      },
                      interaction: {
                        intersect: false,
                        mode: 'index'
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 사용자 관리 탭 */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 검색 및 새로고침 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="사용자 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearchUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  검색
                </button>
              </div>
              <button
                onClick={loadDashboardData}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>새로고침</span>
              </button>
            </div>

            {/* 사용자 테이블 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        역할
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        가입일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name || user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="USER">일반 사용자</option>
                            <option value="ADMIN">관리자</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.status}
                            onChange={(e) => handleUpdateUserStatus(user.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="ACTIVE">활성</option>
                            <option value="INACTIVE">비활성</option>
                            <option value="SUSPENDED">정지</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* 분석 탭 */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 시스템 통계 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 통계</h3>
                <div className="space-y-4">
                  {systemStats && [
                    { label: '전체 사용자', value: systemStats.totalUsers, color: 'bg-blue-100 text-blue-800' },
                    { label: '활성 사용자', value: systemStats.activeUsers, color: 'bg-green-100 text-green-800' },
                    { label: '비활성 사용자', value: systemStats.inactiveUsers, color: 'bg-yellow-100 text-yellow-800' },
                    { label: '관리자', value: systemStats.adminUsers, color: 'bg-purple-100 text-purple-800' },
                    { label: '일반 사용자', value: systemStats.regularUsers, color: 'bg-gray-100 text-gray-800' }
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${stat.color}`}>
                        {stat.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 추가 분석 정보 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">추가 분석</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">오늘 방문자</span>
                    <span className="text-lg font-bold text-blue-600">{dashboardData?.todayVisitors || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">이번 주 방문자</span>
                    <span className="text-lg font-bold text-green-600">
                      {dashboardData?.weeklyVisitors?.reduce((sum, val) => sum + val, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">이번 달 방문자</span>
                    <span className="text-lg font-bold text-purple-600">{dashboardData?.thisMonthVisitors || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
  );
};

export default AdminDashboardPage;
