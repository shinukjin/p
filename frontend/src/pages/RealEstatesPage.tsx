import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiMaximize,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiHeart,
  FiPhone,
  FiMap,
  FiTrendingUp,
  FiInfo
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { PropertyType, TransactionType, PropertyTypeLabels, TransactionTypeLabels } from '../types/wedding';
import { getRecentTrades, getRegionCodes, type ApartmentTrade, type RegionCode } from '../api/apartment';

// 임시 데이터
const mockRealEstates = [
  {
    id: 1,
    title: '신혼집 추천 아파트',
    propertyType: PropertyType.APARTMENT,
    transactionType: TransactionType.JEONSE,
    address: '서울시 강남구 역삼동 123-45',
    detailAddress: '래미안 강남 101동 1001호',
    latitude: 37.5665,
    longitude: 126.9780,
    price: 500000000,
    deposit: 50000000,
    area: 84.5,
    rooms: 3,
    bathrooms: 2,
    floor: 10,
    totalFloors: 25,
    buildingType: '아파트',
    buildYear: 2018,
    description: '신혼부부에게 적합한 깨끗한 아파트입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    facilities: ['지하철역 도보 5분', '대형마트 인근', '학군 우수'],
    transportation: '2호선 역삼역 도보 5분',
    isBookmarked: true,
    memo: '관리비 15만원, 즉시 입주 가능',
    contactInfo: '010-1234-5678 (공인중개사 김씨)'
  },
  {
    id: 2,
    title: '신축 오피스텔',
    propertyType: PropertyType.OFFICETEL,
    transactionType: TransactionType.MONTHLY_RENT,
    address: '서울시 서초구 서초동 567-89',
    latitude: 37.4833,
    longitude: 127.0322,
    price: 100000000,
    monthlyRent: 800000,
    area: 42.3,
    rooms: 1,
    bathrooms: 1,
    floor: 15,
    totalFloors: 30,
    buildingType: '오피스텔',
    buildYear: 2023,
    description: '신축 오피스텔로 모든 시설이 최신입니다.',
    imageUrl: 'https://via.placeholder.com/300x200',
    facilities: ['헬스장', '카페', '편의점'],
    transportation: '3호선 교대역 도보 3분',
    isBookmarked: false,
    memo: '',
    contactInfo: '010-2345-6789'
  }
];

const RealEstatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | ''>('');
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | ''>('');
  const [showMap, setShowMap] = useState(false);
  const [showRealTrades, setShowRealTrades] = useState(false);
  const [recentTrades, setRecentTrades] = useState<ApartmentTrade[]>([]);
  const [regionCodes, setRegionCodes] = useState<RegionCode[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('11680'); // 강남구 기본값
  const [loading, setLoading] = useState(false);

  const filteredEstates = mockRealEstates.filter(estate => {
    const matchesSearch = estate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estate.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPropertyType = !selectedPropertyType || estate.propertyType === selectedPropertyType;
    const matchesTransactionType = !selectedTransactionType || estate.transactionType === selectedTransactionType;
    return matchesSearch && matchesPropertyType && matchesTransactionType;
  });

  // 컴포넌트 마운트 시 지역코드 로드
  useEffect(() => {
    loadRegionCodes();
  }, []);

  // 선택된 지역이 변경될 때 실거래가 데이터 로드
  useEffect(() => {
    if (showRealTrades && selectedRegion) {
      loadRecentTrades();
    }
  }, [selectedRegion, showRealTrades]);

  const loadRegionCodes = async () => {
    try {
      const response = await getRegionCodes();
      if (response.success) {
        setRegionCodes(response.data);
      }
    } catch (error) {
      console.error('지역코드 로드 실패:', error);
    }
  };

  const loadRecentTrades = async () => {
    if (!selectedRegion) return;

    setLoading(true);
    try {
      const response = await getRecentTrades(selectedRegion);
      if (response.success) {
        setRecentTrades(response.data);
      }
    } catch (error) {
      console.error('실거래가 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id: number) => {
    console.log('Toggle bookmark for estate:', id);
  };

  const formatPrice = (estate: any) => {
    const { transactionType, price, monthlyRent, deposit } = estate;
    
    if (transactionType === TransactionType.SALE) {
      return `매매 ${(price / 100000000).toFixed(1)}억`;
    } else if (transactionType === TransactionType.JEONSE) {
      return `전세 ${(price / 100000000).toFixed(1)}억`;
    } else {
      return `월세 ${(deposit / 10000).toFixed(0)}만/${(monthlyRent / 10000).toFixed(0)}만`;
    }
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
              <FiMapPin className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">부동산 관리</h1>
            </div>
            
            <div className="flex space-x-3">
              <Link to="/apartment-trades">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center bg-green-100 text-green-700"
                >
                  <FiTrendingUp className="w-4 h-4 mr-2" />
                  실거래가 조회
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRealTrades(!showRealTrades)}
                className={`btn-secondary flex items-center ${showRealTrades ? 'bg-orange-100 text-orange-700' : ''}`}
              >
                <FiInfo className="w-4 h-4 mr-2" />
                {showRealTrades ? '미리보기 숨기기' : '미리보기'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMap(!showMap)}
                className={`btn-secondary flex items-center ${showMap ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                <FiMap className="w-4 h-4 mr-2" />
                {showMap ? '목록보기' : '지도보기'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                새 매물 등록
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 실거래가 정보 섹션 */}
        {showRealTrades && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiTrendingUp className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">아파트 매매 실거래가</h2>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="input text-sm"
                >
                  {regionCodes.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={loadRecentTrades}
                  disabled={loading}
                  className="btn-secondary text-sm"
                >
                  {loading ? '로딩중...' : '새로고침'}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">실거래가 정보를 불러오는 중...</p>
              </div>
            ) : recentTrades.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTrades.slice(0, 6).map((trade, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{trade.apartmentName}</h4>
                      <span className="text-xs text-gray-500">{trade.dealDate}</span>
                    </div>

                    <p className="text-xs text-gray-600 mb-2">{trade.dong} {trade.jibun}</p>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">거래금액:</span>
                        <span className="font-medium text-blue-600">{trade.dealAmount}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">면적:</span>
                        <span>{trade.exclusiveArea}㎡</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">층수:</span>
                        <span>{trade.floor}층</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">평당가격:</span>
                        <span className="font-medium text-green-600">{trade.pricePerPyeong}원/평</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiInfo className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">선택한 지역의 실거래가 정보가 없습니다.</p>
              </div>
            )}
          </motion.div>
        )}

        {showMap ? (
          /* 지도 뷰 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* 지도 영역 */}
            <div className="lg:col-span-2">
              <div className="card h-full p-6">
                <div className="bg-gray-100 h-full rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FiMap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">네이버 지도 API</h3>
                    <p className="text-gray-600 mb-4">
                      여기에 네이버 지도가 표시됩니다.<br />
                      등록된 매물들이 마커로 표시됩니다.
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>• 매물 위치 시각화</p>
                      <p>• 주변 편의시설 확인</p>
                      <p>• 교통 접근성 분석</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 매물 목록 (사이드바) */}
            <div className="space-y-4 overflow-y-auto">
              {filteredEstates.map((estate) => (
                <motion.div
                  key={estate.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{estate.title}</h4>
                    <button
                      onClick={() => toggleBookmark(estate.id)}
                      className={`p-1 rounded ${
                        estate.isBookmarked ? 'text-pink-500' : 'text-gray-400'
                      }`}
                    >
                      <FiHeart className={`w-4 h-4 ${estate.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{estate.address}</p>
                  <p className="text-sm font-medium text-blue-600 mb-2">{formatPrice(estate)}</p>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{estate.area}평</span>
                    <span>{estate.rooms}룸</span>
                    <span>{estate.floor}층</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* 목록 뷰 */
          <>
            {/* 검색 및 필터 */}
            <div className="card p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="매물명 또는 주소로 검색..."
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
                        매물 타입
                      </label>
                      <select
                        value={selectedPropertyType}
                        onChange={(e) => setSelectedPropertyType(e.target.value as PropertyType)}
                        className="input"
                      >
                        <option value="">전체</option>
                        {Object.values(PropertyType).map((type) => (
                          <option key={type} value={type}>
                            {PropertyTypeLabels[type]}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        거래 타입
                      </label>
                      <select
                        value={selectedTransactionType}
                        onChange={(e) => setSelectedTransactionType(e.target.value as TransactionType)}
                        className="input"
                      >
                        <option value="">전체</option>
                        {Object.values(TransactionType).map((type) => (
                          <option key={type} value={type}>
                            {TransactionTypeLabels[type]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 매물 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEstates.map((estate, index) => (
                <motion.div
                  key={estate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* 이미지 */}
                  <div className="relative">
                    <img
                      src={estate.imageUrl}
                      alt={estate.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleBookmark(estate.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        estate.isBookmarked 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-white text-gray-400 hover:text-pink-500'
                      } transition-colors`}
                    >
                      <FiHeart className={`w-4 h-4 ${estate.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* 거래 타입 배지 */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                      {TransactionTypeLabels[estate.transactionType]}
                    </div>
                  </div>

                  {/* 내용 */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{estate.title}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        {estate.address}
                      </div>
                      
                      <div className="flex items-center">
                        <FiDollarSign className="w-4 h-4 mr-2" />
                        {formatPrice(estate)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiMaximize className="w-4 h-4 mr-2" />
                          {estate.area}평
                        </div>
                        <div className="flex items-center">
                          <FiHome className="w-4 h-4 mr-2" />
                          {estate.rooms}룸 {estate.bathrooms}욕실
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        {estate.floor}층 / {estate.totalFloors}층, {estate.buildYear}년 건축
                      </div>
                    </div>

                    {/* 편의시설 */}
                    {estate.facilities && estate.facilities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {estate.facilities.slice(0, 3).map((facility, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {estate.memo && (
                      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-yellow-800">{estate.memo}</p>
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
                      {estate.contactInfo && (
                        <button className="btn-secondary p-2" title="연락처">
                          <FiPhone className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {filteredEstates.length === 0 && !showMap && (
          <div className="text-center py-12">
            <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 매물이 없습니다</h3>
            <p className="text-gray-600 mb-4">첫 번째 부동산 매물을 등록해보세요!</p>
            <button className="btn-primary">
              <FiPlus className="w-4 h-4 mr-2" />
              매물 등록하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RealEstatesPage;
