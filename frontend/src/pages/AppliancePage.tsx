import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApplianceRegistrationModal from '../components/appliance/ApplianceRegistrationModal';
import type { Appliance, ApplianceFormData, ApplianceSummary, ApplianceStatus, AppliancePriority, ApplianceCategory } from '../types/appliance';
import { ApplianceCategoryLabels, ApplianceStatusLabels, AppliancePriorityLabels } from '../types/appliance';
import MainLayout from '../components/layout/MainLayout';

const AppliancePage: React.FC = () => {
  // 상태 관리
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [applianceSummary, setApplianceSummary] = useState<ApplianceSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ApplianceCategory | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ApplianceStatus | ''>('');

  // 모의 데이터 (실제 개발 시 제거)
  useEffect(() => {
    const mockAppliances: Appliance[] = [
      {
        id: 1,
        name: '삼성 냉장고',
        category: 'KITCHEN' as ApplianceCategory,
        brand: '삼성',
        model: 'RT38K501J8',
        plannedPrice: 1200000,
        actualPrice: 1100000,
        status: 'PURCHASED' as ApplianceStatus,
        priority: 'HIGH' as AppliancePriority,
        description: '4도어 냉장고',
        store: '삼성전자 공식몰',
        purchaseDate: '2024-01-15',
        deliveryDate: '2024-01-20',
        installationDate: '2024-01-21',
        warranty: '10년',
        memo: '할인 혜택으로 구매',
        imageUrl: '',
        isBookmarked: true,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-15T00:00:00'
      },
      {
        id: 2,
        name: 'LG 세탁기',
        category: 'LAUNDRY' as ApplianceCategory,
        brand: 'LG',
        model: 'F21VKDSL',
        plannedPrice: 800000,
        actualPrice: 750000,
        status: 'DELIVERED' as ApplianceStatus,
        priority: 'MEDIUM' as AppliancePriority,
        description: '드럼세탁기 21kg',
        store: 'LG 공식몰',
        purchaseDate: '2024-01-10',
        deliveryDate: '2024-01-18',
        installationDate: '',
        warranty: '10년',
        memo: '설치 예정',
        imageUrl: '',
        isBookmarked: false,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-10T00:00:00'
      },
      {
        id: 3,
        name: '소파',
        category: 'FURNITURE' as ApplianceCategory,
        brand: '이케아',
        model: 'KIVIK',
        plannedPrice: 500000,
        actualPrice: undefined,
        status: 'RESEARCHING' as ApplianceStatus,
        priority: 'LOW' as AppliancePriority,
        description: '3인용 소파',
        store: '',
        purchaseDate: '',
        deliveryDate: '',
        installationDate: '',
        warranty: '',
        memo: '색상 고민 중',
        imageUrl: '',
        isBookmarked: true,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00'
      }
    ];

    setAppliances(mockAppliances);

    // 통계 데이터 계산
    const totalPlannedPrice = mockAppliances.reduce((sum, item) => sum + item.plannedPrice, 0);
    const totalActualPrice = mockAppliances.reduce((sum, item) => sum + (item.actualPrice || 0), 0);
    const completedCount = mockAppliances.filter(item => item.status === 'INSTALLED').length;

    setApplianceSummary({
      category: '전체' as any,
      itemCount: mockAppliances.length,
      totalPlannedPrice,
      totalActualPrice,
      remainingAmount: totalPlannedPrice - totalActualPrice,
      completionRate: (completedCount / mockAppliances.length) * 100
    });
  }, []);

  // 가전가구 등록/수정 처리
  const handleApplianceSubmit = (data: ApplianceFormData) => {
    if (editingAppliance) {
      // 수정
      const updatedAppliance: Appliance = {
        ...editingAppliance,
        ...data,
        plannedPrice: parseInt(data.plannedPrice),
        actualPrice: data.actualPrice ? parseInt(data.actualPrice) : undefined,
        updatedAt: new Date().toISOString()
      };
      
      setAppliances(prev => prev.map(item => 
        item.id === editingAppliance.id ? updatedAppliance : item
      ));
      setEditingAppliance(null);
    } else {
      // 새로 등록
      const newAppliance: Appliance = {
        id: Date.now(),
        ...data,
        plannedPrice: parseInt(data.plannedPrice),
        actualPrice: data.actualPrice ? parseInt(data.actualPrice) : undefined,
        imageUrl: '',
        isBookmarked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAppliances(prev => [...prev, newAppliance]);
    }
    
    // 통계 업데이트
    updateSummary();
  };

  // 통계 업데이트
  const updateSummary = () => {
    const totalPlannedPrice = appliances.reduce((sum, item) => sum + item.plannedPrice, 0);
    const totalActualPrice = appliances.reduce((sum, item) => sum + (item.actualPrice || 0), 0);
    const completedCount = appliances.filter(item => item.status === 'INSTALLED').length;

    setApplianceSummary({
      category: '전체' as any,
      itemCount: appliances.length,
      totalPlannedPrice,
      totalActualPrice,
      remainingAmount: totalPlannedPrice - totalActualPrice,
      completionRate: appliances.length > 0 ? (completedCount / appliances.length) * 100 : 0
    });
  };

  // 가전가구 삭제
  const handleDelete = (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setAppliances(prev => prev.filter(item => item.id !== id));
      updateSummary();
    }
  };

  // 가전가구 수정 모드 시작
  const handleEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppliance(null);
  };

  // 북마크 토글
  const toggleBookmark = (id: number) => {
    setAppliances(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  // 상태별 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INSTALLED':
        return 'bg-green-100 text-green-800';
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-800';
      case 'PURCHASED':
        return 'bg-purple-100 text-purple-800';
      case 'RESEARCHING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PLANNING':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 우선순위별 색상 반환
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 필터링된 가전가구 목록
  const filteredAppliances = appliances.filter(appliance => {
    const matchesSearch = appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appliance.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appliance.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || appliance.category === selectedCategory;
    const matchesStatus = !selectedStatus || appliance.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 정렬된 가전가구 목록 (설치 완료된 항목을 아래로)
  const sortedAppliances = [...filteredAppliances].sort((a, b) => {
    if (a.status === 'INSTALLED' && b.status !== 'INSTALLED') return 1;
    if (a.status !== 'INSTALLED' && b.status === 'INSTALLED') return -1;
    return 0;
  });

  return (
    <MainLayout 
      title="가전가구 관리"
      breadcrumbs={[{ name: '가전가구' }]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl text-blue-600">🏠</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 계획 가격</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applianceSummary?.totalPlannedPrice.toLocaleString()}원
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl text-green-600">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 구매 가격</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applianceSummary?.totalActualPrice.toLocaleString()}원
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl text-yellow-600">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">잔여 예산</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applianceSummary?.remainingAmount.toLocaleString()}원
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl text-purple-600">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">설치 완료</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appliances.filter(a => a.status === 'INSTALLED').length}개
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 검색 및 필터 */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="제품명, 브랜드, 모델명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ApplianceCategory | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체 카테고리</option>
                {Object.entries(ApplianceCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 상태 필터 */}
            <div className="w-full md:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ApplianceStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체 상태</option>
                {Object.entries(ApplianceStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 추가 버튼 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center whitespace-nowrap"
            >
              <span className="w-4 h-4 mr-2">➕</span>
              새 가전가구 등록
            </motion.button>
          </div>
        </div>

        {/* 가전가구 목록 */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">가전가구 목록</h2>

            {sortedAppliances.length > 0 ? (
              <div className="overflow-x-auto">
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
                        브랜드/모델
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
                        구매일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAppliances.map((appliance) => (
                      <tr key={appliance.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleBookmark(appliance.id)}
                              className={`mr-2 ${appliance.isBookmarked ? 'text-red-500' : 'text-gray-400'}`}
                            >
                              {appliance.isBookmarked ? '❤️' : '🤍'}
                            </button>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{appliance.name}</div>
                              {appliance.store && (
                                <div className="text-xs text-gray-500">{appliance.store}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ApplianceCategoryLabels[appliance.category]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>{appliance.brand || '-'}</div>
                            <div className="text-xs text-gray-500">{appliance.model || '-'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appliance.plannedPrice.toLocaleString()}원
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appliance.actualPrice ? `${appliance.actualPrice.toLocaleString()}원` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appliance.status)}`}>
                            {ApplianceStatusLabels[appliance.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(appliance.priority)}`}>
                            {AppliancePriorityLabels[appliance.priority]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appliance.purchaseDate ? new Date(appliance.purchaseDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(appliance)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(appliance.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* 요약 행 */}
                  <tfoot className="bg-gray-50">
                    <tr className="font-semibold">
                      <td className="px-6 py-4 text-sm text-gray-900" colSpan={3}>
                        총계
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600">
                        {applianceSummary?.totalPlannedPrice.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600">
                        {applianceSummary?.totalActualPrice.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900" colSpan={2}>
                        진행률: {applianceSummary?.completionRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900" colSpan={2}>
                        잔여: {applianceSummary?.remainingAmount.toLocaleString()}원
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="mx-auto text-4xl text-gray-400">🏠</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">등록된 가전가구가 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">새로운 가전가구를 등록해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 모달 */}
      <ApplianceRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleApplianceSubmit}
        initialData={editingAppliance ? {
          name: editingAppliance.name,
          category: editingAppliance.category,
          brand: editingAppliance.brand || '',
          model: editingAppliance.model || '',
          plannedPrice: editingAppliance.plannedPrice.toString(),
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
    </MainLayout>
  );
};

export default AppliancePage;
