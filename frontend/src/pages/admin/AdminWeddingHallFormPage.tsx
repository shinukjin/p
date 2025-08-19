import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiSave, 
  FiX, 
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiStar,
  FiInfo
} from 'react-icons/fi';
import { getWeddingHall, createWeddingHall, updateWeddingHall } from '../../api/admin';

interface WeddingHallForm {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  capacity: number;
  price: number;
  description: string;
  imageUrl: string;
  hallType: string;
  rating: number;
  parkingInfo: string;
  facilities: string;
  memo: string;
}

const AdminWeddingHallFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState<WeddingHallForm>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    capacity: 0,
    price: 0,
    description: '',
    imageUrl: '',
    hallType: '',
    rating: 0,
    parkingInfo: '',
    facilities: '',
    memo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchWeddingHall();
    }
  }, [isEdit, id]);

  const fetchWeddingHall = async () => {
    try {
      setLoading(true);
      const response = await getWeddingHall(parseInt(id!));
      
      if (response.success && response.data) {
        const hall = response.data;
        setFormData({
          name: hall.name || '',
          address: hall.address || '',
          phone: hall.phone || '',
          email: hall.email || '',
          website: hall.website || '',
          capacity: hall.capacity || 0,
          price: hall.price || 0,
          description: hall.description || '',
          imageUrl: hall.imageUrl || '',
          hallType: hall.hallType || '',
          rating: hall.rating || 0,
          parkingInfo: hall.parkingInfo || '',
          facilities: hall.facilities || '',
          memo: hall.memo || ''
        });
      } else {
        setError(response.message || '결혼식장 정보를 불러올 수 없습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '결혼식장 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      let response;
      
      if (isEdit) {
        response = await updateWeddingHall(parseInt(id!), formData);
      } else {
        response = await createWeddingHall(formData);
      }
      
      if (response.success) {
        navigate('/admin/wedding-halls');
      } else {
        setError(response.message || '저장에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' || name === 'rating' ? Number(value) : value
    }));
  };

  if (loading && isEdit) {
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
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEdit ? '결혼식장 수정' : '새 결혼식장 추가'}
          </h2>
        </div>
      </div>

      {/* 폼 */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  결혼식장명 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="hallType" className="block text-sm font-medium text-gray-700 mb-1">
                  홀 타입
                </label>
                <select
                  id="hallType"
                  name="hallType"
                  value={formData.hallType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">선택하세요</option>
                  <option value="웨딩홀">웨딩홀</option>
                  <option value="호텔">호텔</option>
                  <option value="레스토랑">레스토랑</option>
                  <option value="컨벤션센터">컨벤션센터</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  주소 *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  웹사이트
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 가격 및 수용 인원 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">가격 및 수용 인원</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  수용 인원 *
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="input-field pl-10"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  가격 (원) *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field pl-10"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  평점
                </label>
                <div className="relative">
                  <FiStar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="input-field pl-10"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">추가 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="parkingInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  주차 정보
                </label>
                <input
                  type="text"
                  id="parkingInfo"
                  name="parkingInfo"
                  value={formData.parkingInfo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 무료주차, 유료주차"
                />
              </div>

              <div>
                <label htmlFor="facilities" className="block text-sm font-medium text-gray-700 mb-1">
                  부대시설
                </label>
                <input
                  type="text"
                  id="facilities"
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="예: 뷔페, 드레스룸, 화장실"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          {/* 설명 및 메모 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">설명 및 메모</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field pl-10"
                    placeholder="결혼식장에 대한 상세한 설명을 입력하세요"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-1">
                  메모
                </label>
                <div className="relative">
                  <FiInfo className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="memo"
                    name="memo"
                    value={formData.memo}
                    onChange={handleChange}
                    rows={3}
                    className="input-field pl-10"
                    placeholder="관리자용 메모를 입력하세요"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/admin/wedding-halls"
              className="btn-secondary flex items-center"
            >
              <FiX className="mr-2 w-4 h-4" />
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <FiSave className="mr-2 w-4 h-4" />
              {loading ? '저장 중...' : (isEdit ? '수정' : '저장')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminWeddingHallFormPage;
