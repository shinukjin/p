import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useUpdateUserTotalBudget } from '../hooks/useAuth';

interface UserBudgetManagerProps {
  onBudgetUpdate?: (newBudget: number) => void;
}

const UserBudgetManager: React.FC<UserBudgetManagerProps> = ({ onBudgetUpdate }) => {
  const { user } = useAuthStore();
  const updateTotalBudgetMutation = useUpdateUserTotalBudget();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(user?.totalBudget || 0);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateTotalBudgetMutation.mutateAsync({ totalBudget: newBudget });
      
      if (onBudgetUpdate) {
        onBudgetUpdate(newBudget);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('예산 업데이트 실패:', error);
    }
  };

  const handleCancel = () => {
    setNewBudget(user?.totalBudget || 0);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">총 예산 관리</h3>
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
              총 예산
            </label>
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="총 예산을 입력하세요"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              disabled={updateTotalBudgetMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {updateTotalBudgetMutation.isPending ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={handleCancel}
              disabled={updateTotalBudgetMutation.isPending}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">현재 총 예산</span>
            <span className="text-2xl font-bold text-gray-900">
              {user?.totalBudget?.toLocaleString() || 0}원
            </span>
          </div>
          <div className="text-xs text-gray-500">
            이 예산에서 예산 일정과 가전가구 구매 비용이 차감됩니다.
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserBudgetManager;
