// 결혼정보 관련 타입 정의

export interface WeddingHall {
  id: number;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  pricePerTable?: number;
  capacity?: number;
  hallType?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  parkingInfo?: string;
  facilities?: string[];
  isBookmarked: boolean;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingService {
  id: number;
  name: string;
  serviceType: ServiceType;
  address: string;
  phone?: string;
  website?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  rating?: number;
  portfolio?: string[];
  specialties?: string[];
  isBookmarked: boolean;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ServiceType {
  STUDIO = 'STUDIO',
  DRESS = 'DRESS',
  MAKEUP = 'MAKEUP'
}

export const ServiceTypeLabels = {
  [ServiceType.STUDIO]: '스튜디오',
  [ServiceType.DRESS]: '드레스',
  [ServiceType.MAKEUP]: '메이크업'
};

export interface RealEstate {
  id: number;
  title: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  address: string;
  detailAddress?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  monthlyRent?: number;
  deposit?: number;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  buildingType?: string;
  buildYear?: number;
  description?: string;
  imageUrl?: string;
  images?: string[];
  facilities?: string[];
  transportation?: string;
  isBookmarked: boolean;
  memo?: string;
  contactInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  OFFICETEL = 'OFFICETEL',
  HOUSE = 'HOUSE',
  STUDIO = 'STUDIO'
}

export const PropertyTypeLabels = {
  [PropertyType.APARTMENT]: '아파트',
  [PropertyType.VILLA]: '빌라',
  [PropertyType.OFFICETEL]: '오피스텔',
  [PropertyType.HOUSE]: '단독주택',
  [PropertyType.STUDIO]: '원룸'
};

export enum TransactionType {
  SALE = 'SALE',
  JEONSE = 'JEONSE',
  MONTHLY_RENT = 'MONTHLY_RENT'
}

export const TransactionTypeLabels = {
  [TransactionType.SALE]: '매매',
  [TransactionType.JEONSE]: '전세',
  [TransactionType.MONTHLY_RENT]: '월세'
};

// 대시보드 통계 타입
export interface DashboardStats {
  weddingHalls: {
    total: number;
    bookmarked: number;
  };
  weddingServices: {
    total: number;
    bookmarked: number;
    byType: Record<ServiceType, number>;
  };
  realEstates: {
    total: number;
    bookmarked: number;
    byType: Record<PropertyType, number>;
  };
}

// 검색 필터 타입
export interface WeddingHallFilter {
  name?: string;
  hallType?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  isBookmarked?: boolean;
}

export interface WeddingServiceFilter {
  name?: string;
  serviceType?: ServiceType;
  minPrice?: number;
  maxPrice?: number;
  isBookmarked?: boolean;
}

export interface RealEstateFilter {
  title?: string;
  propertyType?: PropertyType;
  transactionType?: TransactionType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number;
  isBookmarked?: boolean;
}
