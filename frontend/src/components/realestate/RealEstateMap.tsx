import React, { useEffect, useRef, useState } from 'react';
import { useNaverMap } from '../../hooks/useNaverMap';
import { FiMapPin, FiHome, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { createCustomPinHTML } from '../map/CustomMapPin';
import RealEstateDetailModal from './RealEstateDetailModal';
import { TransactionType } from '../../types/realestate';
import { formatPrice } from '../../utils/priceUtils';

interface RealEstateMapProps {
  properties: Array<{
    id: number;
    title: string;
    address: string;
    latitude: number;
    longitude: number;
    price?: number;
    deposit?: number;
    monthlyRent?: number;
    propertyType: string;
    transactionType: string;
    [key: string]: any; // 추가 속성들을 위한 인덱스 시그니처
  }>;
  center?: { lat: number; lng: number };
  selectedPropertyId?: number | null;
  onPropertyClick?: (propertyId: number) => void;
  onBookmarkToggle?: (id: number) => void;
  className?: string;
}

const RealEstateMap = ({ 
  properties, 
  center,
  selectedPropertyId,
  onPropertyClick,
  onBookmarkToggle,
  className = ''
}: RealEstateMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 서울시청을 기본 중심점으로 설정
  const mapOptions = {
    center: { lat: 37.5665, lng: 126.9780 },
    zoom: 12,
    minZoom: 8,
    maxZoom: 21,
    mapTypeControl: true,
    zoomControl: true,
    scaleControl: true
  };

  const {
    mapInstance,
    isMapLoaded,
    addMarker,
    addInfoWindow,
    bindInfoWindowToMarker,
    clearMarkers,
    clearInfoWindows,
    panTo,
    setZoom
  } = useNaverMap('real-estate-map', mapOptions);

  // center prop이 변경될 때 지도 중심 이동
  useEffect(() => {
    if (!isMapLoaded || !mapInstance || !center) return;
    
    panTo(center.lat, center.lng);
  }, [isMapLoaded, mapInstance, center, panTo]);

  // 부동산 정보를 지도에 마커로 표시
  useEffect(() => {
    if (!isMapLoaded || !mapInstance) return;

    // 기존 마커와 정보창 제거
    clearMarkers();
    clearInfoWindows();

    // 각 부동산에 마커 추가
    properties.forEach(property => {
      if (property.latitude && property.longitude) {
        const isSelected = selectedPropertyId === property.id;
        const priceText = formatPrice(property);
        
        
        // 커스텀 핀 HTML 생성
        const customPinHTML = createCustomPinHTML(
          property.transactionType as TransactionType,
          isSelected,
          isSelected ? priceText : ''
        );
        
        // 마커 추가
        const marker = addMarker({
          position: { lat: property.latitude, lng: property.longitude },
          title: property.title,
          clickable: true,
          icon: {
            content: customPinHTML,
            anchor: { x: 20, y: 50 } // 핀의 끝점을 좌표에 맞춤
          }
        });

        if (marker) {
          // 정보창 생성
          const infoContent = `
            <div style="padding: 15px; min-width: 250px;">
              <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
                ${property.title}
              </h4>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                <strong>주소:</strong> ${property.address}
              </p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                <strong>유형:</strong> ${property.propertyType}
              </p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                <strong>거래:</strong> ${property.transactionTypeLabel || property.transactionType}
              </p>
              ${property.price ? `<p style="margin: 5px 0; color: #e74c3c; font-size: 14px; font-weight: bold;">
                <strong>매매가:</strong> ${property.price.toLocaleString()}만원
              </p>` : ''}
              ${property.deposit ? `<p style="margin: 5px 0; color: #3498db; font-size: 14px;">
                <strong>보증금:</strong> ${property.deposit.toLocaleString()}만원
              </p>` : ''}
              ${property.monthlyRent ? `<p style="margin: 5px 0; color: #27ae60; font-size: 14px;">
                <strong>월세:</strong> ${property.monthlyRent.toLocaleString()}만원
              </p>` : ''}
            </div>
          `;

          const infoWindow = addInfoWindow({
            content: infoContent,
            maxWidth: 300,
            backgroundColor: '#fff',
            borderColor: '#5CA5FC',
            anchorColor: '#5CA5FC'
          });

          if (infoWindow) {
            // 마커에 정보창 연결
            bindInfoWindowToMarker(marker, infoWindow);

            // 마커 클릭 이벤트
            const { naver } = window;
            naver.maps.Event.addListener(marker, 'click', () => {
              // 상세정보 모달 열기
              setSelectedEstate(property);
              setIsDetailModalOpen(true);
              
              // 부모 컴포넌트에 알림 (지도 중심 이동용)
              if (onPropertyClick) {
                onPropertyClick(property.id);
              }
            });
          }
        }
      }
    });
  }, [isMapLoaded, mapInstance, properties, selectedPropertyId, addMarker, addInfoWindow, bindInfoWindowToMarker, clearMarkers, clearInfoWindows, onPropertyClick]);

  // 전체화면 토글
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.refresh();
      }
    }, 100);
  };

  // 지도 컨트롤
  const handleZoomIn = () => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom();
      setZoom(Math.min(currentZoom + 1, 21));
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom();
      setZoom(Math.max(currentZoom - 1, 8));
    }
  };

  const handleResetView = () => {
    if (mapInstance) {
      panTo(37.5665, 126.9780); // 서울시청으로 이동
      setZoom(12);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 지도 컨트롤 버튼들 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="확대"
        >
          <FiMaximize2 className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="축소"
        >
          <FiMinimize2 className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={handleResetView}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="초기화"
        >
          <FiHome className="w-4 h-4 text-gray-700" />
        </button>
        {/* <button
          onClick={toggleFullscreen}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title={isFullscreen ? "전체화면 해제" : "전체화면"}
        >
          {isFullscreen ? (
            <FiMinimize2 className="w-4 h-4 text-gray-700" />
          ) : (
            <FiMaximize2 className="w-4 h-4 text-gray-700" />
          )}
        </button> */}
      </div>

      {/* 지도 컨테이너 */}
      <div
        id="real-estate-map"
        ref={mapContainerRef}
        className={`w-full h-full bg-gray-100 rounded-lg overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-0 z-50' 
            : 'h-98'
        }`}
        style={{ minHeight: isFullscreen ? '100vh' : '24rem' }}
      >
        {!isMapLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">지도를 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* 전체화면일 때 닫기 버튼 */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          <FiMinimize2 className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* 부동산 개수 표시 */}
      <div className="absolute bottom-5 left-1 z-10 bg-white px-3 py-2 rounded-lg shadow-lg">
        <p className="text-sm text-gray-700">
          <FiMapPin className="inline w-4 h-4 mr-1" />
          총 {properties.length}개의 부동산
        </p>
      </div>

      {/* 상세정보 모달 */}
      <RealEstateDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        estate={selectedEstate}
        onBookmarkToggle={onBookmarkToggle || (() => {})}
      />
    </div>
  );
};

export default RealEstateMap;
