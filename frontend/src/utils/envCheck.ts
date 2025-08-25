// 환경변수 확인 유틸리티
export const checkEnvVariables = () => {
  console.log('🔍 환경변수 확인:');
  console.log('MODE:', import.meta.env.MODE);
  console.log('DEV:', import.meta.env.DEV);
  console.log('VITE_NAVER_MAP_CLIENT_ID:', import.meta.env.VITE_NAVER_MAP_CLIENT_ID);
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  
  // 모든 VITE_ 환경변수 출력
  console.log('모든 VITE_ 환경변수:', 
    Object.keys(import.meta.env)
      .filter(key => key.startsWith('VITE_'))
      .reduce((obj, key) => {
        obj[key] = import.meta.env[key];
        return obj;
      }, {} as Record<string, any>)
  );
};
