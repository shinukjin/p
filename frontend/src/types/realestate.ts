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

// 백엔드 DTO와 일치하는 폼 데이터 타입
export interface RealEstateFormData {
  title: string;
  propertyType: string; // 백엔드에서 String으로 받음
  transactionType: string; // 백엔드에서 String으로 받음
  address: string;
  detailAddress: string;
  latitude: string; // 백엔드에서 String으로 받음
  longitude: string; // 백엔드에서 String으로 받음
  price: string; // 백엔드에서 String으로 받음
  deposit: string; // 백엔드에서 String으로 받음
  monthlyRent: string; // 백엔드에서 String으로 받음
  area: string; // 백엔드에서 String으로 받음
  rooms: string; // 백엔드에서 String으로 받음
  bathrooms: string; // 백엔드에서 String으로 받음
  parking: string; // 백엔드에서 String으로 받음
  floor: string; // 백엔드에서 String으로 받음
  totalFloors: string; // 백엔드에서 String으로 받음
  yearBuilt: string; // 백엔드에서 String으로 받음
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  images: File[]; // 이미지 파일 배열
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
