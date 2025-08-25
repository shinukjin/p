import React from 'react';
import { FiMap, FiList, FiPlus } from 'react-icons/fi';
import AnimatedButton from '../common/AnimatedButton';
import RealEstateFilters from './RealEstateFilters';
import type { PropertyType, TransactionType } from '../../types/realestate';

interface RealEstateActionBarProps {
  showMap: boolean;
  searchTerm: string;
  showFilters: boolean;
  selectedPropertyType: PropertyType | '';
  selectedTransactionType: TransactionType | '';
  onMapToggle: () => void;
  onRegistrationOpen: () => void;
  onSearchChange: (value: string) => void;
  onFiltersToggle: () => void;
  onPropertyTypeChange: (value: PropertyType | '') => void;
  onTransactionTypeChange: (value: TransactionType | '') => void;
  onClearFilters: () => void;
}

const RealEstateActionBar = ({
  showMap,
  searchTerm,
  showFilters,
  selectedPropertyType,
  selectedTransactionType,
  onMapToggle,
  onRegistrationOpen,
  onSearchChange,
  onFiltersToggle,
  onPropertyTypeChange,
  onTransactionTypeChange,
  onClearFilters
}: RealEstateActionBarProps) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        {/* 지도/목록 토글 */}
        <AnimatedButton
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            showMap 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={onMapToggle}
        >
          {showMap ? (
            <>
              <FiList className="w-4 h-4 mr-2" />
              목록 보기
            </>
          ) : (
            <>
              <FiMap className="w-4 h-4 mr-2" />
              지도 보기
            </>
          )}
        </AnimatedButton>

        {/* 검색 및 필터 */}
        <RealEstateFilters
          searchTerm={searchTerm}
          showFilters={showFilters}
          selectedPropertyType={selectedPropertyType}
          selectedTransactionType={selectedTransactionType}
          onSearchChange={onSearchChange}
          onFiltersToggle={onFiltersToggle}
          onPropertyTypeChange={onPropertyTypeChange}
          onTransactionTypeChange={onTransactionTypeChange}
          onClearFilters={onClearFilters}
        />
      </div>

      {/* 새 매물 등록 버튼 */}
      <AnimatedButton
        className="btn-primary flex items-center"
        onClick={onRegistrationOpen}
      >
        <FiPlus className="w-4 h-4 mr-2" />
        새 매물
      </AnimatedButton>
    </div>
  );
};

export default RealEstateActionBar;
