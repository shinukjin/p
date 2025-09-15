import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import Select from 'react-select';
import type { ApartmentSearchParams, RegionCode } from '../../api/apartment';

interface ApartmentSearchFormProps {
  searchParams: ApartmentSearchParams;
  regionCodes: RegionCode[];
  loading: boolean;
  showAdvancedFilters: boolean;
  filters: {
    apartmentName: string;
    dong: string;
    minPrice: string;
    maxPrice: string;
    minArea: string;
    maxArea: string;
    minFloor: string;
    maxFloor: string;
    buildYear: string;
    dealDateFrom: string;
    dealDateTo: string;
  };
  onParamChange: (key: keyof ApartmentSearchParams, value: string | number) => void;
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  onToggleAdvancedFilters: () => void;
}

// React Select 옵션 타입
interface SelectOption {
  value: string;
  label: string;
}

const ApartmentSearchForm: React.FC<ApartmentSearchFormProps> = ({
  searchParams,
  regionCodes,
  loading,
  showAdvancedFilters,
  filters,
  onParamChange,
  onFilterChange,
  onSearch,
  onClearFilters,
  onToggleAdvancedFilters
}) => {
  const getCurrentYearMonth = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  };

  // React Select 옵션으로 변환
  const regionOptions: SelectOption[] = regionCodes.map(region => ({
    value: region.code,
    label: region.name
  }));

  // 현재 선택된 지역 옵션
  const selectedRegion = regionOptions.find(option => option.value === searchParams.lawdCd);

  // React Select 커스텀 스타일
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '40px',
      border: state.isFocused ? '1px solid #3b82f6' : '1px solid #d1d5db',
      borderRadius: '0.375rem',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        border: '1px solid #3b82f6'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af'
    })
  };

  return (
    <div className="card p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            지역
          </label>
          <Select
            value={selectedRegion}
            onChange={(option) => onParamChange('lawdCd', option?.value || '')}
            options={regionOptions}
            placeholder="지역을 검색하세요..."
            isSearchable={true}
            isClearable={true}
            styles={selectStyles}
            noOptionsMessage={() => "검색 결과가 없습니다"}
            loadingMessage={() => "로딩 중..."}
            className="text-sm"
          />
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
              onParamChange('dealYmd', value);
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
            onChange={(e) => onParamChange('numOfRows', parseInt(e.target.value))}
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
            onClick={onSearch}
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
        <div className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아파트명
              </label>
              <input
                type="text"
                value={filters.apartmentName}
                onChange={(e) => onFilterChange('apartmentName', e.target.value)}
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
                onChange={(e) => onFilterChange('dong', e.target.value)}
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
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
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
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
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
                onChange={(e) => onFilterChange('minArea', e.target.value)}
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
                onChange={(e) => onFilterChange('maxArea', e.target.value)}
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
                onChange={(e) => onFilterChange('minFloor', e.target.value)}
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
                onChange={(e) => onFilterChange('maxFloor', e.target.value)}
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
                onChange={(e) => onFilterChange('buildYear', e.target.value)}
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
                onChange={(e) => onFilterChange('dealDateFrom', e.target.value)}
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
                onChange={(e) => onFilterChange('dealDateTo', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentSearchForm;
