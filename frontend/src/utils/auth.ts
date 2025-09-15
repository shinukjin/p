import { useAuthStore } from '../store/authStore';

/**
 * 토큰이 만료되었는지 확인
 */
export const isTokenExpired = (): boolean => {
  const { tokenExpiresAt } = useAuthStore.getState();
  
  if (!tokenExpiresAt) {
    return true;
  }
  
  // 현재 시간과 토큰 만료 시간 비교 (5분 여유 시간 포함)
  const currentTime = Date.now();
  
  // tokenExpiresAt이 밀리초 단위인지 초 단위인지 확인
  let expirationTime: number;
  if (tokenExpiresAt > 1000000000000) {
    // 밀리초 단위 (13자리 이상)
    expirationTime = tokenExpiresAt;
  } else {
    // 초 단위 (10자리)
    expirationTime = tokenExpiresAt * 1000;
  }
  
  const bufferTime = 5 * 60 * 1000; // 5분
  
  return currentTime >= (expirationTime - bufferTime);
};

/**
 * 토큰 만료까지 남은 시간 (초)
 */
export const getTokenExpirationTime = (): number => {
  const { tokenExpiresAt } = useAuthStore.getState();
  
  if (!tokenExpiresAt) {
    return 0;
  }
  
  const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초로 변환
  
  // tokenExpiresAt이 밀리초 단위인지 초 단위인지 확인
  let expirationTimeSeconds: number;
  if (tokenExpiresAt > 1000000000000) {
    // 밀리초 단위 (13자리 이상) -> 초로 변환
    expirationTimeSeconds = Math.floor(tokenExpiresAt / 1000);
  } else {
    // 초 단위 (10자리)
    expirationTimeSeconds = tokenExpiresAt;
  }
  
  return Math.max(0, expirationTimeSeconds - currentTime);
};

/**
 * 토큰 만료까지 남은 시간을 읽기 쉬운 형태로 반환
 */
export const getTokenExpirationTimeFormatted = (): string => {
  const { tokenExpiresAt } = useAuthStore.getState();
  const remainingSeconds = getTokenExpirationTime();
  
  // 디버깅 정보 (개발 환경에서만)
  if (import.meta.env.DEV) {
    console.log('토큰 만료 시간 디버깅:', {
      tokenExpiresAt,
      tokenExpiresAtType: typeof tokenExpiresAt,
      tokenExpiresAtLength: tokenExpiresAt?.toString().length,
      currentTime: Math.floor(Date.now() / 1000),
      remainingSeconds,
      isMilliseconds: tokenExpiresAt ? tokenExpiresAt > 1000000000000 : false
    });
  }
  
  if (remainingSeconds <= 0) {
    return '만료됨';
  }
  
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else if (minutes > 0) {
    return `${minutes}분 ${seconds}초`;
  } else {
    return `${seconds}초`;
  }
};

/**
 * 토큰 상태를 체크하고 필요시 자동 로그아웃
 */
export const checkTokenStatus = (): boolean => {
  const { isAuthenticated, logout } = useAuthStore.getState();
  
  if (!isAuthenticated) {
    return false;
  }
  
  if (isTokenExpired()) {
    console.log('토큰이 만료되어 자동 로그아웃됩니다.');
    logout();
    return false;
  }
  
  return true;
};

/**
 * 주기적으로 토큰 상태를 체크하는 함수
 */
export const startTokenCheck = (): (() => void) => {
  const interval = setInterval(() => {
    checkTokenStatus();
  }, 10000); // 1분마다 체크
  
  return () => clearInterval(interval);
};

/**
 * 토큰 만료 시간을 Date 객체로 변환
 */
export const getTokenExpirationDate = (): Date | null => {
  const { tokenExpiresAt } = useAuthStore.getState();
  
  if (!tokenExpiresAt) {
    return null;
  }
  
  // tokenExpiresAt이 밀리초 단위인지 초 단위인지 확인
  let expirationTimeMs: number;
  if (tokenExpiresAt > 1000000000000) {
    // 밀리초 단위 (13자리 이상)
    expirationTimeMs = tokenExpiresAt;
  } else {
    // 초 단위 (10자리)
    expirationTimeMs = tokenExpiresAt * 1000;
  }
  
  return new Date(expirationTimeMs);
};

/**
 * 토큰 만료 시간을 한국 시간으로 포맷팅
 */
export const getTokenExpirationTimeFormattedKR = (): string => {
  const expirationDate = getTokenExpirationDate();
  
  if (!expirationDate) {
    return '만료됨';
  }
  
  return expirationDate.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
