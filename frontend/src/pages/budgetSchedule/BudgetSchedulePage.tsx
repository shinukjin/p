import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import { useAuthStore } from '../../store/authStore';
import type { Appliance, ApplianceSummary } from '../../types/appliance';
import ApplianceRegistrationModal from '../../components/appliance/ApplianceRegistrationModal';

const BudgetSchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<'budget' | 'schedule' | 'appliance'>('budget');
  const [budgets, setBudgets] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isApplianceModalOpen, setIsApplianceModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);

  // 사용자 총 예산 (사용자 정보에서 가져옴)
  const userTotalBudget = user?.totalBudget || 0;

  // 예산 데이터 (임시)
  useEffect(() => {
    // 임시 예산 데이터
    setBudgets([
      {
        id: 1,
        category: '웨딩홀',
        item: '그랜드볼룸',
        plannedAmount: 5000000,
        actualAmount: 4800000,
        dueDate: '2025-06-15',
        status: 'COMPLETED',
        memo: '계약 완료'
      },
      {
        id: 2,
        category: '스드메',
        item: '메이크업',
        plannedAmount: 800000,
        actualAmount: 0,
        dueDate: '2025-05-20',
        status: 'PLANNING',
        memo: '견적 확인 중'
      }
    ]);

    // 임시 일정 데이터
    setSchedules([
      {
        id: 1,
        title: '웨딩홀 계약',
        date: '2025-01-15',
        status: 'COMPLETED',
        priority: 'HIGH',
        description: '그랜드볼룸 계약 체결'
      },
      {
        id: 2,
        title: '스드메 견적 확인',
        date: '2025-02-20',
        status: 'PLANNING',
        priority: 'MEDIUM',
        description: '메이크업, 헤어, 드레스 견적'
      }
    ]);

    // 임시 가전가구 데이터
    setAppliances([
      {
        id: 1,
        name: '삼성 냉장고',
        category: 'KITCHEN' as any,
        brand: '삼성',
        model: 'RF85C9001AP',
        plannedPrice: 2500000,
        actualPrice: 2300000,
        status: 'PURCHASED' as any,
        priority: 'HIGH' as any,
        description: '스마트 냉장고',
        store: '삼성전자 공식몰',
        purchaseDate: '2025-01-10',
        deliveryDate: '2025-01-15',
        installationDate: '2025-01-15',
        warranty: '2년',
        memo: '할인 적용',
        imageUrl: '',
        isBookmarked: false,
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-15T00:00:00'
      }
    ]);
  }, []);

  // 예산 추가
  const handleAddBudget = () => {
    const newBudget = {
      id: Date.now(),
      category: '',
      item: '',
      plannedAmount: 0,
      actualAmount: 0,
      dueDate: '',
      status: 'PLANNING',
      memo: ''
    };
    setBudgets([...budgets, newBudget]);
  };

  // 일정 추가
  const handleAddSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      title: '',
      date: '',
      status: 'PLANNING',
      priority: 'MEDIUM',
      description: ''
    };
    setSchedules([...schedules, newSchedule]);
  };

  // 가전가구 추가
  const handleAddAppliance = () => {
    setEditingAppliance(null);
    setIsApplianceModalOpen(true);
  };

  // 가전가구 수정
  const handleEditAppliance = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setIsApplianceModalOpen(true);
  };

  // 가전가구 제출
  const handleApplianceSubmit = (data: any) => {
    if (editingAppliance) {
      // 수정
      setAppliances(appliances.map(item => 
        item.id === editingAppliance.id ? { ...item, ...data } : item
      ));
    } else {
      // 추가
      const newAppliance: Appliance = {
        id: Date.now(),
        ...data
      };
      setAppliances([...appliances, newAppliance]);
    }
    setIsApplianceModalOpen(false);
    setEditingAppliance(null);
  };

  // 예산 상태별 정렬 (완료된 것은 아래로)
  const sortedBudgets = [...budgets].sort((a, b) => {
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
    return 0;
  });

  // 일정 상태별 정렬 (완료된 것은 아래로)
  const sortedSchedules = [...schedules].sort((a, b) => {
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
    return 0;
  });

  // 가전가구 상태별 정렬 (완료된 것은 아래로)
  const sortedAppliances = [...appliances].sort((a, b) => {
    if (a.status === 'PURCHASED' && b.status !== 'PURCHASED') return 1;
    if (a.status !== 'PURCHASED' && b.status === 'PURCHASED') return -1;
    return 0;
  });

  // 예산 통계
  const totalPlannedBudget = budgets.reduce((sum, budget) => sum + budget.plannedAmount, 0);
  const totalActualBudget = budgets.reduce((sum, budget) => sum + budget.actualAmount, 0);
  const remainingBudget = userTotalBudget - totalActualBudget;

  // 가전가구 통계
  const totalPlannedApplianceCost = appliances.reduce((sum, appliance) => sum + (appliance.plannedPrice || 0), 0);
  const totalActualApplianceCost = appliances.reduce((sum, appliance) => sum + (appliance.actualPrice || 0), 0);

  if (!user) {
    return (
      <MainLayout 
        title="예산 & 일정 관리"
        breadcrumbs={[{ name: '예산/일정' }]}
      >
        <div className="text-center py-12">
          <p className="text-red-500">사용자 정보를 찾을 수 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="예산 & 일정 관리"
      breadcrumbs={[{ name: '예산/일정' }]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* 전체 예산 현황 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div whileHover={{ y: -2 }} className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl text-blue-600">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 예산</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userTotalBudget.toLocaleString()}원
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl text-green-600">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">계획 예산</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalPlannedBudget.toLocaleString()}원
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl text-yellow-600">💸</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">실제 지출</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalActualBudget.toLocaleString()}원
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl text-purple-600">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">잔여 예산</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {remainingBudget.toLocaleString()}원
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'budget', name: '예산 관리', count: budgets.length },
              { id: 'schedule', name: '일정 관리', count: schedules.length },
              { id: 'appliance', name: '가전가구', count: appliances.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* 예산 관리 탭 */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">예산 관리</h2>
              <button
                onClick={handleAddBudget}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                예산 추가
              </button>
            </div>

            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      항목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      계획 금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      실제 금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      마감일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      메모
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBudgets.map((budget) => (
                    <tr key={budget.id} className={budget.status === 'COMPLETED' ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {budget.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {budget.item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {budget.plannedAmount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {budget.actualAmount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {budget.dueDate ? new Date(budget.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          budget.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800' 
                            : budget.status === 'PLANNING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {budget.status === 'COMPLETED' ? '완료' : 
                           budget.status === 'PLANNING' ? '계획' : '진행중'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {budget.memo}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">
                      총계
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {totalPlannedBudget.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {totalActualBudget.toLocaleString()}원
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* 일정 관리 탭 */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">일정 관리</h2>
              <button
                onClick={handleAddSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                일정 추가
              </button>
            </div>

            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      날짜
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      우선순위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSchedules.map((schedule) => (
                    <tr key={schedule.id} className={schedule.status === 'COMPLETED' ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {schedule.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {schedule.date ? new Date(schedule.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          schedule.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800' 
                            : schedule.status === 'PLANNING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {schedule.status === 'COMPLETED' ? '완료' : 
                           schedule.status === 'PLANNING' ? '계획' : '진행중'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          schedule.priority === 'HIGH' 
                            ? 'bg-red-100 text-red-800' 
                            : schedule.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {schedule.priority === 'HIGH' ? '높음' : 
                           schedule.priority === 'MEDIUM' ? '보통' : '낮음'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {schedule.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 가전가구 관리 탭 */}
        {activeTab === 'appliance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">가전가구 관리</h2>
              <button
                onClick={handleAddAppliance}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                가전가구 추가
              </button>
            </div>

            {/* 가전가구 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl text-blue-600">📱</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">계획 비용</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalPlannedApplianceCost.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl text-green-600">💳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">실제 비용</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalActualApplianceCost.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl text-purple-600">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">총 개수</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {appliances.length}개
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제품명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      브랜드
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      계획 가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      실제 가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      우선순위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAppliances.map((appliance) => (
                    <tr key={appliance.id} className={appliance.status === 'PURCHASED' ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appliance.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appliance.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appliance.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appliance.plannedPrice?.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appliance.actualPrice?.toLocaleString() || '-'}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          appliance.status === 'PURCHASED' 
                            ? 'bg-green-100 text-green-800' 
                            : appliance.status === 'PLANNING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appliance.status === 'PURCHASED' ? '구매완료' : 
                           appliance.status === 'PLANNING' ? '계획' : '견적확인'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          appliance.priority === 'HIGH' 
                            ? 'bg-red-100 text-red-800' 
                            : appliance.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {appliance.priority === 'HIGH' ? '높음' : 
                           appliance.priority === 'MEDIUM' ? '보통' : '낮음'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditAppliance(appliance)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                      총계
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {totalPlannedApplianceCost.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {totalActualApplianceCost.toLocaleString()}원
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* 가전가구 등록/수정 모달 */}
        <ApplianceRegistrationModal
          isOpen={isApplianceModalOpen}
          onClose={() => {
            setIsApplianceModalOpen(false);
            setEditingAppliance(null);
          }}
          onSubmit={handleApplianceSubmit}
          initialData={editingAppliance ? {
            name: editingAppliance.name,
            category: editingAppliance.category,
            brand: editingAppliance.brand || '',
            model: editingAppliance.model || '',
            plannedPrice: editingAppliance.plannedPrice?.toString() || '',
            actualPrice: editingAppliance.actualPrice?.toString() || '',
            status: editingAppliance.status,
            priority: editingAppliance.priority,
            description: editingAppliance.description || '',
            store: editingAppliance.store || '',
            purchaseDate: editingAppliance.purchaseDate || '',
            deliveryDate: editingAppliance.deliveryDate || '',
            installationDate: editingAppliance.installationDate || '',
            warranty: editingAppliance.warranty || '',
            memo: editingAppliance.memo || ''
          } : undefined}
        />
      </motion.div>
    </MainLayout>
  );
};

export default BudgetSchedulePage;
