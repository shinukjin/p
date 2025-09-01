import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import RealEstateRegistrationModal from '../components/realestate/RealEstateRegistrationModal';
import RealEstateActionBar from '../components/realestate/RealEstateActionBar';
import RealEstateMapView from '../components/realestate/RealEstateMapView';
import RealEstateListView from '../components/realestate/RealEstateListView';
import RealEstateEmptyState from '../components/realestate/RealEstateEmptyState';
import { useRealEstateState } from '../hooks/useRealEstateState';
import { useRealEstateFilters } from '../hooks/useRealEstateFilters';
import { formatPrice } from '../utils/priceUtils';
import { geocodeAddress } from '../api/map';
import type { RealEstateFormData } from '../types/realestate';

interface RealEstatesPageProps {}

const RealEstatesPage = ({}: RealEstatesPageProps) => {
  const [showMap, setShowMap] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // 커스텀 훅으로 상태 관리
  const {
    realEstates,
    loading,
    mapCenter,
    selectedEstateId,
    handleRegisterEstate,
    handleToggleBookmark,
    handleEstateClick
  } = useRealEstateState();

  // 필터링 로직
  const {
    searchTerm,
    showFilters,
    selectedPropertyType,
    selectedTransactionType,
    filteredEstates,
    setSearchTerm,
    setShowFilters,
    setSelectedPropertyType,
    setSelectedTransactionType,
    clearFilters
  } = useRealEstateFilters(realEstates);

  // 매물 등록 핸들러
  const handleRegistrationSubmit = async (formData: FormData) => {
    try {
      console.log('📝 RealEstatesPage에서 FormData 수신:', formData);
      
      // FormData 내용 확인
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const success = await handleRegisterEstate(formData, geocodeAddress);
      if (success) {
        setIsRegistrationModalOpen(false);
      }
    } catch (error) {
      console.error('매물 등록 데이터 처리 실패:', error);
    }
  };

  // 지도/목록 토글
  const handleMapToggle = () => {
    setShowMap(!showMap);
  };

  // 새 매물 등록 모달 열기
  const handleRegistrationOpen = () => {
    setIsRegistrationModalOpen(true);
  };

  return (
    <MainLayout 
      title="부동산 관리"
      breadcrumbs={[{ name: '부동산' }]}
    >
      <div className="space-y-6">
        {/* 액션 바 */}
        <RealEstateActionBar
          showMap={showMap}
          searchTerm={searchTerm}
          showFilters={showFilters}
          selectedPropertyType={selectedPropertyType}
          selectedTransactionType={selectedTransactionType}
          onMapToggle={handleMapToggle}
          onRegistrationOpen={handleRegistrationOpen}
          onSearchChange={setSearchTerm}
          onFiltersToggle={() => setShowFilters(!showFilters)}
          onPropertyTypeChange={setSelectedPropertyType}
          onTransactionTypeChange={setSelectedTransactionType}
          onClearFilters={clearFilters}
        />

        {/* 컨텐츠 영역 */}
        <div className="min-h-[600px]">
      {showMap ? (
        /* 지도 뷰 */
            <RealEstateMapView
              filteredEstates={filteredEstates}
              mapCenter={mapCenter}
              selectedEstateId={selectedEstateId}
              realEstates={realEstates}
              onEstateClick={handleEstateClick}
              onBookmarkToggle={handleToggleBookmark}
              formatPrice={formatPrice}
            />
          ) : (
            /* 리스트 뷰 */
            <>
              <RealEstateListView
                filteredEstates={filteredEstates}
                onBookmarkToggle={handleToggleBookmark}
                formatPrice={formatPrice}
              />

              {/* 빈 상태 */}
              <RealEstateEmptyState
                loading={loading}
                hasEstates={!loading && filteredEstates.length === 0}
                onRegisterClick={handleRegistrationOpen}
              />
        </>
      )}
        </div>

        {/* 새 매물 등록 모달 */}
        <RealEstateRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          onSubmit={handleRegistrationSubmit}
        />
      </div>
    </MainLayout>
  );
};

export default RealEstatesPage;