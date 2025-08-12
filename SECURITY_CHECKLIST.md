# 보안 체크리스트

## ✅ 완료된 보안 설정

### 1. API 키 보호
- [x] `application.properties`에서 실제 API 키 제거
- [x] `application-local.properties`에 실제 키 값 분리
- [x] 로컬 설정 파일을 `.gitignore`에 포함하여 깃허브 업로드 방지

### 2. .gitignore 설정
- [x] 루트 `.gitignore`에 보안 관련 파일 추가
- [x] 프론트엔드 `.gitignore`에 환경변수 파일 추가
- [x] 로그 파일, 임시 파일, 백업 파일 제외

### 3. 환경변수 설정 가이드
- [x] `.env.example` 파일 생성 (실제 값 없이 템플릿만)
- [x] `README.md`에 설정 방법 안내
- [x] 개발자를 위한 상세 가이드 작성

### 4. 코드에서 민감 정보 제거
- [x] 하드코딩된 API 키 제거
- [x] 디버그 로그에서 민감 정보 제거
- [x] 기본값에서 실제 키 값 제거

## 🔒 보호되는 파일들

다음 파일들은 `.gitignore`에 의해 깃허브에 업로드되지 않습니다:

### 환경변수 파일
- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.test`

### 설정 파일
- `**/application-local.properties` (로컬 개발용)
- `**/application-dev.properties` (개발서버용)
- `**/application-prod.properties` (운영서버용)

### 기타 민감 파일
- `*.log` (로그 파일)
- `*.db`, `*.sqlite` (데이터베이스 파일)
- `*.bak`, `*.backup` (백업 파일)
- `config/local.json`, `config/secrets.json`

## 📋 배포 시 체크리스트

### 개발 환경 설정
1. [ ] `application-local.properties.example`을 복사하여 `application-local.properties` 생성
2. [ ] `application-local.properties`에 실제 API 키 입력
3. [ ] `--spring.profiles.active=local` 옵션으로 애플리케이션 실행

### 운영 환경 설정
1. [ ] 서버 환경변수에 API 키 설정
2. [ ] 네이버 클라우드 플랫폼에서 운영 도메인 등록
3. [ ] HTTPS 설정 확인
4. [ ] API 사용량 모니터링 설정

## ⚠️ 주의사항

### 절대 깃허브에 올리면 안 되는 것들
- 실제 API 키 값
- 데이터베이스 비밀번호
- JWT 시크릿 키
- 개인정보가 포함된 로그 파일
- 운영 서버 설정 정보

### 실수로 올렸을 때 대처 방법
1. 즉시 API 키 재발급
2. Git 히스토리에서 완전 제거
3. 새로운 키로 환경변수 업데이트

## 🛡️ 추가 보안 권장사항

### API 키 관리
- 정기적인 API 키 로테이션
- 최소 권한 원칙 적용
- API 사용량 모니터링

### 코드 보안
- 정기적인 의존성 취약점 검사
- 코드 리뷰 시 보안 체크
- 민감 정보 하드코딩 금지

### 인프라 보안
- HTTPS 강제 사용
- CORS 설정 검토
- 방화벽 규칙 설정

## 🚀 사용 방법

### 로컬 개발
- `application-local.properties` 파일에 API 키 설정
- `./gradlew bootRun --args='--spring.profiles.active=local'` 명령어로 실행

### 운영 배포
- 서버 환경변수에 운영용 API 키 설정
- `export NAVER_MAP_CLIENT_ID=운영용키`
- `export NAVER_MAP_CLIENT_SECRET=운영용시크릿`

### Git 관리
- `application-local.properties`는 `.gitignore`로 제외 (실제 키 포함)
- `application-local.properties.example`은 깃허브에 포함 (템플릿만)
- 운영용 키는 환경변수로 분리 (비공개)
