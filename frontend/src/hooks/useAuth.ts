import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import * as authApi from '../api/auth';

// 로그인 훅
export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuthData, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { token, expiresAt, user } = response.data;
        
        // 백엔드에서 받은 모든 사용자 정보로 로그인 처리
        setAuthData(user, token, expiresAt);
        
        // 로그인 성공 메시지 (사용자 이름 포함)
        const welcomeMessage = user.name 
          ? `${user.name}님, 환영합니다!` 
          : `${user.username}님, 환영합니다!`;
        toast.success(welcomeMessage);
        
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      // 에러는 이미 인터셉터에서 처리됨
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// 회원가입 훅
export const useSignup = () => {
  const navigate = useNavigate();
  const { setLoading } = useAuthStore();

  return useMutation({
    mutationFn: authApi.signup,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || '회원가입 성공!');
        navigate('/login');
      }
    },
    onError: (error: any) => {
      console.error('Signup error:', error);
      // 에러는 이미 인터셉터에서 처리됨
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// 로그아웃 훅
export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return () => {
    logout();
    navigate('/login');
  };
};

// 사용자 정보 업데이트 훅
export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: authApi.updateUserInfo,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // 새로운 토큰으로 사용자 정보 업데이트
        const { token, expiresAt, user } = response.data;
        
        // 로컬 스토리지와 스토어 업데이트
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
        
        // 스토어의 사용자 정보 업데이트
        const { updateUser } = useAuthStore.getState();
        updateUser(user);
        
        toast.success('사용자 정보가 성공적으로 업데이트되었습니다.');
      }
    },
    onError: (error: any) => {
      console.error('사용자 정보 업데이트 실패:', error);
      toast.error('사용자 정보 업데이트에 실패했습니다.');
    },
  });
};

// 사용자 총 예산 업데이트 훅
export const useUpdateUserTotalBudget = () => {
  return useMutation({
    mutationFn: authApi.updateUserTotalBudget,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // 새로운 토큰으로 사용자 정보 업데이트
        const { token, expiresAt, user } = response.data;
        
        // 로컬 스토리지와 스토어 업데이트
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
        
        // 스토어의 사용자 정보 업데이트
        const { updateUser } = useAuthStore.getState();
        updateUser(user);
        
        toast.success('총 예산이 성공적으로 업데이트되었습니다.');
      }
    },
    onError: (error: any) => {
      console.error('총 예산 업데이트 실패:', error);
      toast.error('총 예산 업데이트에 실패했습니다.');
    },
  });
};
