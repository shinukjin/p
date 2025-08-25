import axios from 'axios';
import { toast } from 'react-hot-toast';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    // 에러 처리
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 인증 실패 - 토큰 제거 및 로그인 페이지로 리다이렉트
          localStorage.removeItem('token');
          
          // 토큰 만료인지 확인
          if (data?.message?.includes('expired') || data?.message?.includes('만료')) {
            toast.success('토큰이 만료되어 자동으로 로그아웃되었습니다.');
          } else {
            toast.error('로그인이 필요합니다.');
          }
          
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
          break;
          
        case 403:
          toast.error('접근 권한이 없습니다.');
          break;
          
        case 404:
          toast.error('요청한 리소스를 찾을 수 없습니다.');
          break;
          
        case 500:
          toast.error('서버 오류가 발생했습니다.');
          break;
          
        default:
          // 서버에서 온 에러 메시지 표시
          if (data?.message) {
            toast.error(data.message);
          } else {
            toast.error('알 수 없는 오류가 발생했습니다.');
          }
      }
    } else if (error.request) {
      // 네트워크 오류
      toast.error('네트워크 연결을 확인해주세요.');
    } else {
      // 기타 오류
      toast.error('요청 처리 중 오류가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
