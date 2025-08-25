import React from 'react';
import RealEstateCard from './RealEstateCard';

interface RealEstateListViewProps {
  filteredEstates: any[];
  onBookmarkToggle: (id: number) => void;
  formatPrice: (estate: any) => string;
}

const RealEstateListView = ({
  filteredEstates,
  onBookmarkToggle,
  formatPrice
}: RealEstateListViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEstates.map((estate, index) => (
        <RealEstateCard
          key={estate.id}
          estate={estate}
          index={index}
          variant="full"
          onBookmarkToggle={onBookmarkToggle}
          formatPrice={formatPrice}
        />
      ))}
    </div>
  );
};

export default RealEstateListView;
