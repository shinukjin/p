import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
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
      isAuthenticated: false,
      isLoading: false,

      // 액션들
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
        localStorage.setItem('token', token);
      },

      login: (user: User, token: string) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false 
        });
        localStorage.setItem('token', token);
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        localStorage.removeItem('token');
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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
