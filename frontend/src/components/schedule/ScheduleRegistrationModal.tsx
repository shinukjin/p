import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { X } from 'lucide-react';
import type { ScheduleFormData, ScheduleType, ScheduleStatus, Priority } from '../../types/schedule';

interface ScheduleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  initialData?: Partial<ScheduleFormData>;
  isEdit?: boolean;
}

const ScheduleRegistrationModal: React.FC<ScheduleRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'OTHER',
    status: initialData?.status || 'PENDING',
    priority: initialData?.priority || 'MEDIUM',
    dueDate: initialData?.dueDate || '',
    relatedVendor: initialData?.relatedVendor || '',
    contactInfo: initialData?.contactInfo || '',
    budgetId: initialData?.budgetId || '',
    daysBeforeWedding: initialData?.daysBeforeWedding || ''
  });

  const handleInputChange = (field: keyof ScheduleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEdit ? '일정 수정' : '새 일정 등록'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                {/* <X size={24} /> */}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">일정 제목 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">일정 타입 *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="VENUE_BOOKING">예식장 예약</option>
                    <option value="CATERING">음식 관련</option>
                    <option value="PHOTOGRAPHY">사진/영상</option>
                    <option value="INVITATION">초대장</option>
                    <option value="DRESS_FITTING">드레스 피팅</option>
                    <option value="MAKEUP_TRIAL">메이크업 시연</option>
                    <option value="FLOWER_ORDER">꽃 주문</option>
                    <option value="MUSIC_SETUP">음향 설정</option>
                    <option value="HONEYMOON_BOOKING">신혼여행 예약</option>
                    <option value="DOCUMENT_PREP">서류 준비</option>
                    <option value="GIFT_PREPARATION">답례품 준비</option>
                    <option value="REHEARSAL">리허설</option>
                    <option value="OTHER">기타</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">대기</option>
                    <option value="IN_PROGRESS">진행 중</option>
                    <option value="COMPLETED">완료</option>
                    <option value="OVERDUE">기한 초과</option>
                    <option value="CANCELLED">취소</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">낮음</option>
                    <option value="MEDIUM">보통</option>
                    <option value="HIGH">높음</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마감일 *</label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">D-Day</label>
                  <input
                    type="number"
                    value={formData.daysBeforeWedding}
                    onChange={(e) => handleInputChange('daysBeforeWedding', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="결혼식 전 일수"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">관련 업체</label>
                  <input
                    type="text"
                    value={formData.relatedVendor}
                    onChange={(e) => handleInputChange('relatedVendor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="업체명"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="전화번호/이메일"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="일정에 대한 상세 설명"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

export default ScheduleRegistrationModal;
