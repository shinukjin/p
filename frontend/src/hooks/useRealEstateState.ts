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
          if (response.data[0].id) {
            setSelectedEstateId(response.data[0].id);
          }
        }
      }
    } catch (error) {
      console.error('매물 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 매물 등록
  const handleRegisterEstate = async (data: RealEstateFormData | FormData, geocodeAddress: (address: string) => Promise<{ lat: number; lng: number } | null>) => {
    try {
      let estateData: RealEstateFormData;
      
      if (data instanceof FormData) {
        // FormData에서 데이터 추출
        const dataJson = data.get('data') as string;
        const images = data.getAll('images') as File[];
        
        // JSON 데이터 파싱
        estateData = JSON.parse(dataJson);
        estateData.images = images;
      } else {
        // 기존 RealEstateFormData
        estateData = data;
      }
      
      // 주소를 좌표로 변환
      const coordinatesResponse = await geocodeAddress(estateData.address);
      if (coordinatesResponse) {
        estateData.latitude = coordinatesResponse.lat.toString();
        estateData.longitude = coordinatesResponse.lng.toString();
      }
      
      // FormData 생성하여 이미지와 데이터를 함께 전송
      const formData = new FormData();
      
      // 부동산 데이터를 JSON으로 변환하여 전송
      const { images, ...dataWithoutImages } = estateData;
      formData.append('data', JSON.stringify(dataWithoutImages));
      
      // 이미지 파일들 추가
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      }
      
      // 매물 등록 API 호출 (FormData 사용)
      const response = await registerRealEstate(formData);
      
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
