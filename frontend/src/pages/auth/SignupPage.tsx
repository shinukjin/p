import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiLock, FiUserPlus, FiMail, FiPhone } from 'react-icons/fi';
import { signup } from '../../api/auth';

const signupSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요.').min(3, '사용자명은 3자 이상이어야 합니다.').max(20, '사용자명은 20자 이하여야 합니다.').regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.').min(6, '비밀번호는 6자 이상이어야 합니다.').max(20, '비밀번호는 20자 이하여야 합니다.').regex(/^(?=.*[a-zA-Z])(?=.*\d).*$/, '비밀번호는 영문과 숫자를 포함해야 합니다.'),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  name: z.string().min(1, '이름을 입력해주세요.').max(100, '이름은 100자 이하여야 합니다.'),
  email: z.string().min(1, '이메일을 입력해주세요.').email('유효한 이메일 주소를 입력해주세요.').max(100, '이메일은 100자 이하여야 합니다.'),
  phone: z.string().optional().refine((val) => !val || /^[0-9-+()]*$/.test(val), '유효한 전화번호를 입력해주세요.').refine((val) => !val || val.length <= 20, '전화번호는 20자 이하여야 합니다.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await signup(data);
      if (response.success) {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        navigate('/login');
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <FiUserPlus className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
        <p className="text-gray-600">새로운 계정을 만드세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            <FiUser className="inline mr-2 w-4 h-4" />
            사용자명
          </label>
          <input
            {...register('username')}
            type="text"
            id="username"
            className="input"
            placeholder="사용자명을 입력하세요"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <FiUser className="inline mr-2 w-4 h-4" />
            이름
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="input"
            placeholder="이름을 입력하세요"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <FiMail className="inline mr-2 w-4 h-4" />
            이메일
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="input"
            placeholder="이메일을 입력하세요"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            <FiPhone className="inline mr-2 w-4 h-4" />
            전화번호 (선택)
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="input"
            placeholder="전화번호를 입력하세요"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            <FiLock className="inline mr-2 w-4 h-4" />
            비밀번호
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="input"
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            <FiLock className="inline mr-2 w-4 h-4" />
            비밀번호 확인
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className="input"
            placeholder="비밀번호를 다시 입력하세요"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
              로그인
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
