import React from 'react';
import { FiMapPin, FiPlus } from 'react-icons/fi';
import AnimatedButton from '../common/AnimatedButton';

interface RealEstateEmptyStateProps {
  loading: boolean;
  hasEstates: boolean;
  onRegisterClick: () => void;
}

const RealEstateEmptyState = ({
  loading,
  hasEstates,
  onRegisterClick
}: RealEstateEmptyStateProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">매물 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (!hasEstates) {
    return (
      <div className="text-center py-12">
        <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 매물이 없습니다</h3>
        <p className="text-gray-600 mb-4">첫 번째 부동산 매물을 등록해보세요!</p>
        <AnimatedButton 
          className="btn-primary"
          onClick={onRegisterClick}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          매물 등록하기
        </AnimatedButton>
      </div>
    );
  }

  return null;
};

export default RealEstateEmptyState;
