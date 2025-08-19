import React from 'react';
import { FiUsers, FiEdit3, FiTrash2, FiUnlock } from 'react-icons/fi';
import type { User } from '../../types/user';

interface UserListProps {
  users: User[];
  totalElements: number;
  onStatusChange: (userId: number, newStatus: string) => void;
  onUserDetail: (user: User) => void;
  onDeleteUser: (userId: number) => void;
  onUnlockUser: (userId: number) => void;
  formatDate: (dateString: string) => string;
  getRoleColor: (role: string) => string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  totalElements,
  onStatusChange,
  onUserDetail,
  onDeleteUser,
  onUnlockUser,
  formatDate,
  getRoleColor
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">
          <FiUsers className="inline mr-2 w-4 h-4" />
          사용자 목록 ({totalElements}명)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th>사용자 정보</th>
              <th>역할</th>
              <th>상태</th>
              <th>마지막 로그인</th>
              <th>가입일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name} ({user.username})
                    </div>
                    <div className="text-sm text-gray-600">
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-600">
                        {user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`badge ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) => onStatusChange(user.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="ACTIVE">활성</option>
                    <option value="INACTIVE">비활성</option>
                    <option value="LOCKED">잠금</option>
                  </select>
                </td>
                <td className="text-sm text-gray-600">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : '로그인 기록 없음'}
                </td>
                <td className="text-sm text-gray-600">
                  {formatDate(user.createdAt)}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onUserDetail(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="상세보기/수정"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="삭제"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    {user.status === 'LOCKED' && (
                      <button
                        onClick={() => onUnlockUser(user.id)}
                        className="text-green-600 hover:text-green-800"
                        title="잠금 해제"
                      >
                        <FiUnlock className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
