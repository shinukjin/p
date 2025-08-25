import React from 'react';
import RealEstateMap from './RealEstateMap';
import RealEstateCard from './RealEstateCard';
import { PropertyTypeLabels, TransactionTypeLabels } from '../../constants/realEstate';
import { PropertyType, TransactionType } from '../../types/realestate';
import type { MapCenter } from '../../hooks/useRealEstateState';

interface RealEstateMapViewProps {
  filteredEstates: any[];
  mapCenter: MapCenter;
  selectedEstateId: number | null;
  realEstates: any[];
  onEstateClick: (estate: any) => void;
  onBookmarkToggle: (id: number) => void;
  formatPrice: (estate: any) => string;
}

const RealEstateMapView = ({
  filteredEstates,
  mapCenter,
  selectedEstateId,
  realEstates,
  onEstateClick,
  onBookmarkToggle,
  formatPrice
}: RealEstateMapViewProps) => {
  const mapComponent = (
    <RealEstateMap 
      properties={filteredEstates.length > 0 ? filteredEstates.map(estate => ({
        id: estate.id,
        title: estate.title,
        address: estate.address,
        latitude: estate.latitude,
        longitude: estate.longitude,
        price: estate.price,
        deposit: estate.deposit,
        monthlyRent: estate.monthlyRent,
        propertyType: PropertyTypeLabels[estate.propertyType as PropertyType],
        transactionType: estate.transactionType, // enum 값 그대로 전달
        transactionTypeLabel: TransactionTypeLabels[estate.transactionType as TransactionType], // 라벨은 별도로 전달
        // 전체 estate 객체도 전달 (상세 모달용)
        ...estate
      })) : []}
      center={mapCenter}
      selectedPropertyId={selectedEstateId}
      onPropertyClick={(propertyId) => {
        const selectedEstate = realEstates.find(estate => estate.id === propertyId);
        if (selectedEstate) {
          onEstateClick(selectedEstate);
        }
      }}
      onBookmarkToggle={onBookmarkToggle}
      className="w-full h-full"
    />
  );

  return (
    <div className="flex h-full space-x-6">
      {/* 지도 영역 */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
          <div className="h-full">
            {mapComponent}
          </div>
        </div>
      </div>

      {/* 매물 목록 (사이드바) */}
      <div className="w-80 space-y-4 overflow-y-auto">
        {filteredEstates.map((estate) => (
          <div 
            key={estate.id}
            onClick={() => onEstateClick(estate)}
            className={`cursor-pointer transition-all duration-200 ${
              selectedEstateId === estate.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
          >
            <RealEstateCard
              estate={estate}
              variant="compact"
              onBookmarkToggle={onBookmarkToggle}
              formatPrice={formatPrice}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealEstateMapView;
