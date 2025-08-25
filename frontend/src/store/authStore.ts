import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiresAt: number | null; // 토큰 만료 시간 (Unix timestamp)
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setTokenExpiresAt: (expiresAt: number) => void;
  login: (user: User, token: string, expiresAt: number) => void;
  loginAdmin: (adminInfo: User, token: string, expiresAt: number) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      token: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      isLoading: false,

      // 액션들
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token) => {
        set({ token });
        localStorage.setItem('token', token);
      },

      setTokenExpiresAt: (expiresAt) => {
        set({ tokenExpiresAt: expiresAt });
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      },

      login: (user, token, expiresAt) => {
        set({ 
          user, 
          token, 
          tokenExpiresAt: expiresAt,
          isAuthenticated: true,
          isLoading: false 
        });
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      },

      // 관리자 로그인용 (adminInfo 포함)
      loginAdmin: (adminInfo, token, expiresAt) => {
        set({ 
          user: adminInfo, 
          token, 
          tokenExpiresAt: expiresAt,
          isAuthenticated: true,
          isLoading: false 
        });
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          tokenExpiresAt: null,
          isAuthenticated: false,
          isLoading: false 
        });
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiresAt');
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tokenExpiresAt: state.tokenExpiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
