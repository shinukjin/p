import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCamera, 
  FiPackage, 
  FiEdit3, 
  FiMapPin, 
  FiPhone, 
  FiGlobe, 
  FiHeart,
  FiPlus,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiStar
} from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

// 임시 데이터
const mockWeddingServices = [
  {
    id: 1,
    type: '스튜디오',
    name: '로맨틱 스튜디오',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    website: 'https://romanticstudio.com',
    price: 500000,
    description: '자연스러운 분위기의 웨딩 스튜디오입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.8,
    isBookmarked: true,
    memo: '사전 예약 필수, 주말 할인 가능'
  },
  {
    id: 2,
    type: '드레스',
    name: '엘레간트 드레스샵',
    address: '서울시 서초구 반포대로 456',
    phone: '02-2345-6789',
    website: 'https://elegantdress.com',
    price: 800000,
    description: '고급스러운 웨딩드레스를 대여할 수 있습니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.5,
    isBookmarked: false,
    memo: ''
  },
  {
    id: 3,
    type: '메이크업',
    name: '뷰티 메이크업',
    address: '서울시 강남구 논현로 789',
    phone: '02-3456-7890',
    website: 'https://beautymakeup.com',
    price: 300000,
    description: '자연스러운 웨딩 메이크업을 제공합니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.7,
    isBookmarked: true,
    memo: '시술 시간 2시간, 추가 시술 가능'
  }
];

const WeddingServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('');

  const filteredServices = mockWeddingServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedServiceType || service.type === selectedServiceType;
    return matchesSearch && matchesType;
  });

  const toggleBookmark = (id: number) => {
    // TODO: API 호출로 북마크 상태 변경
    console.log('Toggle bookmark for service:', id);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case '스튜디오':
        return <FiCamera className="w-6 h-6" />;
      case '드레스':
        return <FiPackage className="w-6 h-6" />;
      case '메이크업':
        return <FiEdit3 className="w-6 h-6" />;
      default:
        return <FiPackage className="w-6 h-6" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case '스튜디오':
        return 'bg-blue-100 text-blue-600';
      case '드레스':
        return 'bg-pink-100 text-pink-600';
      case '메이크업':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <MainLayout 
      title="스드메 관리"
      breadcrumbs={[{ name: '스드메' }]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 상단 액션 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            새 서비스 등록
          </motion.button>
        </div>

        {/* 검색 및 필터 */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="서비스명 또는 주소로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 필터 */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                필터
              </button>
            </div>
          </div>

          {/* 필터 옵션 */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">서비스 유형</label>
                  <select
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">전체</option>
                    <option value="스튜디오">스튜디오</option>
                    <option value="드레스">드레스</option>
                    <option value="메이크업">메이크업</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 서비스 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow"
            >
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
                  <FiHeart className={`w-5 h-5 ${service.isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${getServiceColor(service.type)}`}>
                  {service.type}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <div className="flex items-center">
                    <FiStar className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{service.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{service.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className={`w-4 h-4 mr-2 flex-shrink-0 ${getServiceColor(service.type)} rounded-full flex items-center justify-center`}>
                      {getServiceIcon(service.type)}
                    </div>
                    <span className="text-sm">{service.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm font-medium">가격: {service.price.toLocaleString()}원</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                {service.memo && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                    <p className="text-sm text-yellow-800">{service.memo}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="btn-secondary flex items-center text-sm">
                      <FiEdit3 className="w-4 h-4 mr-1" />
                      수정
                    </button>
                    <button className="btn-danger flex items-center text-sm">
                      <FiTrash2 className="w-4 h-4 mr-1" />
                      삭제
                    </button>
                  </div>
                  {service.website && (
                    <a
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <FiGlobe className="w-4 h-4 mr-1" />
                      웹사이트
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
              <FiCamera className="w-16 h-16 text-gray-300" />
              <FiPackage className="w-16 h-16 text-gray-300 -ml-8" />
              <FiEdit3 className="w-16 h-16 text-gray-300 -ml-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 서비스가 없습니다</h3>
            <p className="text-gray-600 mb-4">첫 번째 스드메 서비스를 등록해보세요!</p>
            <button className="btn-primary">
              <FiPlus className="w-4 h-4 mr-2" />
              서비스 등록하기
            </button>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default WeddingServicesPage;
