import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { login } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginAction } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await login(data);
      if (response.success && response.data) {
        // 백엔드가 토큰만 반환하는 경우 사용자 정보는 최소 username만 구성
        const user = response.data.user as any;
        loginAction(user, response.data.token, response.data.expiresAt);
        navigate('/dashboard');
      } else {
        setError(response.message || '로그인에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 로그인 카드 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {/* 헤더 */}
          <div className="text-center py-8 px-6 border-b border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FiLogIn className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">일반 로그인</h1>
            <p className="text-gray-600 text-sm mt-1">일반 사용자 계정으로 로그인하세요</p>
          </div>

          {/* 로그인 폼 */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* 사용자명 입력 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register('username')}
                    type="text"
                    id="username"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="사용자명을 입력하세요"
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>로그인 중...</span>
                  </div>
                ) : (
                  <span>로그인</span>
                )}
              </button>

              {/* 회원가입 링크 */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  계정이 없으신가요?{' '}
                  <Link 
                    to="/signup" 
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    회원가입
                  </Link>
                </p>
              </div>

              {/* 관리자 로그인 링크 */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  관리자이신가요?{' '}
                  <Link 
                    to="/admin/login" 
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    관리자 로그인
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* 푸터 */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              © 2025 부동산 포털
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
