import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCamera,
  FiPackage,
  FiEdit3,
  FiMapPin, 
  FiPhone, 
  FiGlobe, 
  FiDollarSign,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiStar,
  FiHeart
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ServiceType, ServiceTypeLabels } from '../types/wedding';

// 임시 데이터
const mockWeddingServices = [
  {
    id: 1,
    name: '로맨틱 스튜디오',
    serviceType: ServiceType.STUDIO,
    address: '서울시 강남구 신사동 123',
    phone: '02-1234-5678',
    website: 'https://romantic-studio.com',
    price: 800000,
    description: '감성적인 웨딩 촬영 전문 스튜디오입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.8,
    portfolio: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    specialties: ['야외촬영', '한복촬영', '스냅촬영'],
    isBookmarked: true,
    memo: '포트폴리오가 마음에 듦, 가격 협상 가능'
  },
  {
    id: 2,
    name: '엘레간트 드레스',
    serviceType: ServiceType.DRESS,
    address: '서울시 서초구 반포동 456',
    phone: '02-2345-6789',
    price: 1200000,
    description: '고급 웨딩드레스 전문 브랜드입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.6,
    specialties: ['맞춤제작', '빈티지', '모던'],
    isBookmarked: false,
    memo: ''
  },
  {
    id: 3,
    name: '뷰티 메이크업',
    serviceType: ServiceType.MAKEUP,
    address: '서울시 강남구 청담동 789',
    phone: '02-3456-7890',
    price: 300000,
    description: '브라이덜 메이크업 전문가입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.7,
    specialties: ['자연스러운', '화려한', '한국적'],
    isBookmarked: true,
    memo: '시연 예약 완료'
  }
];

const WeddingServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | ''>('');

  const filteredServices = mockWeddingServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedServiceType || service.serviceType === selectedServiceType;
    return matchesSearch && matchesType;
  });

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.STUDIO:
        return <FiCamera className="w-5 h-5" />;
      case ServiceType.DRESS:
        return <FiPackage className="w-5 h-5" />;
      case ServiceType.MAKEUP:
        return <FiEdit3 className="w-5 h-5" />;
      default:
        return <FiCamera className="w-5 h-5" />;
    }
  };

  const getServiceColor = (type: ServiceType) => {
    switch (type) {
      case ServiceType.STUDIO:
        return 'bg-blue-100 text-blue-600';
      case ServiceType.DRESS:
        return 'bg-pink-100 text-pink-600';
      case ServiceType.MAKEUP:
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const toggleBookmark = (id: number) => {
    console.log('Toggle bookmark for service:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
                ← 대시보드
              </Link>
              <div className="flex items-center mr-3">
                <FiCamera className="w-6 h-6 text-purple-600 mr-1" />
                <FiPackage className="w-6 h-6 text-purple-600 mr-1" />
                <FiEdit3 className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">스드메 관리</h1>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              새 업체 등록
            </motion.button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 카테고리 탭 */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setSelectedServiceType('')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedServiceType === '' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            전체
          </button>
          {Object.values(ServiceType).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedServiceType(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                selectedServiceType === type 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{getServiceIcon(type)}</span>
              {ServiceTypeLabels[type]}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="card p-6 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="업체명 또는 주소로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* 서비스 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* 이미지 */}
              <div className="relative">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleBookmark(service.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    service.isBookmarked 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white text-gray-400 hover:text-pink-500'
                  } transition-colors`}
                >
                  <FiHeart className={`w-4 h-4 ${service.isBookmarked ? 'fill-current' : ''}`} />
                </button>
                
                {/* 서비스 타입 배지 */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getServiceColor(service.serviceType)}`}>
                  <span className="flex items-center">
                    {getServiceIcon(service.serviceType)}
                    <span className="ml-1">{ServiceTypeLabels[service.serviceType]}</span>
                  </span>
                </div>
              </div>

              {/* 내용 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  {service.rating && (
                    <div className="flex items-center text-yellow-500">
                      <FiStar className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">{service.rating}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {service.address}
                  </div>
                  
                  {service.phone && (
                    <div className="flex items-center">
                      <FiPhone className="w-4 h-4 mr-2" />
                      {service.phone}
                    </div>
                  )}

                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-2" />
                    {service.price?.toLocaleString()}원
                  </div>
                </div>

                {/* 전문 분야 */}
                {service.specialties && service.specialties.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {service.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {service.memo && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-yellow-800">{service.memo}</p>
                  </div>
                )}

                {/* 액션 버튼들 */}
                <div className="flex space-x-2">
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <FiEdit className="w-4 h-4 mr-1" />
                    수정
                  </button>
                  <button className="btn-secondary text-red-600 hover:bg-red-50 p-2">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  {service.website && (
                    <a
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary p-2"
                    >
                      <FiGlobe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <FiCamera className="w-8 h-8 text-gray-300 mr-2" />
              <FiPackage className="w-8 h-8 text-gray-300 mr-2" />
              <FiEdit3 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 업체가 없습니다</h3>
            <p className="text-gray-600 mb-4">첫 번째 스드메 업체를 등록해보세요!</p>
            <button className="btn-primary">
              <FiPlus className="w-4 h-4 mr-2" />
              업체 등록하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WeddingServicesPage;
