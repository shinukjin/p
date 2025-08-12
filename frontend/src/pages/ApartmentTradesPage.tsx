import React, { useState, useEffect } from 'react';
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
  FiExternalLink
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getApartmentTrades, getRegionCodes, type ApartmentTrade, type RegionCode, type ApartmentSearchParams } from '../api/apartment';
import { geocodeAddress, createPropertyMapUrl } from '../api/map';

const ApartmentTradesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<ApartmentSearchParams>({
    lawdCd: '11680', // 강남구 기본값
    dealYmd: new Date().toISOString().slice(0, 7).replace('-', ''), // 현재 년월
    numOfRows: 20,
    pageNo: 1
  });
  
  const [trades, setTrades] = useState<ApartmentTrade[]>([]);
  const [regionCodes, setRegionCodes] = useState<RegionCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [totalCount, setTotalCount] = useState(0);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    loadRegionCodes();
    loadTrades();
  }, []);

  // 검색 조건 변경 시 데이터 재로드
  useEffect(() => {
    if (searchParams.lawdCd && searchParams.dealYmd) {
      loadTrades();
    }
  }, [searchParams.lawdCd, searchParams.dealYmd, searchParams.numOfRows, searchParams.pageNo]);

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

  const loadTrades = async () => {
    setLoading(true);
    try {
      const response = await getApartmentTrades(searchParams);
      if (response.success) {
        setTrades(response.data);
        setTotalCount(response.data.length);
      }
    } catch (error) {
      console.error('실거래가 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, pageNo: 1 }));
    loadTrades();
  };

  const handleParamChange = (key: keyof ApartmentSearchParams, value: string | number) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
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
  const handleViewProperty = async (trade: ApartmentTrade) => {
    try {
      console.log('매물보기 클릭:', trade.apartmentName, trade.dong, trade.jibun);

      // 먼저 주소를 좌표로 변환 시도
      const fullAddress = `${trade.dong} ${trade.jibun}`;
      const response = await geocodeAddress(fullAddress);

      let mapUrl: string;

      if (response.success && response.data?.coordinates) {
        // 좌표 변환 성공 시 정확한 위치로 네이버 부동산 열기
        console.log('좌표 변환 성공:', response.data.coordinates);
        mapUrl = createPropertyMapUrl(
          trade.dong,
          trade.jibun,
          trade.apartmentName,
          response.data.coordinates
        );
      } else {
        // 좌표 변환 실패 시 아파트명으로 검색
        console.log('좌표 변환 실패, 검색으로 대체');
        mapUrl = createPropertyMapUrl(trade.dong, trade.jibun, trade.apartmentName);
      }

      console.log('네이버 부동산 URL:', mapUrl);

      // 새 탭으로 네이버 부동산 열기
      const newWindow = window.open(mapUrl, '_blank');

      // 팝업이 차단된 경우 사용자에게 알림
      if (!newWindow) {
        alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
      }

    } catch (error) {
      console.error('매물보기 실패:', error);

      // 오류 발생 시에도 기본 검색으로 열기
      const fallbackUrl = createPropertyMapUrl(trade.dong, trade.jibun, trade.apartmentName);
      console.log('오류 발생, 기본 URL로 대체:', fallbackUrl);

      const newWindow = window.open(fallbackUrl, '_blank');
      if (!newWindow) {
        alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/real-estates" className="text-gray-500 hover:text-gray-700 mr-4">
                ← 부동산 관리
              </Link>
              <FiTrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">아파트 매매 실거래가 조회</h1>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
                className={`btn-secondary flex items-center ${viewMode === 'chart' ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                {viewMode === 'table' ? <FiBarChart className="w-4 h-4 mr-2" /> : <FiList className="w-4 h-4 mr-2" />}
                {viewMode === 'table' ? '차트보기' : '목록보기'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                엑셀 다운로드
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 필터 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiFilter className="w-5 h-5 mr-2" />
              검색 조건
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showFilters ? '접기' : '펼치기'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="w-4 h-4 inline mr-1" />
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
                  <FiCalendar className="w-4 h-4 inline mr-1" />
                  거래년월
                </label>
                <input
                  type="month"
                  value={searchParams.dealYmd?.slice(0, 4) + '-' + searchParams.dealYmd?.slice(4, 6)}
                  onChange={(e) => handleParamChange('dealYmd', e.target.value.replace('-', ''))}
                  max={getCurrentYearMonth()}
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
                  <option value={300}>300건</option>
                  <option value={500}>500건</option>
                  <option value={1000}>1000건</option>
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
          )}
        </motion.div>

        {/* 결과 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 거래건수</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}건</p>
              </div>
              <FiHome className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">평균 거래가</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trades.length > 0 
                    ? formatPrice(
                        Math.round(
                          trades.reduce((sum, trade) => 
                            sum + parseInt(trade.dealAmount.replace(/[^0-9]/g, '')), 0
                          ) / trades.length
                        ).toString()
                      )
                    : '0'
                  }
                </p>
              </div>
              <FiTrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">최고 거래가</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trades.length > 0 
                    ? formatPrice(
                        Math.max(
                          ...trades.map(trade => parseInt(trade.dealAmount.replace(/[^0-9]/g, '')))
                        ).toString()
                      )
                    : '0'
                  }
                </p>
              </div>
              <FiBarChart className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">최저 거래가</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trades.length > 0 
                    ? formatPrice(
                        Math.min(
                          ...trades.map(trade => parseInt(trade.dealAmount.replace(/[^0-9]/g, '')))
                        ).toString()
                      )
                    : '0'
                  }
                </p>
              </div>
              <FiBarChart className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* 결과 표시 */}
        {viewMode === 'table' ? (
          /* 테이블 뷰 */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">거래 내역</h3>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">데이터를 불러오는 중...</p>
              </div>
            ) : trades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        아파트명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        위치
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        거래금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        면적
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        층수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        건축년도
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        거래일자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        평당가격
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        매물보기
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trades.map((trade, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trade.apartmentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trade.dong} {trade.jibun}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {formatPrice(trade.dealAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trade.exclusiveArea}㎡
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trade.floor}층
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trade.buildYear}년
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trade.dealDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatPrice(trade.pricePerPyeong)}/평
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewProperty(trade)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                            title="네이버 부동산에서 매물 보기"
                          >
                            <FiExternalLink className="w-3 h-3 mr-1" />
                            매물보기
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      </main>
    </div>
  );
};

export default ApartmentTradesPage;
