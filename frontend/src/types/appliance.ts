export enum ApplianceCategory {
  KITCHEN = 'KITCHEN',           // 주방가전
  LIVING_ROOM = 'LIVING_ROOM',   // 거실가전
  BEDROOM = 'BEDROOM',          // 침실가전
  BATHROOM = 'BATHROOM',        // 욕실가전
  LAUNDRY = 'LAUNDRY',          // 세탁가전
  OFFICE = 'OFFICE',            // 사무용가전
  FURNITURE = 'FURNITURE',      // 가구
  OTHER = 'OTHER'               // 기타
}

export enum ApplianceStatus {
  PLANNING = 'PLANNING',        // 계획 중
  RESEARCHING = 'RESEARCHING',  // 조사 중
  PURCHASED = 'PURCHASED',      // 구매 완료
  DELIVERED = 'DELIVERED',      // 배송 완료
  INSTALLED = 'INSTALLED',      // 설치 완료
  CANCELLED = 'CANCELLED'       // 취소
}

export enum AppliancePriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export const ApplianceCategoryLabels = {
  [ApplianceCategory.KITCHEN]: '주방가전',
  [ApplianceCategory.LIVING_ROOM]: '거실가전',
  [ApplianceCategory.BEDROOM]: '침실가전',
  [ApplianceCategory.BATHROOM]: '욕실가전',
  [ApplianceCategory.LAUNDRY]: '세탁가전',
  [ApplianceCategory.OFFICE]: '사무용가전',
  [ApplianceCategory.FURNITURE]: '가구',
  [ApplianceCategory.OTHER]: '기타'
};

export const ApplianceStatusLabels = {
  [ApplianceStatus.PLANNING]: '계획 중',
  [ApplianceStatus.RESEARCHING]: '조사 중',
  [ApplianceStatus.PURCHASED]: '구매 완료',
  [ApplianceStatus.DELIVERED]: '배송 완료',
  [ApplianceStatus.INSTALLED]: '설치 완료',
  [ApplianceStatus.CANCELLED]: '취소'
};

export const AppliancePriorityLabels = {
  [AppliancePriority.HIGH]: '높음',
  [AppliancePriority.MEDIUM]: '보통',
  [AppliancePriority.LOW]: '낮음'
};

export interface Appliance {
  id: number;
  name: string;
  category: ApplianceCategory;
  brand?: string;
  model?: string;
  plannedPrice: number;
  actualPrice?: number;
  status: ApplianceStatus;
  priority: AppliancePriority;
  description?: string;
  store?: string;
  purchaseDate?: string;
  deliveryDate?: string;
  installationDate?: string;
  warranty?: string;
  memo?: string;
  imageUrl?: string;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplianceFormData {
  name: string;
  category: ApplianceCategory;
  brand: string;
  model: string;
  plannedPrice: string;
  actualPrice: string;
  status: ApplianceStatus;
  priority: AppliancePriority;
  description: string;
  store: string;
  purchaseDate: string;
  deliveryDate: string;
  installationDate: string;
  warranty: string;
  memo: string;
}

export interface ApplianceSummary {
  category: ApplianceCategory;
  itemCount: number;
  totalPlannedPrice: number;
  totalActualPrice: number;
  remainingAmount: number;
  completionRate: number;
}

export interface ApplianceStatusSummary {
  status: ApplianceStatus;
  count: number;
}
