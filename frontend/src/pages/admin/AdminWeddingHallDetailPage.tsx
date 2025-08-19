import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiEdit, 
  FiTrash2, 
  FiArrowLeft,
  FiHeart,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiCalendar,
  FiStar
} from 'react-icons/fi';
import { getWeddingHall, deleteWeddingHall } from '../../api/admin';

interface WeddingHall {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  capacity: number;
  price: number;
  description: string;
  imageUrl?: string;
  hallType: string;
  rating: number;
  parkingInfo: string;
  facilities: string;
  memo: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  userName?: string;
}

const AdminWeddingHallDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [weddingHall, setWeddingHall] = useState<WeddingHall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchWeddingHall();
    }
  }, [id]);

  const fetchWeddingHall = async () => {
    try {
      setLoading(true);
      const response = await getWeddingHall(parseInt(id!));
      
      if (response.success && response.data) {
        setWeddingHall(response.data);
      } else {
        setError(response.message || '결혼식장 정보를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '결혼식장 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!weddingHall) return;
    
    if (window.confirm('정말로 이 결혼식장을 삭제하시겠습니까?')) {
      try {
        const response = await deleteWeddingHall(weddingHall.id);
        if (response.success) {
          navigate('/admin/wedding-halls');
        } else {
          alert(response.message || '삭제에 실패했습니다.');
        }
      } catch (err: any) {
        alert(err.response?.data?.message || '삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error || !weddingHall) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-red-600">{error || '결혼식장을 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* 페이지 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/wedding-halls"
            className="btn-secondary flex items-center"
          >
            <FiArrowLeft className="mr-2 w-4 h-4" />
            목록으로
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">{weddingHall.name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/wedding-halls/${weddingHall.id}/edit`}
            className="btn-primary flex items-center"
          >
            <FiEdit className="mr-2 w-4 h-4" />
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="btn-danger flex items-center"
          >
            <FiTrash2 className="mr-2 w-4 h-4" />
            삭제
          </button>
        </div>
      </div>

      {/* 상세 정보 카드 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* 헤더 정보 */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                <FiHeart className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{weddingHall.name}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    weddingHall.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {weddingHall.status === 'active' ? '활성' : '비활성'}
                  </span>
                  {weddingHall.hallType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {weddingHall.hallType}
                    </span>
                  )}
                  {weddingHall.rating && (
                    <div className="flex items-center space-x-1">
                      <FiStar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{weddingHall.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 기본 정보 */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">주소</p>
                    <p className="text-sm text-gray-600">{weddingHall.address}</p>
                  </div>
                </div>

                {weddingHall.phone && (
                  <div className="flex items-start space-x-3">
                    <FiPhone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">전화번호</p>
                      <p className="text-sm text-gray-600">{weddingHall.phone}</p>
                    </div>
                  </div>
                )}

                {weddingHall.email && (
                  <div className="flex items-start space-x-3">
                    <FiMail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">이메일</p>
                      <p className="text-sm text-gray-600">{weddingHall.email}</p>
                    </div>
                  </div>
                )}

                {weddingHall.website && (
                  <div className="flex items-start space-x-3">
                    <FiGlobe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">웹사이트</p>
                      <a 
                        href={weddingHall.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {weddingHall.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 가격 및 수용 인원 */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">가격 및 수용 인원</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiUsers className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">수용 인원</p>
                    <p className="text-lg font-semibold text-gray-900">{weddingHall.capacity}명</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">가격</p>
                    <p className="text-lg font-semibold text-gray-900">{weddingHall.price?.toLocaleString()}원</p>
                  </div>
                </div>

                {weddingHall.parkingInfo && (
                  <div className="flex items-start space-x-3">
                    <div className="h-5 w-5 text-gray-400 mt-0.5">🅿️</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">주차 정보</p>
                      <p className="text-sm text-gray-600">{weddingHall.parkingInfo}</p>
                    </div>
                  </div>
                )}

                {weddingHall.facilities && (
                  <div className="flex items-start space-x-3">
                    <div className="h-5 w-5 text-gray-400 mt-0.5">🏢</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">부대시설</p>
                      <p className="text-sm text-gray-600">{weddingHall.facilities}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 설명 */}
          {weddingHall.description && (
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">설명</h4>
              <div className="flex items-start space-x-3">
                <FiFileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">{weddingHall.description}</p>
              </div>
            </div>
          )}

          {/* 메모 */}
          {weddingHall.memo && (
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">메모</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{weddingHall.memo}</p>
              </div>
            </div>
          )}

          {/* 등록 정보 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FiCalendar className="h-4 w-4" />
                <span>등록일: {new Date(weddingHall.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="h-4 w-4" />
                <span>수정일: {new Date(weddingHall.updatedAt).toLocaleDateString()}</span>
              </div>
              {weddingHall.userName && (
                <div className="flex items-center space-x-2">
                  <span>등록자: {weddingHall.userName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWeddingHallDetailPage;
