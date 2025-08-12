# 부동산 실거래가 조회 시스템

Spring Boot와 React를 사용한 부동산 실거래가 조회 및 네이버 부동산 연동 시스템입니다.

## 주요 기능

- 🏠 아파트 실거래가 조회
- 📊 지역별 실거래가 통계
- 🗺️ 네이버 부동산 연동 (매물 위치 확인)
- 📱 반응형 웹 디자인

## 기술 스택

### Backend
- Java 17
- Spring Boot 3.x
- Spring Web
- Gradle

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd [project-directory]
```

### 2. 로컬 개발 설정

#### 로컬 설정 파일 생성
```bash
# application-local.properties 파일 생성
cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties

# application-local.properties 파일 편집하여 실제 API 키 입력
# naver.map.client.id=your_actual_client_id
# naver.map.client.secret=your_actual_client_secret
```

#### 운영환경 설정 (선택사항)
운영환경에서는 환경변수로 API 키를 설정할 수 있습니다:
```bash
# 환경변수 설정
export NAVER_MAP_CLIENT_ID=your_production_client_id
export NAVER_MAP_CLIENT_SECRET=your_production_client_secret
```

### 3. 네이버 지도 API 키 발급

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/) 접속
2. 회원가입 및 로그인
3. Console > Services > AI·Application Service > Maps 선택
4. 새 프로젝트 생성 또는 기존 프로젝트 선택
5. Geocoding API 활성화
6. 인증 정보 생성

### 4. 백엔드 실행
```bash
# 로컬 프로파일로 실행 (application-local.properties 사용)
./gradlew bootRun --args='--spring.profiles.active=local'

# 또는 기본 실행 (환경변수 사용)
export NAVER_MAP_CLIENT_ID=your_client_id
export NAVER_MAP_CLIENT_SECRET=your_client_secret
./gradlew bootRun
```

### 5. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

## 사용 방법

1. 웹 브라우저에서 `http://localhost:3000` 접속
2. 지역 선택 및 검색 조건 설정
3. 실거래가 목록에서 "매물보기" 버튼 클릭
4. 새 탭에서 네이버 부동산 페이지 확인

## 보안 주의사항

⚠️ **중요**: 다음 파일들은 절대 깃허브에 업로드하지 마세요:
- `.env` (환경변수 파일)
- `application-local.properties` (로컬 설정 파일 - 실제 API 키 포함)
- `application-dev.properties`, `application-prod.properties` (서버 설정 파일)
- API 키가 포함된 모든 설정 파일

## 프로젝트 구조

```
├── src/main/java/com/w/p/
│   ├── controller/          # REST API 컨트롤러
│   ├── service/            # 비즈니스 로직
│   ├── dto/                # 데이터 전송 객체
│   └── common/             # 공통 유틸리티
├── src/main/resources/
│   ├── application.properties          # 기본 설정
│   └── application-local.properties    # 로컬 설정 (git 제외)
├── frontend/src/
│   ├── components/         # React 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── api/               # API 호출 함수
│   └── types/             # TypeScript 타입 정의
└── .gitignore             # Git 제외 파일 목록
```

## API 엔드포인트

### 실거래가 조회
- `GET /api/v1/apartment/trades` - 아파트 실거래가 목록 조회
- `GET /api/v1/apartment/recent-trades` - 최근 실거래가 조회

### 지도 연동
- `GET /api/v1/map/geocode` - 주소를 좌표로 변환

## 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
