import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { PROPERTY_TYPE_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../../constants/realEstate';
import type { PropertyType, TransactionType } from '../../types/realestate';

interface RealEstateFiltersProps {
  searchTerm: string;
  showFilters: boolean;
  selectedPropertyType: PropertyType | '';
  selectedTransactionType: TransactionType | '';
  onSearchChange: (value: string) => void;
  onFiltersToggle: () => void;
  onPropertyTypeChange: (value: PropertyType | '') => void;
  onTransactionTypeChange: (value: TransactionType | '') => void;
  onClearFilters: () => void;
}

const RealEstateFilters = ({
  searchTerm,
  showFilters,
  selectedPropertyType,
  selectedTransactionType,
  onSearchChange,
  onFiltersToggle,
  onPropertyTypeChange,
  onTransactionTypeChange,
  onClearFilters
}: RealEstateFiltersProps) => {
  return (
    <>
      {/* 검색 입력 */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="매물명 또는 주소 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
        />
      </div>

      {/* 필터 버튼 */}
      <div className="relative">
        <button
          onClick={onFiltersToggle}
          className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
            showFilters || selectedPropertyType || selectedTransactionType
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FiFilter className="w-4 h-4 mr-2" />
          매물 필터
          {(selectedPropertyType || selectedTransactionType) && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              활성
            </span>
          )}
        </button>

        {/* 필터 드롭다운 */}
        {showFilters && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">매물 필터</h3>
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FiX className="w-3 h-3 mr-1" />
                초기화
              </button>
            </div>

            <div className="space-y-4">
              {/* 매물 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  매물 유형
                </label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => onPropertyTypeChange(e.target.value as PropertyType | '')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">전체</option>
                  {PROPERTY_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 거래 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거래 유형
                </label>
                <select
                  value={selectedTransactionType}
                  onChange={(e) => onTransactionTypeChange(e.target.value as TransactionType | '')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">전체</option>
                  {TRANSACTION_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RealEstateFilters;
