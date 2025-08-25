import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { X, Plus, Trash2 } from 'lucide-react';
import type { BudgetFormData, BudgetStatus, Priority } from '../../types/budget';

interface BudgetRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  initialData?: Partial<BudgetFormData>;
  isEdit?: boolean;
}

const BudgetRegistrationModal: React.FC<BudgetRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: initialData?.category || '',
    itemName: initialData?.itemName || '',
    plannedAmount: initialData?.plannedAmount || '',
    actualAmount: initialData?.actualAmount || '',
    status: initialData?.status || 'PLANNED',
    priority: initialData?.priority || 'MEDIUM',
    description: initialData?.description || '',
    vendor: initialData?.vendor || '',
    dueDate: initialData?.dueDate || ''
  });

  const handleInputChange = (field: keyof BudgetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      category: '',
      itemName: '',
      plannedAmount: '',
      actualAmount: '',
      status: 'PLANNED',
      priority: 'MEDIUM',
      description: '',
      vendor: '',
      dueDate: ''
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEdit ? '예산 수정' : '새 예산 등록'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 카테고리 & 항목명 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">카테고리 선택</option>
                    <option value="웨딩홀">웨딩홀</option>
                    <option value="스튜디오">스튜디오</option>
                    <option value="드레스">드레스</option>
                    <option value="메이크업">메이크업</option>
                    <option value="부케/플라워">부케/플라워</option>
                    <option value="초대장">초대장</option>
                    <option value="답례품">답례품</option>
                    <option value="혼수">혼수</option>
                    <option value="신혼여행">신혼여행</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    항목명 *
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 그랜드 웨딩홀 계약금"
                    required
                  />
                </div>
              </div>

              {/* 금액 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    계획 금액 *
                  </label>
                  <input
                    type="number"
                    value={formData.plannedAmount}
                    onChange={(e) => handleInputChange('plannedAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    실제 지출 금액
                  </label>
                  <input
                    type="number"
                    value={formData.actualAmount}
                    onChange={(e) => handleInputChange('actualAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* 상태 & 우선순위 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상태
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PLANNED">계획됨</option>
                    <option value="IN_PROGRESS">진행 중</option>
                    <option value="COMPLETED">완료</option>
                    <option value="OVERBUDGET">예산 초과</option>
                    <option value="CANCELLED">취소</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    우선순위
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">낮음</option>
                    <option value="MEDIUM">보통</option>
                    <option value="HIGH">높음</option>
                  </select>
                </div>
              </div>

              {/* 업체 & 기한 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    업체명
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="업체명을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기한
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="추가 설명을 입력하세요"
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  초기화
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isEdit ? '수정하기' : '등록하기'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BudgetRegistrationModal;
