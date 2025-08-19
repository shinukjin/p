import React from 'react';
import { FiEdit3, FiSave, FiX } from 'react-icons/fi';
import type { User, EditForm } from '../../types/user';

interface UserDetailModalProps {
  user: User | null;
  isVisible: boolean;
  isEditing: boolean;
  editForm: EditForm;
  onClose: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveChanges: () => void;
  onEditFormChange: (field: string, value: string) => void;
  formatDate: (dateString: string) => string;
  getRoleColor: (role: string) => string;
  getStatusColor: (status: string) => string;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isVisible,
  isEditing,
  editForm,
  onClose,
  onStartEditing,
  onCancelEditing,
  onSaveChanges,
  onEditFormChange,
  formatDate,
  getRoleColor,
  getStatusColor
}) => {
  if (!isVisible || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? '사용자 정보 수정' : '사용자 상세 정보'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <p className="text-sm text-gray-900">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">사용자명</label>
              <p className="text-sm text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">이름</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => onEditFormChange('name', e.target.value)}
                  className="input"
                />
              ) : (
                <p className="text-sm text-gray-900">{user.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => onEditFormChange('email', e.target.value)}
                  className="input"
                />
              ) : (
                <p className="text-sm text-gray-900">{user.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">전화번호</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => onEditFormChange('phone', e.target.value)}
                  className="input"
                  placeholder="전화번호를 입력하세요"
                />
              ) : (
                <p className="text-sm text-gray-900">{user.phone || '입력되지 않음'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">역할</label>
              {isEditing ? (
                <select
                  value={editForm.role}
                  onChange={(e) => onEditFormChange('role', e.target.value)}
                  className="input"
                >
                  <option value="SUPER_ADMIN">슈퍼관리자</option>
                  <option value="ADMIN">일반관리자</option>
                  <option value="OPERATOR">운영자</option>
                  <option value="USER">일반사용자</option>
                </select>
              ) : (
                <span className={`badge ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">상태</label>
              {isEditing ? (
                <select
                  value={editForm.status}
                  onChange={(e) => onEditFormChange('status', e.target.value)}
                  className="input"
                >
                  <option value="ACTIVE">활성</option>
                  <option value="INACTIVE">비활성</option>
                  <option value="LOCKED">잠금</option>
                </select>
              ) : (
                <span className={`badge ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">마지막 로그인</label>
              <p className="text-sm text-gray-900">
                {user.lastLoginAt ? formatDate(user.lastLoginAt) : '로그인 기록 없음'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">가입일</label>
              <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={onCancelEditing}
                  className="btn-secondary"
                >
                  <FiX className="w-4 h-4 mr-2" />
                  취소
                </button>
                <button
                  onClick={onSaveChanges}
                  className="btn-success"
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  저장
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onStartEditing}
                  className="btn-primary"
                >
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  수정
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  닫기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
