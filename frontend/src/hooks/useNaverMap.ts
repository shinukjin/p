import { useEffect, useRef, useState, useCallback } from 'react';

// 네이버 지도 타입 정의
declare global {
  interface Window {
    naver: {
      maps: {
        Map: any;
        LatLng: any;
        Marker: any;
        InfoWindow: any;
        Point: any;
        Size: any;
        MapTypeId: any;
        ZoomControl: any;
        MapTypeControl: any;
        ScaleControl: any;
        MapTypeControlStyle: any;
        ZoomControlStyle: any;
        ScaleControlStyle: any;
        Event: any;
        Position: any;
      };
    };
  }
}

interface MapOptions {
  center: { lat: number; lng: number };
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  mapTypeId?: string;
  mapTypeControl?: boolean;
  zoomControl?: boolean;
  scaleControl?: boolean;
}

interface MarkerOptions {
  position: { lat: number; lng: number };
  title?: string;
  icon?: string;
  clickable?: boolean;
}

interface InfoWindowOptions {
  content: string;
  maxWidth?: number;
  backgroundColor?: string;
  borderColor?: string;
  anchorColor?: string;
  anchorSize?: { width: number; height: number };
  pixelOffset?: { x: number; y: number };
}

export const useNaverMap = (mapId: string, options: MapOptions) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const initializedRef = useRef(false);

  // 네이버 지도 API 로드 확인
  const isNaverMapsLoaded = useCallback(() => {
    return typeof window !== 'undefined' && window.naver && window.naver.maps;
  }, []);

  // 지도 초기화
  const initializeMap = useCallback(() => {
    if (!isNaverMapsLoaded() || initializedRef.current) {
      return null;
    }

    try {
      const { naver } = window;
      const center = new naver.maps.LatLng(options.center.lat, options.center.lng);
      
      const mapOptions = {
        center,
        zoom: options.zoom || 15,
        minZoom: options.minZoom || 6,
        maxZoom: options.maxZoom || 21,
        mapTypeId: options.mapTypeId || naver.maps.MapTypeId.NORMAL,
      };

      const map = new naver.maps.Map(mapId, mapOptions);
      mapRef.current = map;
      setMapInstance(map);
      setIsMapLoaded(true);
      initializedRef.current = true;

      return map;
    } catch (error) {
      console.error('지도 초기화 실패:', error);
      return null;
    }
  }, [mapId, options.center.lat, options.center.lng, options.zoom, options.minZoom, options.maxZoom, isNaverMapsLoaded]);

  // 마커 추가
  const addMarker = useCallback((markerOptions: MarkerOptions) => {
    if (!mapInstance || !isNaverMapsLoaded()) return null;

    try {
      const { naver } = window;
      const position = new naver.maps.LatLng(markerOptions.position.lat, markerOptions.position.lng);
      
      const marker = new naver.maps.Marker({
        position,
        map: mapInstance,
        title: markerOptions.title || '',
        icon: markerOptions.icon || undefined,
        clickable: markerOptions.clickable !== false
      });

      markersRef.current.push(marker);
      return marker;
    } catch (error) {
      console.error('마커 추가 실패:', error);
      return null;
    }
  }, [mapInstance, isNaverMapsLoaded]);

  // 정보창 추가
  const addInfoWindow = useCallback((infoWindowOptions: InfoWindowOptions) => {
    if (!mapInstance || !isNaverMapsLoaded()) return null;

    try {
      const { naver } = window;
      
      const infoWindow = new naver.maps.InfoWindow({
        content: infoWindowOptions.content,
        maxWidth: infoWindowOptions.maxWidth || 300,
        backgroundColor: infoWindowOptions.backgroundColor || '#fff',
        borderColor: infoWindowOptions.borderColor || '#5CA5FC',
        anchorColor: infoWindowOptions.anchorColor || '#5CA5FC',
        anchorSize: infoWindowOptions.anchorSize || new naver.maps.Size(20, 20),
        pixelOffset: infoWindowOptions.pixelOffset || new naver.maps.Point(0, -20)
      });

      infoWindowsRef.current.push(infoWindow);
      return infoWindow;
    } catch (error) {
      console.error('정보창 추가 실패:', error);
      return null;
    }
  }, [mapInstance, isNaverMapsLoaded]);

  // 마커에 정보창 연결
  const bindInfoWindowToMarker = useCallback((marker: any, infoWindow: any) => {
    if (!marker || !infoWindow) return;

    const { naver } = window;
    naver.maps.Event.addListener(marker, 'click', () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(mapInstance, marker);
      }
    });
  }, [mapInstance]);

  // 지도 중심 이동
  const panTo = useCallback((lat: number, lng: number) => {
    if (!mapInstance) return;

    try {
      const { naver } = window;
      const position = new naver.maps.LatLng(lat, lng);
      mapInstance.panTo(position);
    } catch (error) {
      console.error('지도 이동 실패:', error);
    }
  }, [mapInstance]);

  // 지도 줌 변경
  const setZoom = useCallback((zoom: number) => {
    if (!mapInstance) return;

    try {
      mapInstance.setZoom(zoom);
    } catch (error) {
      console.error('줌 변경 실패:', error);
    }
  }, [mapInstance]);

  // 모든 마커 제거
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];
  }, []);

  // 모든 정보창 제거
  const clearInfoWindows = useCallback(() => {
    infoWindowsRef.current.forEach(infoWindow => {
      if (infoWindow && infoWindow.close) {
        infoWindow.close();
      }
    });
    infoWindowsRef.current = [];
  }, []);

  // 지도 타입 변경
  const setMapType = useCallback((mapTypeId: string) => {
    if (!mapInstance || !isNaverMapsLoaded()) return;

    try {
      const { naver } = window;
      mapInstance.setMapTypeId(naver.maps.MapTypeId[mapTypeId] || naver.maps.MapTypeId.NORMAL);
    } catch (error) {
      console.error('지도 타입 변경 실패:', error);
    }
  }, [mapInstance, isNaverMapsLoaded]);

  // 지도 크기 조정
  const resize = useCallback(() => {
    if (!mapInstance) return;

    try {
      mapInstance.refresh();
    } catch (error) {
      console.error('지도 크기 조정 실패:', error);
    }
  }, [mapInstance]);

  // 지도 이벤트 리스너 추가
  const addMapListener = useCallback((eventType: string, callback: Function) => {
    if (!mapInstance || !isNaverMapsLoaded()) return;

    try {
      const { naver } = window;
      naver.maps.Event.addListener(mapInstance, eventType, callback);
    } catch (error) {
      console.error('이벤트 리스너 추가 실패:', error);
    }
  }, [mapInstance, isNaverMapsLoaded]);

  // 지도 이벤트 리스너 제거
  const removeMapListener = useCallback((eventType: string, callback: Function) => {
    if (!mapInstance || !isNaverMapsLoaded()) return;

    try {
      const { naver } = window;
      naver.maps.Event.removeListener(mapInstance, eventType, callback);
    } catch (error) {
      console.error('이벤트 리스너 제거 실패:', error);
    }
  }, [mapInstance, isNaverMapsLoaded]);

  // 지도 초기화
  useEffect(() => {
    if (initializedRef.current) return;

    const timer = setTimeout(() => {
      if (isNaverMapsLoaded()) {
        initializeMap();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isNaverMapsLoaded, initializeMap]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearMarkers();
      clearInfoWindows();
      initializedRef.current = false;
    };
  }, [clearMarkers, clearInfoWindows]);

  return {
    mapInstance,
    isMapLoaded,
    addMarker,
    addInfoWindow,
    bindInfoWindowToMarker,
    panTo,
    setZoom,
    clearMarkers,
    clearInfoWindows,
    setMapType,
    resize,
    addMapListener,
    removeMapListener
  };
};
