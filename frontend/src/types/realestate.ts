export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  HOUSE = 'HOUSE',
  OFFICETEL = 'OFFICETEL',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND'
}

export enum TransactionType {
  SALE = 'SALE',
  JEONSE = 'JEONSE',
  MONTHLY_RENT = 'MONTHLY_RENT'
}

export interface RealEstate {
  id?: number;
  title: string;
  address: string;
  detailAddress?: string;
  latitude: number;
  longitude: number;
  propertyType: PropertyType;
  transactionType: TransactionType;
  price?: number; // 매매가
  deposit?: number; // 보증금
  monthlyRent?: number; // 월세
  area: number; // 면적 (제곱미터)
  rooms: number; // 방 개수
  bathrooms: number; // 화장실 개수
  parking: number; // 주차 가능 대수
  floor: number; // 층수
  totalFloors: number; // 전체 층수
  yearBuilt?: number; // 준공년도
  description?: string; // 상세설명
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  images?: string[]; // 이미지 URL 배열
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RealEstateFormData {
  title: string;
  address: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  propertyType: PropertyType;
  transactionType: TransactionType;
  price: string;
  deposit: string;
  monthlyRent: string;
  area: string;
  rooms: string;
  bathrooms: string;
  parking: string;
  floor: string;
  totalFloors: string;
  yearBuilt: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  images: File[];
}

export interface RealEstateSearchFilter {
  propertyType?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number;
  location?: string;
}
