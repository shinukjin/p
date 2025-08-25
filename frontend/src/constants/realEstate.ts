import { PropertyType, TransactionType } from '../types/realestate';

export const PropertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.APARTMENT]: '아파트',
  [PropertyType.VILLA]: '빌라',
  [PropertyType.HOUSE]: '단독주택',
  [PropertyType.OFFICETEL]: '오피스텔',
  [PropertyType.COMMERCIAL]: '상가',
  [PropertyType.LAND]: '토지'
};

export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.SALE]: '매매',
  [TransactionType.JEONSE]: '전세',
  [TransactionType.MONTHLY_RENT]: '월세'
};

export const DEFAULT_MAP_CENTER = { lat: 37.5665, lng: 126.9780 }; // 서울시청

export const ANIMATION_DELAYS = {
  CARD: 100,
  STAGGER: 50
};

export const PROPERTY_TYPE_OPTIONS = Object.entries(PropertyTypeLabels).map(([value, label]) => ({
  value: value as PropertyType,
  label
}));

export const TRANSACTION_TYPE_OPTIONS = Object.entries(TransactionTypeLabels).map(([value, label]) => ({
  value: value as TransactionType,
  label
}));
