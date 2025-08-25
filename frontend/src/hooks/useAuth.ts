import { useMutation, useQueryClient } from '@tanstack/react-query';
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
        // JWT 토큰에서 사용자 정보 추출 (간단한 예시)
        const user = {
          id: 1, // 실제로는 JWT 디코딩해서 가져와야 함
          username: 'user', // 실제로는 JWT 디코딩해서 가져와야 함
        };
        
        // 서버에서 받은 만료 시간 정보 사용
        setAuthData(user, response.data.token, response.data.expiresAt);
        toast.success(response.message || '로그인 성공!');
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
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    toast.success('로그아웃되었습니다.');
    navigate('/login');
  };
};

// 토큰 만료로 인한 자동 로그아웃 훅
export const useAutoLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (reason: 'expired' | 'invalid' | 'unauthorized' = 'expired') => {
    logout();
    queryClient.clear();
    
    let message = '로그아웃되었습니다.';
    if (reason === 'expired') {
      message = '토큰이 만료되어 자동으로 로그아웃되었습니다.';
    } else if (reason === 'invalid') {
      message = '유효하지 않은 토큰으로 인해 로그아웃되었습니다.';
    } else if (reason === 'unauthorized') {
      message = '인증이 필요하여 로그아웃되었습니다.';
    }
    
    toast.success(message);
    navigate('/login');
  };
};
