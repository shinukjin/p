// 일정 관리 타입 정의

export enum ScheduleType {
  VENUE_BOOKING = 'VENUE_BOOKING',      // 예식장 예약
  CATERING = 'CATERING',           // 음식 관련
  PHOTOGRAPHY = 'PHOTOGRAPHY',        // 사진/영상
  INVITATION = 'INVITATION',         // 초대장
  DRESS_FITTING = 'DRESS_FITTING',      // 드레스 피팅
  MAKEUP_TRIAL = 'MAKEUP_TRIAL',       // 메이크업 시연
  FLOWER_ORDER = 'FLOWER_ORDER',       // 꽃 주문
  MUSIC_SETUP = 'MUSIC_SETUP',        // 음향 설정
  HONEYMOON_BOOKING = 'HONEYMOON_BOOKING',  // 신혼여행 예약
  DOCUMENT_PREP = 'DOCUMENT_PREP',      // 서류 준비
  GIFT_PREPARATION = 'GIFT_PREPARATION',   // 답례품 준비
  REHEARSAL = 'REHEARSAL',          // 리허설
  OTHER = 'OTHER'               // 기타
}

export enum ScheduleStatus {
  PENDING = 'PENDING',      // 대기
  IN_PROGRESS = 'IN_PROGRESS',  // 진행 중
  COMPLETED = 'COMPLETED',    // 완료
  OVERDUE = 'OVERDUE',      // 기한 초과
  CANCELLED = 'CANCELLED'     // 취소
}

export const ScheduleTypeLabels = {
  [ScheduleType.VENUE_BOOKING]: '예식장 예약',
  [ScheduleType.CATERING]: '음식 관련',
  [ScheduleType.PHOTOGRAPHY]: '사진/영상',
  [ScheduleType.INVITATION]: '초대장',
  [ScheduleType.DRESS_FITTING]: '드레스 피팅',
  [ScheduleType.MAKEUP_TRIAL]: '메이크업 시연',
  [ScheduleType.FLOWER_ORDER]: '꽃 주문',
  [ScheduleType.MUSIC_SETUP]: '음향 설정',
  [ScheduleType.HONEYMOON_BOOKING]: '신혼여행 예약',
  [ScheduleType.DOCUMENT_PREP]: '서류 준비',
  [ScheduleType.GIFT_PREPARATION]: '답례품 준비',
  [ScheduleType.REHEARSAL]: '리허설',
  [ScheduleType.OTHER]: '기타'
};

export const ScheduleStatusLabels = {
  [ScheduleStatus.PENDING]: '대기',
  [ScheduleStatus.IN_PROGRESS]: '진행 중',
  [ScheduleStatus.COMPLETED]: '완료',
  [ScheduleStatus.OVERDUE]: '기한 초과',
  [ScheduleStatus.CANCELLED]: '취소'
};

export interface Schedule {
  id: number;
  title: string;
  description?: string;
  type: ScheduleType;
  status: ScheduleStatus;
  priority: Priority;
  dueDate: string;
  completedAt?: string;
  relatedVendor?: string;
  contactInfo?: string;
  budgetId?: number;
  daysBeforeWedding?: number;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
  daysUntilDue: number;
}

export interface ScheduleFormData {
  title: string;
  description: string;
  type: ScheduleType;
  status: ScheduleStatus;
  priority: Priority;
  dueDate: string;
  relatedVendor: string;
  contactInfo: string;
  budgetId: string;
  daysBeforeWedding: string;
}

export interface ScheduleSummary {
  status: ScheduleStatus;
  count: number;
}

export interface ScheduleTypeSummary {
  type: ScheduleType;
  count: number;
}

// 우선순위 enum 직접 정의
export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export const PriorityLabels = {
  [Priority.HIGH]: '높음',
  [Priority.MEDIUM]: '보통',
  [Priority.LOW]: '낮음'
};
