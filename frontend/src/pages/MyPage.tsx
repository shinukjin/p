import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useUpdateUserInfo, useUpdateUserTotalBudget } from '../hooks/useAuth';
import MainLayout from '../components/layout/MainLayout';
import UserBudgetManager from '../components/UserBudgetManager';
import { getTokenExpirationTimeFormatted, getTokenExpirationTimeFormattedKR } from '../utils/auth';

const MyPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const updateUserInfoMutation = useUpdateUserInfo();
  const updateTotalBudgetMutation = useUpdateUserTotalBudget();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateUserInfoMutation.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || ''
      });
    }
    setIsEditing(false);
  };

  const handleBudgetUpdate = async (newBudget: number) => {
    try {
      await updateTotalBudgetMutation.mutateAsync({ totalBudget: newBudget });
    } catch (error) {
      console.error('총 예산 업데이트 실패:', error);
    }
  };

  if (!user) {
    return (
      <MainLayout title="나의 페이지" breadcrumbs={[{ name: '나의 페이지' }]}>
        <div className="text-center py-12">
          <p className="text-red-500">사용자 정보를 찾을 수 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="나의 페이지"
      breadcrumbs={[{ name: '나의 페이지' }]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* 프로필 정보 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">프로필 정보</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                수정
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명
                </label>
                <input
                  type="text"
                  value={formData.username}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="사용자명"
                  disabled={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이메일"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="전화번호"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={updateUserInfoMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {updateUserInfoMutation.isPending ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updateUserInfoMutation.isPending}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">사용자명</span>
                <span className="text-gray-900 font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">이름</span>
                <span className="text-gray-900 font-medium">{user.name || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">이메일</span>
                <span className="text-gray-900 font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">전화번호</span>
                <span className="text-gray-900 font-medium">{user.phone || '-'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 총 예산 관리 */}
        <UserBudgetManager onBudgetUpdate={handleBudgetUpdate} />

        {/* 계정 정보 */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">상태</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.statusDescription || user.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">권한</span>
              <span className="text-gray-900 font-medium">{user.roleDescription || user.role}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">가입일</span>
              <span className="text-gray-900 font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </span>
            </div>
            {user.lastLoginAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">마지막 로그인</span>
                <span className="text-gray-900 font-medium">
                  {new Date(user.lastLoginAt).toLocaleString()}
                </span>
              </div>
            )}
            {user.updatedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">정보 수정일</span>
                <span className="text-gray-900 font-medium">
                  {new Date(user.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">토큰 만료</span>
              <span className="text-gray-900 font-medium">
                {getTokenExpirationTimeFormatted()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">만료 시간</span>
              <span className="text-gray-900 font-medium text-sm">
                {getTokenExpirationTimeFormattedKR()}
              </span>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -2 }} className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl text-blue-600">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 예산</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user.totalBudget?.toLocaleString() || 0}원
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl text-purple-600">🗓️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">가입일</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl text-yellow-600">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">계정 상태</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user.statusDescription || user.status}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default MyPage;
