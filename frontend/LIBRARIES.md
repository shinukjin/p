# 프론트엔드 라이브러리 정리

## 🚀 핵심 기술 스택

### **React 18 + TypeScript**
- **목적**: 메인 프론트엔드 프레임워크
- **특징**: 타입 안정성, 최신 React 기능 활용

### **Vite**
- **목적**: 빠른 개발 서버 및 빌드 도구
- **특징**: HMR(Hot Module Replacement), 빠른 빌드 속도

## 🎨 스타일링

### **Tailwind CSS**
- **목적**: 유틸리티 기반 CSS 프레임워크
- **사용법**: `className="bg-blue-500 text-white p-4"`
- **장점**: 빠른 스타일링, 일관된 디자인 시스템

## 🔄 상태 관리

### **Zustand**
- **목적**: 전역 상태 관리
- **특징**: 간단한 API, 보일러플레이트 최소화
- **사용법**: 
```typescript
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

### **React Query (@tanstack/react-query)**
- **목적**: 서버 상태 관리
- **특징**: 캐싱, 동기화, 백그라운드 업데이트
- **사용법**: `useQuery`, `useMutation`

## 🌐 HTTP 통신

### **Axios**
- **목적**: HTTP 클라이언트
- **특징**: 인터셉터, 요청/응답 변환
- **설정**: 기본 URL, 헤더 설정

## 🧭 라우팅

### **React Router v6**
- **목적**: 클라이언트 사이드 라우팅
- **사용법**: `<Routes>`, `<Route>`, `useNavigate`

## 📋 폼 관리

### **React Hook Form**
- **목적**: 성능 좋은 폼 라이브러리
- **특징**: 최소 리렌더링, TypeScript 지원
- **사용법**: `useForm`, `register`, `handleSubmit`

### **Zod**
- **목적**: TypeScript 스키마 검증
- **특징**: 런타임 타입 검증
- **연동**: React Hook Form과 `@hookform/resolvers` 사용

## 🎭 애니메이션

### **Framer Motion**
- **목적**: 애니메이션 라이브러리
- **특징**: 선언적 애니메이션, 제스처 지원
- **사용법**: `<motion.div>`, `animate`, `transition`

## 🔔 알림

### **React Hot Toast**
- **목적**: 토스트 알림
- **특징**: 가볍고 커스터마이징 가능
- **사용법**: `toast.success()`, `toast.error()`

## 🎯 UI 컴포넌트

### **React Icons**
- **목적**: 아이콘 라이브러리
- **특징**: 다양한 아이콘 세트 (Heroicons, Feather 등)
- **사용법**: `import { FiUser } from 'react-icons/fi'`

### **Headless UI**
- **목적**: 접근성 좋은 기본 컴포넌트
- **특징**: 스타일 없는 컴포넌트, Tailwind와 완벽 호환
- **사용법**: `Dialog`, `Menu`, `Listbox`

## 🛠️ 유틸리티

### **clsx**
- **목적**: 조건부 CSS 클래스 관리
- **사용법**: `clsx('base-class', { 'active': isActive })`

### **Day.js**
- **목적**: 날짜 처리 라이브러리
- **특징**: 가벼움 (Moment.js 대안)
- **사용법**: `dayjs().format('YYYY-MM-DD')`

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── components/     # 재사용 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── hooks/         # 커스텀 훅
│   ├── store/         # Zustand 스토어
│   ├── api/           # API 관련 함수
│   ├── types/         # TypeScript 타입 정의
│   └── utils/         # 유틸리티 함수
├── public/            # 정적 파일
└── package.json       # 의존성 관리
```

## 🚀 개발 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 실행
```
