import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiSearch,
  FiHeart,
  FiMapPin,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import { getWeddingHalls, deleteWeddingHall } from '../../api/admin';

interface WeddingHall {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  price: number;
  description: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const AdminWeddingHallsPage: React.FC = () => {
  const [weddingHalls, setWeddingHalls] = useState<WeddingHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchWeddingHalls();
  }, []);

  const fetchWeddingHalls = async () => {
    try {
      setLoading(true);
      const response = await getWeddingHalls();
      
      if (response.success && response.data) {
        setWeddingHalls(response.data);
      } else {
        setError(response.message || '결혼식장 데이터를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '결혼식장 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 결혼식장을 삭제하시겠습니까?')) {
      try {
        const response = await deleteWeddingHall(id);
        if (response.success) {
          setWeddingHalls(weddingHalls.filter(hall => hall.id !== id));
        } else {
          alert(response.message || '삭제에 실패했습니다.');
        }
      } catch (err: any) {
        alert(err.response?.data?.message || '삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredWeddingHalls = weddingHalls.filter(hall => {
    const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || hall.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* 페이지 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">결혼식장 관리</h2>
        <Link
          to="/admin/wedding-halls/new"
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2 w-4 h-4" />
          새 결혼식장 추가
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="결혼식장명 또는 주소로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
      </div>

      {/* 결혼식장 목록 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredWeddingHalls.map((hall) => (
            <li key={hall.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <FiHeart className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{hall.name}</h3>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hall.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {hall.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <FiMapPin className="mr-1 h-4 w-4" />
                        {hall.address}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <FiPhone className="mr-1 h-4 w-4" />
                        {hall.phone}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <FiMail className="mr-1 h-4 w-4" />
                        {hall.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">수용 인원</div>
                      <div className="text-lg font-medium text-gray-900">{hall.capacity}명</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">가격</div>
                      <div className="text-lg font-medium text-gray-900">{hall.price.toLocaleString()}원</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Link
                        to={`/admin/wedding-halls/${hall.id}`}
                        className="btn-secondary"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/wedding-halls/${hall.id}/edit`}
                        className="btn-secondary"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(hall.id)}
                        className="btn-danger"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredWeddingHalls.length === 0 && (
        <div className="text-center py-12">
          <FiHeart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">결혼식장이 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedStatus !== 'all' 
              ? '검색 조건에 맞는 결혼식장이 없습니다.' 
              : '새로운 결혼식장을 추가해보세요.'}
          </p>
          {!searchTerm && selectedStatus === 'all' && (
            <div className="mt-6">
              <Link
                to="/admin/wedding-halls/new"
                className="btn-primary"
              >
                <FiPlus className="mr-2 w-4 h-4" />
                첫 번째 결혼식장 추가
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWeddingHallsPage;
