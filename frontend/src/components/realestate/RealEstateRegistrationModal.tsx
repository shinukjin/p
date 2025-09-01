import React, { useState, useEffect } from 'react';
import { FiX, FiMapPin, FiHome, FiDollarSign, FiUpload, FiTrash2 } from 'react-icons/fi';
import type { RealEstateFormData } from '../../types/realestate';

interface RealEstateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<RealEstateFormData>;
}

const RealEstateRegistrationModal: React.FC<RealEstateRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<RealEstateFormData>({
    title: '',
    propertyType: 'APARTMENT',
    transactionType: 'SALE',
    address: '',
    detailAddress: '',
    latitude: '37.5665',
    longitude: '126.9780',
    price: '',
    deposit: '',
    monthlyRent: '',
    area: '',
    rooms: '',
    bathrooms: '',
    parking: '',
    floor: '',
    totalFloors: '',
    yearBuilt: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    images: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RealEstateFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof RealEstateFormData, value: string | number | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RealEstateFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = '매물 제목을 입력해주세요';
    if (!formData.address.trim()) newErrors.address = '주소를 입력해주세요';
    if (!formData.area) newErrors.area = '면적을 입력해주세요';
    if (!formData.rooms) newErrors.rooms = '방 개수를 입력해주세요';
    if (!formData.bathrooms) newErrors.bathrooms = '화장실 개수를 입력해주세요';
    if (!formData.contactName.trim()) newErrors.contactName = '연락처 이름을 입력해주세요';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = '연락처 전화번호를 입력해주세요';

    // 거래 유형에 따른 필수 필드 검증
    if (formData.transactionType === 'SALE' && !formData.price) {
      newErrors.price = '매매가를 입력해주세요';
    }
    if (formData.transactionType === 'RENT' && !formData.deposit) {
      newErrors.deposit = '보증금을 입력해주세요';
    }
    if (formData.transactionType === 'MONTHLY_RENT' && !formData.monthlyRent) {
      newErrors.monthlyRent = '월세를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 이미지 상태 먼저 확인
      console.log('🖼️ 제출 전 이미지 상태:', {
        images: formData.images,
        imagesLength: formData.images?.length,
        firstImage: formData.images?.[0],
        firstImageName: formData.images?.[0]?.name,
        firstImageSize: formData.images?.[0]?.size,
        firstImageType: formData.images?.[0]?.type
      });
      
      const submitFormData = new FormData();
      
      // 부동산 데이터를 JSON으로 변환하여 전송
      const { images, ...dataWithoutImages } = formData;
      const jsonData = JSON.stringify(dataWithoutImages);
      submitFormData.append('data', jsonData);
      
      console.log('📝 FormData 생성:', {
        jsonData,
        imagesCount: images?.length || 0,
        images: images,
        imagesType: typeof images,
        isArray: Array.isArray(images)
      });
      
      // 이미지 파일들 추가 (더 상세한 로깅)
      if (images && images.length > 0) {
        console.log('🖼️ 이미지 추가 시작');
        images.forEach((image, index) => {
          console.log(`📎 이미지 ${index} 추가:`, {
            name: image.name,
            size: image.size,
            type: image.type,
            lastModified: image.lastModified,
            isFile: image instanceof File
          });
          submitFormData.append('images', image);
        });
        console.log('✅ 이미지 추가 완료');
      } else {
        console.log('⚠️ 이미지가 없습니다!');
      }
      
      // FormData 내용 확인
      console.log('🔍 FormData 내용:');
      let formDataSize = 0;
      for (let [key, value] of submitFormData.entries()) {
        console.log(`${key}:`, value);
        formDataSize++;
      }
      
      // FormData 크기 확인
     
      await onSubmit(submitFormData);
      onClose();
    } catch (error) {
      console.error('매물 등록 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      propertyType: 'APARTMENT',
      transactionType: 'SALE',
      address: '',
      detailAddress: '',
      latitude: '37.5665',
      longitude: '126.9780',
      price: '',
      deposit: '',
      monthlyRent: '',
      area: '',
      rooms: '',
      bathrooms: '',
      parking: '',
      floor: '',
      totalFloors: '',
      yearBuilt: '',
      description: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      images: []
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">새 매물 등록</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">기본 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  매물 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="매물 제목을 입력하세요"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  매물 유형 *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="APARTMENT">아파트</option>
                  <option value="VILLA">빌라</option>
                  <option value="OFFICETEL">오피스텔</option>
                  <option value="HOUSE">단독주택</option>
                  <option value="COMMERCIAL">상가</option>
                  <option value="LAND">토지</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거래 유형 *
                </label>
                <select
                  value={formData.transactionType}
                  onChange={(e) => handleInputChange('transactionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SALE">매매</option>
                  <option value="RENT">전세</option>
                  <option value="MONTHLY_RENT">월세</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  면적 (제곱미터) *
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="면적을 입력하세요"
                  min="0"
                  step="0.01"
                />
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>
            </div>
          </div>

          {/* 주소 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">주소 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소 *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="주소를 입력하세요"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
                  >
                    <FiMapPin size={16} />
                  </button>
                </div>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세주소
                </label>
                <input
                  type="text"
                  value={formData.detailAddress}
                  onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="상세주소를 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">가격 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.transactionType === 'SALE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    매매가 (만원) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="매매가를 입력하세요"
                    min="0"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
              )}

              {formData.transactionType === 'RENT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    보증금 (만원) *
                  </label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => handleInputChange('deposit', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.deposit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="보증금을 입력하세요"
                    min="0"
                  />
                  {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
                </div>
              )}

              {formData.transactionType === 'MONTHLY_RENT' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      보증금 (만원)
                    </label>
                    <input
                      type="number"
                      value={formData.deposit}
                      onChange={(e) => handleInputChange('deposit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="보증금을 입력하세요"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      월세 (만원) *
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.monthlyRent ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="월세를 입력하세요"
                      min="0"
                    />
                    {errors.monthlyRent && <p className="text-red-500 text-sm mt-1">{errors.monthlyRent}</p>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">상세 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  방 개수 *
                </label>
                <input
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => handleInputChange('rooms', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="방 개수"
                  min="0"
                />
                {errors.rooms && <p className="text-red-500 text-sm mt-1">{errors.rooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  화장실 개수 *
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="화장실 개수"
                  min="0"
                />
                {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주차 가능 대수
                </label>
                <input
                  type="number"
                  value={formData.parking}
                  onChange={(e) => handleInputChange('parking', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="주차 대수"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  층수
                </label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="현재 층"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전체 층수
                </label>
                <input
                  type="number"
                  value={formData.totalFloors}
                  onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="전체 층수"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  준공년도
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="준공년도"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="매물에 대한 상세한 설명을 입력하세요"
              />
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">연락처 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 이름 *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contactName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="연락처 이름"
                />
                {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 *
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="010-0000-0000"
                />
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이메일 주소"
                />
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">이미지 업로드</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <FiUpload size={32} className="text-gray-400" />
                <span className="text-gray-600">이미지를 선택하거나 드래그하여 업로드하세요</span>
                <span className="text-sm text-gray-500">최대 10개 이미지, 각 5MB 이하</span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`업로드된 이미지 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '등록 중...' : '매물 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealEstateRegistrationModal;
