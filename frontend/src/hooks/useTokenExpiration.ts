import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAutoLogout } from './useAuth';

export const useTokenExpiration = () => {
  const { token, isAuthenticated, tokenExpiresAt } = useAuthStore();
  const autoLogout = useAutoLogout();
  const logoutTimeoutRef = useRef<number | null>(null);
  const checkIntervalRef = useRef<number | null>(null);

  // 토큰 만료 시간 확인 (서버에서 받은 정보 사용)
  const isTokenExpired = (): boolean => {
    if (!tokenExpiresAt) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenExpiresAt < currentTime;
  };

  // 토큰 만료까지 남은 시간 (밀리초)
  const getTimeUntilExpiration = (): number => {
    if (!tokenExpiresAt) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = (tokenExpiresAt - currentTime) * 1000;
    return Math.max(0, timeUntilExpiration);
  };

  // 자동 로그아웃 설정
  const setupAutoLogout = () => {
    // 기존 타이머 정리
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }

    const timeUntilExpiration = getTimeUntilExpiration();
    
    if (timeUntilExpiration > 0) {
      // 토큰 만료 1분 전에 경고 (선택사항)
      const warningTime = Math.max(0, timeUntilExpiration - 60000);
      
      if (warningTime > 0) {
        setTimeout(() => {
          // 토큰 만료 1분 전 경고 (선택사항)
          console.warn('토큰이 1분 후 만료됩니다.');
        }, warningTime);
      }

      // 토큰 만료 시 자동 로그아웃
      logoutTimeoutRef.current = setTimeout(() => {
        console.log('토큰이 만료되어 자동 로그아웃됩니다.');
        autoLogout('expired');
      }, timeUntilExpiration);
    }
  };

  // 주기적으로 토큰 상태 확인
  const startTokenCheck = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // 30초마다 토큰 상태 확인
    checkIntervalRef.current = setInterval(() => {
      if (token && isAuthenticated) {
        if (isTokenExpired()) {
          console.log('토큰이 만료되어 자동 로그아웃됩니다.');
          autoLogout('expired');
        }
      }
    }, 30000); // 30초
  };

  useEffect(() => {
    if (token && isAuthenticated && tokenExpiresAt) {
      // 토큰이 만료되었는지 즉시 확인
      if (isTokenExpired()) {
        console.log('토큰이 이미 만료되어 자동 로그아웃됩니다.');
        autoLogout('expired');
        return;
      }

      // 자동 로그아웃 설정
      setupAutoLogout();
      
      // 주기적 토큰 상태 확인 시작
      startTokenCheck();
    }

    // 클린업
    return () => {
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [token, isAuthenticated, tokenExpiresAt, autoLogout]);

  // 토큰 만료까지 남은 시간 반환 (분 단위)
  const getMinutesUntilExpiration = (): number => {
    const timeUntilExpiration = getTimeUntilExpiration();
    return Math.ceil(timeUntilExpiration / 60000);
  };

  return {
    isTokenExpired: isTokenExpired(),
    getMinutesUntilExpiration,
    getTimeUntilExpiration: getTimeUntilExpiration(),
  };
};
