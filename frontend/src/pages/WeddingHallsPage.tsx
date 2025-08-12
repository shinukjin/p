import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHeart, 
  FiMapPin, 
  FiPhone, 
  FiGlobe, 
  FiUsers, 
  FiDollarSign,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiStar
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

// 임시 데이터
const mockWeddingHalls = [
  {
    id: 1,
    name: '그랜드 웨딩홀',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    website: 'https://grandwedding.com',
    pricePerTable: 150000,
    capacity: 300,
    hallType: '호텔',
    description: '럭셔리한 분위기의 호텔 웨딩홀입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.5,
    parkingInfo: '지하주차장 200대',
    isBookmarked: true,
    memo: '가격 협상 가능, 주차 편리'
  },
  {
    id: 2,
    name: '로맨틱 가든홀',
    address: '서울시 서초구 반포대로 456',
    phone: '02-2345-6789',
    pricePerTable: 120000,
    capacity: 200,
    hallType: '하우스웨딩',
    description: '자연 친화적인 가든 웨딩홀입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.2,
    parkingInfo: '야외주차장 50대',
    isBookmarked: false,
    memo: ''
  }
];

const WeddingHallsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHallType, setSelectedHallType] = useState('');

  const filteredHalls = mockWeddingHalls.filter(hall => {
    const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedHallType || hall.hallType === selectedHallType;
    return matchesSearch && matchesType;
  });

  const toggleBookmark = (id: number) => {
    // TODO: API 호출로 북마크 상태 변경
    console.log('Toggle bookmark for hall:', id);
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
              <FiHeart className="w-8 h-8 text-pink-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">결혼식장 관리</h1>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              새 식장 등록
            </motion.button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 및 필터 */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="식장명 또는 주소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              필터
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    홀 타입
                  </label>
                  <select
                    value={selectedHallType}
                    onChange={(e) => setSelectedHallType(e.target.value)}
                    className="input"
                  >
                    <option value="">전체</option>
                    <option value="호텔">호텔</option>
                    <option value="컨벤션">컨벤션</option>
                    <option value="하우스웨딩">하우스웨딩</option>
                    <option value="레스토랑">레스토랑</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 식장 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHalls.map((hall, index) => (
            <motion.div
              key={hall.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* 이미지 */}
              <div className="relative">
                <img
                  src={hall.imageUrl}
                  alt={hall.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleBookmark(hall.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    hall.isBookmarked 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white text-gray-400 hover:text-pink-500'
                  } transition-colors`}
                >
                  <FiHeart className={`w-4 h-4 ${hall.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* 내용 */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{hall.name}</h3>
                  {hall.rating && (
                    <div className="flex items-center text-yellow-500">
                      <FiStar className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">{hall.rating}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {hall.address}
                  </div>
                  
                  {hall.phone && (
                    <div className="flex items-center">
                      <FiPhone className="w-4 h-4 mr-2" />
                      {hall.phone}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-2" />
                      {hall.capacity}명
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      {hall.pricePerTable?.toLocaleString()}원/테이블
                    </div>
                  </div>
                </div>

                {hall.memo && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-yellow-800">{hall.memo}</p>
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
                  {hall.website && (
                    <a
                      href={hall.website}
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

        {filteredHalls.length === 0 && (
          <div className="text-center py-12">
            <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 식장이 없습니다</h3>
            <p className="text-gray-600 mb-4">첫 번째 결혼식장을 등록해보세요!</p>
            <button className="btn-primary">
              <FiPlus className="w-4 h-4 mr-2" />
              식장 등록하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WeddingHallsPage;
