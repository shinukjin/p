import React from 'react';
import { FiSearch, FiShield, FiFilter } from 'react-icons/fi';

interface UserSearchFilterProps {
  searchKeyword: string;
  selectedRole: string;
  selectedStatus: string;
  onSearchKeywordChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const UserSearchFilter: React.FC<UserSearchFilterProps> = ({
  searchKeyword,
  selectedRole,
  selectedStatus,
  onSearchKeywordChange,
  onRoleChange,
  onStatusChange,
  onSearch,
  onReset
}) => {
  return (
    <div className="card mb-6">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">검색 및 필터</h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiSearch className="inline mr-2 w-4 h-4" />
              검색어
            </label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              placeholder="사용자명, 이름, 이메일"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiShield className="inline mr-2 w-4 h-4" />
              역할
            </label>
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="input"
            >
              <option value="">전체</option>
              <option value="SUPER_ADMIN">슈퍼관리자</option>
              <option value="ADMIN">일반관리자</option>
              <option value="OPERATOR">운영자</option>
              <option value="USER">일반사용자</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="inline mr-2 w-4 h-4" />
              상태
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="input"
            >
              <option value="">전체</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="LOCKED">잠금</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={onSearch}
              className="btn-primary"
            >
              <FiSearch className="mr-2 w-4 h-4" />
              검색
            </button>
            <button
              onClick={onReset}
              className="btn-secondary"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchFilter;
