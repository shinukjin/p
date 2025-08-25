import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiBarChart,
  FiList,
  FiCalendar,
  FiMapPin,
  FiHome,
  FiExternalLink,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getApartmentTrades, getRegionCodes, type ApartmentTrade, type RegionCode, type ApartmentSearchParams } from '../api/apartment';
import { geocodeAddress, createPropertyMapUrl, type Coordinates } from '../api/map';
import MainLayout from '../components/layout/MainLayout';

const ApartmentTradesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<ApartmentSearchParams>(() => ({
    lawdCd: '41171', // 안양 만안구
    dealYmd: new Date().toISOString().slice(0, 7).replace('-', ''), // 현재 년월
    numOfRows: 100, // 필터링을 위해 충분한 데이터 조회
    pageNo: 1
  }));
  
  const [trades, setTrades] = useState<ApartmentTrade[]>([]);
  const [regionCodes, setRegionCodes] = useState<RegionCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  
  // 클라이언트 사이드 필터링/정렬 상태
  const [filters, setFilters] = useState(() => ({
    apartmentName: '',
    dong: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    minFloor: '',
    maxFloor: '',
    buildYear: '',
    dealDateFrom: '',
    dealDateTo: ''
  }));
  
  const [sortConfig, setSortConfig] = useState(() => ({
    sortBy: 'dealDate',
    sortOrder: 'desc'
  }));
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      
      // 초기 로드 시 하드코딩된 값 사용 (searchParams 참조 제거)
      // const initialParams = {
      //   lawdCd: '11680', // 강남구 기본값
      //   dealYmd: new Date().toISOString().slice(0, 7).replace('-', ''), // 현재 년월
      //   numOfRows: 1000,
      //   pageNo: 1
      // };
      
      // 지역코드와 실거래가 데이터를 동시에 로드하여 렌더링 최소화
      Promise.all([
        loadRegionCodes(),
        loadTradesWithParams(searchParams)
      ]);
    }
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  // 검색 조건 변경 시 데이터 재로드 제거 - 수동 검색만 허용

  const loadRegionCodes = async () => {
    try {
      const response = await getRegionCodes();
      if (response.success && response.data) {
        setRegionCodes(response.data);
      }
    } catch (error) {
      console.error('지역코드 로드 실패:', error);
    }
  };

  const loadTradesWithParams = async (params: ApartmentSearchParams) => {
    setLoading(true);
    try {
      const response = await getApartmentTrades(params);
      if (response.success && response.data) {
        setTrades(response.data);
      }
    } catch (error) {
      console.error('실거래가 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 클라이언트 사이드 필터링 및 정렬
  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades.filter(trade => {
      // 아파트명 필터링
      if (filters.apartmentName && !trade.apartmentName.toLowerCase().includes(filters.apartmentName.toLowerCase())) {
        return false;
      }
      
      // 동 필터링
      if (filters.dong && !trade.dong.toLowerCase().includes(filters.dong.toLowerCase())) {
        return false;
      }
      
      // 거래금액 필터링
      if (filters.minPrice || filters.maxPrice) {
        const price = parseInt(trade.dealAmount.replace(/[^0-9]/g, ''));
        if (filters.minPrice && price < parseInt(filters.minPrice)) return false;
        if (filters.maxPrice && price > parseInt(filters.maxPrice)) return false;
      }
      
      // 전용면적 필터링
      if (filters.minArea || filters.maxArea) {
        const area = parseFloat(trade.exclusiveArea);
        if (filters.minArea && area < parseFloat(filters.minArea)) return false;
        if (filters.maxArea && area > parseFloat(filters.maxArea)) return false;
      }
      
      // 층수 필터링
      if (filters.minFloor || filters.maxFloor) {
        const floor = parseInt(trade.floor);
        if (filters.minFloor && floor < parseInt(filters.minFloor)) return false;
        if (filters.maxFloor && floor > parseInt(filters.maxFloor)) return false;
      }
      
      // 건축년도 필터링
      if (filters.buildYear && trade.buildYear !== filters.buildYear) {
        return false;
      }
      
      // 거래일자 필터링
      if (filters.dealDateFrom || filters.dealDateTo) {
        const dealDate = trade.dealDate;
        if (filters.dealDateFrom && dealDate < filters.dealDateFrom) return false;
        if (filters.dealDateTo && dealDate > filters.dealDateTo) return false;
      }
      
      return true;
    });
    
    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortConfig.sortBy) {
        case 'dealAmount':
          aValue = parseInt(a.dealAmount.replace(/[^0-9]/g, ''));
          bValue = parseInt(b.dealAmount.replace(/[^0-9]/g, ''));
          break;
        case 'exclusiveArea':
          aValue = parseFloat(a.exclusiveArea);
          bValue = parseFloat(b.exclusiveArea);
          break;
        case 'floor':
          aValue = parseInt(a.floor);
          bValue = parseInt(b.floor);
          break;
        case 'buildYear':
          aValue = parseInt(a.buildYear);
          bValue = parseInt(b.buildYear);
          break;
        default: // dealDate
          aValue = a.dealDate;
          bValue = b.dealDate;
      }
      
      if (sortConfig.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [trades, filters, sortConfig]);

  // 페이징 적용
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedTrades.slice(startIndex, endIndex);
  }, [filteredAndSortedTrades, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTrades.length / itemsPerPage);

  const handleSearch = () => {
    setCurrentPage(1);
    // searchParams를 직접 전달하여 API 호출
    loadTradesWithParams(searchParams);
  };

  const handleParamChange = (key: keyof ApartmentSearchParams, value: string | number) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    setSortConfig(prev => ({
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilters({
      apartmentName: '',
      dong: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      minFloor: '',
      maxFloor: '',
      buildYear: '',
      dealDateFrom: '',
      dealDateTo: ''
    });
    setCurrentPage(1);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''));
    if (numPrice >= 100000000) {
      return `${(numPrice / 100000000).toFixed(1)}억`;
    } else if (numPrice >= 10000) {
      return `${(numPrice / 10000).toFixed(0)}만`;
    }
    return price;
  };

  const getCurrentYearMonth = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  };

  // 매물보기 버튼 클릭 핸들러 - 네이버 부동산 새 탭으로 열기
  const handleViewProperty = async (trade: ApartmentTrade, type: 'A1' | 'B1') => {
    try {
      console.log('매물보기 클릭:', trade.apartmentName, trade.dong, trade.jibun, type);

      // 먼저 주소를 좌표로 변환 시도
      const fullAddress = `${trade.dong} ${trade.jibun}`;
      const coords = await geocodeAddress(fullAddress);

      let mapUrl: string='';

      if (coords) {
        // 좌표 변환 성공 시 좌표 기반으로 열기
        mapUrl = createPropertyMapUrl(coords as Coordinates, type);
      } 

      // 새 탭으로 네이버 부동산 열기
      const newWindow = window.open(mapUrl, '_blank');

      // 팝업이 차단된 경우 사용자에게 알림
      if (!newWindow) {
        alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
      }

    } catch (error) {
      console.error('매물보기 실패:', error);
    }
  };

  return (
    <MainLayout 
      title="아파트 매매 실거래가 조회"
      breadcrumbs={[{ name: '부동산', path: '/real-estates' }, { name: '실거래가' }]}
    >
      {/* 상단 액션 버튼들 */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-3">
          <Link to="/real-estates">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center bg-blue-100 text-blue-700"
            >
              <FiMapPin className="w-4 h-4 mr-2" />
              부동산 관리로
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
            className="btn-secondary flex items-center"
          >
            {viewMode === 'table' ? (
              <>
                <FiBarChart className="w-4 h-4 mr-2" />
                차트보기
              </>
            ) : (
              <>
                <FiList className="w-4 h-4 mr-2" />
                목록보기
              </>
            )}
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`btn-secondary flex items-center ${showAdvancedFilters ? 'bg-orange-100 text-orange-700' : ''}`}
          >
            <FiFilter className="w-4 h-4 mr-2" />
            {showAdvancedFilters ? '고급검색 숨기기' : '고급검색'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="btn-secondary flex items-center bg-gray-100 text-gray-700"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            필터 초기화
          </motion.button>
        </div>
      </div>

      {/* 검색 조건 */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지역
            </label>
            <select
              value={searchParams.lawdCd}
              onChange={(e) => handleParamChange('lawdCd', e.target.value)}
              className="input"
            >
              {regionCodes.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거래년월
            </label>
            <input
              type="month"
              value={searchParams.dealYmd ? `${searchParams.dealYmd.toString().slice(0, 4)}-${searchParams.dealYmd.toString().slice(4, 6)}` : getCurrentYearMonth()}
              onChange={(e) => {
                const value = e.target.value.replace('-', '');
                handleParamChange('dealYmd', value);
              }}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              조회 건수
            </label>
            <select
              value={searchParams.numOfRows}
              onChange={(e) => handleParamChange('numOfRows', parseInt(e.target.value))}
              className="input"
            >
              <option value={10}>10건</option>
              <option value={20}>20건</option>
              <option value={50}>50건</option>
              <option value={100}>100건</option>
            </select>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FiSearch className="w-4 h-4 mr-2" />
              )}
              {loading ? '조회중...' : '조회하기'}
            </motion.button>
          </div>
        </div>

        {/* 고급 검색 조건 */}
        {showAdvancedFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아파트명
                </label>
                <input
                  type="text"
                  value={filters.apartmentName}
                  onChange={(e) => handleFilterChange('apartmentName', e.target.value)}
                  placeholder="아파트명 입력"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  동
                </label>
                <input
                  type="text"
                  value={filters.dong}
                  onChange={(e) => handleFilterChange('dong', e.target.value)}
                  placeholder="동 입력"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 거래금액 (만원)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="최소 금액"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 거래금액 (만원)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="최대 금액"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 면적 (㎡)
                </label>
                <input
                  type="number"
                  value={filters.minArea}
                  onChange={(e) => handleFilterChange('minArea', e.target.value)}
                  placeholder="최소 면적"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 면적 (㎡)
                </label>
                <input
                  type="number"
                  value={filters.maxArea}
                  onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                  placeholder="최대 면적"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 층
                </label>
                <input
                  type="number"
                  value={filters.minFloor}
                  onChange={(e) => handleFilterChange('minFloor', e.target.value)}
                  placeholder="최소 층"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 층
                </label>
                <input
                  type="number"
                  value={filters.maxFloor}
                  onChange={(e) => handleFilterChange('maxFloor', e.target.value)}
                  placeholder="최대 층"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건축년도
                </label>
                <input
                  type="number"
                  value={filters.buildYear}
                  onChange={(e) => handleFilterChange('buildYear', e.target.value)}
                  placeholder="건축년도"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거래일자 시작
                </label>
                <input
                  type="date"
                  value={filters.dealDateFrom}
                  onChange={(e) => handleFilterChange('dealDateFrom', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거래일자 종료
                </label>
                <input
                  type="date"
                  value={filters.dealDateTo}
                  onChange={(e) => handleFilterChange('dealDateTo', e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 정렬 및 페이지 크기 설정 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">정렬:</span>
            <button
              onClick={() => handleSortChange('dealDate')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortConfig.sortBy === 'dealDate'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              거래일자
              {sortConfig.sortBy === 'dealDate' && (
                sortConfig.sortOrder === 'asc' ? <FiArrowUp className="inline ml-1 w-3 h-3" /> : <FiArrowDown className="inline ml-1 w-3 h-3" />
              )}
            </button>
            <button
              onClick={() => handleSortChange('dealAmount')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortConfig.sortBy === 'dealAmount'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              거래금액
              {sortConfig.sortBy === 'dealAmount' && (
                sortConfig.sortOrder === 'asc' ? <FiArrowUp className="inline ml-1 w-3 h-3" /> : <FiArrowDown className="inline ml-1 w-3 h-3" />
              )}
            </button>
            <button
              onClick={() => handleSortChange('exclusiveArea')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortConfig.sortBy === 'exclusiveArea'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              면적
              {sortConfig.sortBy === 'exclusiveArea' && (
                sortConfig.sortOrder === 'asc' ? <FiArrowUp className="inline ml-1 w-3 h-3" /> : <FiArrowDown className="inline ml-1 w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">페이지당:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="input text-sm w-20"
          >
            <option value={10}>10건</option>
            <option value={20}>20건</option>
            <option value={50}>50건</option>
            <option value={100}>100건</option>
          </select>
        </div>
      </div>

      {/* 결과 표시 */}
      {viewMode === 'table' ? (
        /* 테이블 뷰 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card overflow-hidden"
        >
          {filteredAndSortedTrades.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        아파트명
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        동/지번
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        거래금액
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        거래일자
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        면적(㎡)
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        층수
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        건축년도
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        평당가격
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        매물보기
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTrades.map((trade, index) => (
                      <motion.tr
                        key={index + 1}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {trade.apartmentName}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {trade.dong} {trade.jibun}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-600">
                            {formatPrice(trade.dealAmount)}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {trade.dealDate}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {trade.exclusiveArea}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {trade.floor}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {trade.buildYear}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            {trade.pricePerPyeong ? formatPrice(trade.pricePerPyeong) + '/평' : '-'}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <div className="flex space-x-1 justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewProperty(trade, 'A1')}
                              className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                              title="네이버 부동산에서 매매 매물 보기"
                            >
                              <FiExternalLink className="w-3 h-3 mr-1" />
                              매매
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewProperty(trade, 'B1')}
                              className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                              title="네이버 부동산에서 전세 매물 보기"
                            >
                              <FiExternalLink className="w-3 h-3 mr-1" />
                              전세
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 페이징 */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      총 {filteredAndSortedTrades.length}건 중 {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, filteredAndSortedTrades.length)}건
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        처음
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        이전
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        마지막
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FiTrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">조회 결과가 없습니다</h3>
              <p className="text-gray-600">다른 조건으로 검색해보세요.</p>
            </div>
          )}
        </motion.div>
      ) : (
        /* 차트 뷰 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">가격 분포 차트</h3>
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FiBarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">차트 기능은 추후 구현 예정입니다.</p>
              <p className="text-sm text-gray-500 mt-2">Chart.js 또는 Recharts 라이브러리를 활용할 예정</p>
            </div>
          </div>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default ApartmentTradesPage;
