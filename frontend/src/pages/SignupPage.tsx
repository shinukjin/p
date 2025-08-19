import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { FiUser, FiLock, FiUserPlus, FiMail, FiPhone } from 'react-icons/fi';
import { useSignup } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

// 회원가입 폼 스키마
const signupSchema = z.object({
  username: z
    .string()
    .min(1, '사용자명을 입력해주세요.')
    .min(3, '사용자명은 3자 이상이어야 합니다.')
    .max(20, '사용자명은 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 6자 이상이어야 합니다.')
    .max(20, '비밀번호는 20자 이하여야 합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).*$/, '비밀번호는 영문과 숫자를 포함해야 합니다.'),
  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요.'),
  name: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .max(100, '이름은 100자 이하여야 합니다.'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효한 이메일 주소를 입력해주세요.')
    .max(100, '이메일은 100자 이하여야 합니다.'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9-+()]*$/.test(val), '유효한 전화번호를 입력해주세요.')
    .refine((val) => !val || val.length <= 20, '전화번호는 20자 이하여야 합니다.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const { isLoading } = useAuthStore();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-600">새 계정을 만드세요</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                사용자명 *
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름 *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="이름을 입력하세요"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="이메일을 입력하세요"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="전화번호를 입력하세요 (선택사항)"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 *
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 *
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  id="confirmPassword"
                  className={`input pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
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
                  회원가입 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FiUserPlus className="w-4 h-4 mr-2" />
                  회원가입
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="font-medium text-gray-700 hover:text-gray-900 underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
