import { useState, useMemo } from 'react';
import { PropertyType, TransactionType } from '../types/realestate';

export const useRealEstateFilters = (realEstates: any[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | ''>('');
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | ''>('');

  const filteredEstates = useMemo(() => {
    return realEstates.filter(estate => {
      const matchesSearch = estate.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           estate.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPropertyType = !selectedPropertyType || estate.propertyType === selectedPropertyType;
      const matchesTransactionType = !selectedTransactionType || estate.transactionType === selectedTransactionType;
      
      return matchesSearch && matchesPropertyType && matchesTransactionType;
    });
  }, [realEstates, searchTerm, selectedPropertyType, selectedTransactionType]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPropertyType('');
    setSelectedTransactionType('');
  };

  return {
    // Filter State
    searchTerm,
    showFilters,
    selectedPropertyType,
    selectedTransactionType,
    
    // Filtered Data
    filteredEstates,
    
    // Filter Actions
    setSearchTerm,
    setShowFilters,
    setSelectedPropertyType,
    setSelectedTransactionType,
    clearFilters
  };
};
