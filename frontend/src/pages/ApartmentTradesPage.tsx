import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getApartmentTrades, getRegionCodes, type ApartmentTrade, type RegionCode, type ApartmentSearchParams } from '../api/apartment';
import { geocodeAddress, createPropertyMapUrl, type Coordinates } from '../api/map';
import MainLayout from '../components/layout/MainLayout';
import ApartmentActionBar from '../components/apartment/ApartmentActionBar';
import ApartmentSearchForm from '../components/apartment/ApartmentSearchForm';
import ApartmentSortControls from '../components/apartment/ApartmentSortControls';
import ApartmentTable from '../components/apartment/ApartmentTable';
import ApartmentChartView from '../components/apartment/ApartmentChartView';

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
      
      // 지역코드와 실거래가 데이터를 동시에 로드하여 렌더링 최소화
      Promise.all([
        loadRegionCodes(),
        loadTradesWithParams(searchParams)
      ]);
    }
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

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
      {/* 액션 바 */}
      <ApartmentActionBar
        viewMode={viewMode}
        showAdvancedFilters={showAdvancedFilters}
        onViewModeChange={setViewMode}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        onClearFilters={clearFilters}
      />

      {/* 검색 폼 */}
      <ApartmentSearchForm
        searchParams={searchParams}
        regionCodes={regionCodes}
        loading={loading}
        showAdvancedFilters={showAdvancedFilters}
        filters={filters}
        onParamChange={handleParamChange}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearFilters={clearFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {/* 정렬 컨트롤 */}
      <ApartmentSortControls
        sortConfig={sortConfig}
        itemsPerPage={itemsPerPage}
        onSortChange={handleSortChange}
        onPageSizeChange={(newPageSize) => {
          setItemsPerPage(newPageSize);
              setCurrentPage(1);
            }}
      />

      {/* 결과 표시 */}
      {viewMode === 'table' ? (
        <ApartmentTable
          trades={filteredAndSortedTrades}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onViewProperty={handleViewProperty}
        />
      ) : (
        <ApartmentChartView />
      )}
    </MainLayout>
  );
};

export default ApartmentTradesPage;
