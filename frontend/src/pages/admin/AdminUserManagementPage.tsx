import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiMinus
} from 'react-icons/fi';
import { getUsers, deleteUser } from '../../api/admin';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLoginAt: string;
  createdAt: string;
}

interface UserListResponse {
  users: User[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

type SortField = 'name' | 'username' | 'email' | 'role' | 'status' | 'createdAt' | 'lastLoginAt';
type SortOrder = 'asc' | 'desc';

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      
      if (response.success && response.data) {
        // 백엔드 응답 구조에 따라 users 배열 추출
        let userData: User[] = [];
        
        if (response.data.users && Array.isArray(response.data.users)) {
          // 페이징된 응답인 경우
          userData = response.data.users;
        } else if (Array.isArray(response.data)) {
          // 직접 배열인 경우
          userData = response.data;
        } else {
          // 기타 경우 빈 배열로 설정
          userData = [];
        }
        
        setUsers(userData);
      } else {
        setError(response.message || '사용자 데이터를 불러올 수 없습니다.');
        setUsers([]); // 오류 시 빈 배열로 설정
      }
    } catch (err: any) {
      console.error('사용자 데이터 로딩 오류:', err);
      setError(err.response?.data?.message || '사용자 데이터를 불러오는 중 오류가 발생했습니다.');
      setUsers([]); // 오류 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        const response = await deleteUser(id);
        if (response.success) {
          setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        } else {
          alert(response.message || '삭제에 실패했습니다.');
        }
      } catch (err: any) {
        alert(err.response?.data?.message || '삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 검색 및 필터링
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // 정렬 처리
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <FiMinus className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <FiArrowUp className="w-4 h-4 text-blue-600" />
      : <FiArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const filteredAndSortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // 날짜 필드인 경우 Date 객체로 변환
    if (sortField === 'createdAt' || sortField === 'lastLoginAt') {
      aValue = new Date(aValue || 0).getTime();
      bValue = new Date(bValue || 0).getTime();
    }

    // 문자열인 경우 소문자로 변환하여 비교
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'SUPER_ADMIN': { label: '최고관리자', color: 'bg-red-100 text-red-800' },
      'ADMIN': { label: '관리자', color: 'bg-blue-100 text-blue-800' },
      'OPERATOR': { label: '운영자', color: 'bg-green-100 text-green-800' },
      'USER': { label: '일반사용자', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ACTIVE': { label: '활성', color: 'bg-green-100 text-green-800' },
      'INACTIVE': { label: '비활성', color: 'bg-yellow-100 text-yellow-800' },
      'SUSPENDED': { label: '정지', color: 'bg-red-100 text-red-800' },
      'DELETED': { label: '삭제됨', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">사용자 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">오류 발생</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">사용자 관리</h2>
          <p className="mt-1 text-sm text-gray-600">
            시스템에 등록된 모든 사용자를 관리할 수 있습니다.
          </p>
        </div>

        {/* 통계 정보 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">총 사용자</dt>
                    <dd className="text-lg font-medium text-gray-900">{filteredAndSortedUsers.length}명</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">활성 사용자</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {filteredAndSortedUsers.filter(u => u.status === 'ACTIVE').length}명
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">관리자</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {filteredAndSortedUsers.filter(u => ['ADMIN', 'SUPER_ADMIN', 'OPERATOR'].includes(u.role)).length}명
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">일반 사용자</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {filteredAndSortedUsers.filter(u => u.role === 'USER').length}명
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="이름, 사용자명, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                역할
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">모든 역할</option>
                <option value="SUPER_ADMIN">최고관리자</option>
                <option value="ADMIN">관리자</option>
                <option value="OPERATOR">운영자</option>
                <option value="USER">일반사용자</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
                <option value="SUSPENDED">정지</option>
                <option value="DELETED">삭제됨</option>
              </select>
            </div>
          </div>
        </div>

        {/* 사용자 목록 테이블 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>사용자 정보</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>연락처</span>
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>역할</span>
                      {getSortIcon('role')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>상태</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>가입일</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('lastLoginAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>마지막 로그인</span>
                      {getSortIcon('lastLoginAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">사용자가 없습니다</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all' 
                          ? '검색 조건을 변경해보세요.' 
                          : '아직 등록된 사용자가 없습니다.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      {/* 사용자 정보 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* 연락처 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-900">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <FiPhone className="w-4 h-4 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* 역할 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      
                      {/* 상태 */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      
                      {/* 가입일 */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      
                      {/* 마지막 로그인 */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString('ko-KR')
                          : '-'
                        }
                      </td>
                      
                      {/* 작업 */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex space-x-2 justify-center">
                          <button className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors">
                            <FiEye className="w-3 h-3 mr-1" />
                            상세보기
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-md hover:bg-green-100 transition-colors">
                            <FiEdit className="w-3 h-3 mr-1" />
                            수정
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-md hover:bg-red-100 transition-colors"
                          >
                            <FiTrash2 className="w-3 h-3 mr-1" />
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
