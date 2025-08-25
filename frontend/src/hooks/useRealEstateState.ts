import { useState, useEffect } from 'react';
import { getRealEstates, registerRealEstate, toggleBookmark } from '../api/realEstate';
import type { RealEstateFormData } from '../types/realestate';

export interface MapCenter {
  lat: number;
  lng: number;
}

export const useRealEstateState = () => {
  const [realEstates, setRealEstates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<MapCenter>({ lat: 37.5665, lng: 126.9780 });
  const [selectedEstateId, setSelectedEstateId] = useState<number | null>(null);

  // 매물 목록 조회
  const fetchRealEstates = async () => {
    try {
      setLoading(true);
      const response = await getRealEstates();
      if (response.success && response.data) {
        setRealEstates(response.data);
        
        // 첫 번째 매물이 있으면 지도 중심을 그 위치로 설정
        if (response.data.length > 0 && response.data[0].latitude && response.data[0].longitude) {
          setMapCenter({
            lat: response.data[0].latitude,
            lng: response.data[0].longitude
          });
          setSelectedEstateId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('매물 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 매물 등록
  const handleRegisterEstate = async (data: RealEstateFormData, geocodeAddress: (address: string) => Promise<{ lat: number; lng: number } | null>) => {
    try {
      // 주소를 좌표로 변환
      const coordinatesResponse = await geocodeAddress(data.address);
      if (coordinatesResponse) {
        data.latitude = coordinatesResponse.lat;
        data.longitude = coordinatesResponse.lng;
      }
      
      // 매물 등록 API 호출
      const response = await registerRealEstate(data);
      
      if (response.success) {
        console.log('매물 등록 성공:', response.data);
        
        // 매물 목록 새로고침
        await fetchRealEstates();
        return true;
      }
      return false;
    } catch (error) {
      console.error('매물 등록 실패:', error);
      return false;
    }
  };

  // 북마크 토글
  const handleToggleBookmark = async (id: number) => {
    try {
      const response = await toggleBookmark(id);
      if (response.success) {
        // 로컬 상태 업데이트
        setRealEstates(prev => 
          prev.map(estate => 
            estate.id === id 
              ? { ...estate, isBookmarked: !estate.isBookmarked }
              : estate
          )
        );
      }
    } catch (error) {
      console.error('북마크 토글 실패:', error);
    }
  };

  // 매물 클릭 시 지도 이동
  const handleEstateClick = (estate: any) => {
    if (estate.latitude && estate.longitude) {
      setMapCenter({
        lat: estate.latitude,
        lng: estate.longitude
      });
      setSelectedEstateId(estate.id);
    }
  };

  // 컴포넌트 마운트 시 매물 목록 조회
  useEffect(() => {
    fetchRealEstates();
  }, []);

  return {
    // State
    realEstates,
    loading,
    mapCenter,
    selectedEstateId,
    
    // Actions
    fetchRealEstates,
    handleRegisterEstate,
    handleToggleBookmark,
    handleEstateClick,
    setMapCenter,
    setSelectedEstateId
  };
};
