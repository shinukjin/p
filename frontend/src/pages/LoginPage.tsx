import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

// 로그인 폼 스키마
const loginSchema = z.object({
  username: z
    .string()
    .min(1, '사용자명을 입력해주세요.')
    .min(3, '사용자명은 3자 이상이어야 합니다.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { isLoading } = useAuthStore();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-600">계정에 로그인하세요</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                사용자명
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('username')}
                  type="text"
                  id="username"
                  className={`input pl-10 ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="사용자명을 입력하세요"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  className={`input pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FiLogIn className="w-4 h-4 mr-2" />
                  로그인
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                className="font-medium text-gray-700 hover:text-gray-900 underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
