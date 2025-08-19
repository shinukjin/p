# 관리자 시스템 (백오피스)

홈페이지의 관리자 시스템으로, 백오피스 느낌의 관리 기능을 제공합니다.

## 🏗️ 시스템 구조

### 백엔드
- **User 엔티티**: 기존 User 엔티티에 role과 status 필드를 추가하여 관리자 기능 구현
- **AdminService**: 관리자 관련 비즈니스 로직 처리
- **AdminController**: 관리자 API 엔드포인트 제공
- **GlobalUtil**: 공통 유틸리티 클래스 (포맷팅, 검증, 마스킹 등)

### 프론트엔드
- **AdminLoginPage**: 관리자 로그인 페이지
- **AdminDashboardPage**: 관리자 대시보드 (통계, 차트)
- **AdminUserManagementPage**: 사용자 관리 페이지
- **AdminLayout**: 관리자 공통 레이아웃 (사이드바, 헤더)

## 👥 사용자 역할 (UserRole)

| 역할 | 설명 | 권한 |
|------|------|------|
| `SUPER_ADMIN` | 슈퍼관리자 | 모든 기능 접근 가능, 관리자 생성/삭제 |
| `ADMIN` | 일반관리자 | 사용자 관리, 데이터 조회/수정 |
| `OPERATOR` | 운영자 | 데이터 조회, 기본 관리 기능 |
| `USER` | 일반사용자 | 기본 서비스 이용 |

## 🔐 사용자 상태 (UserStatus)

| 상태 | 설명 |
|------|------|
| `ACTIVE` | 활성 - 정상 사용 가능 |
| `INACTIVE` | 비활성 - 일시적으로 사용 불가 |
| `LOCKED` | 잠금 - 보안상 사용 불가 |

## 🚀 주요 기능

### 1. 관리자 인증
- 관리자 전용 로그인
- JWT 토큰 기반 인증
- 역할별 권한 제어

### 2. 대시보드
- 사용자 통계 (총 사용자, 관리자 수)
- 서비스별 데이터 통계
- 방문자 통계 (일간/월간)
- 차트 시각화

### 3. 사용자 관리
- 사용자 목록 조회 (페이지네이션)
- 검색 및 필터링 (키워드, 역할, 상태)
- 사용자 상태 변경 (활성/비활성/잠금)
- 사용자 삭제 (슈퍼관리자만)

### 4. 보안 기능
- 민감한 정보 마스킹 (API 키, 비밀번호 등)
- 역할별 접근 제어
- 안전한 비밀번호 처리

## 📱 UI/UX 특징

### 백오피스 스타일
- 깔끔하고 전문적인 디자인
- 반응형 레이아웃 (모바일/데스크톱)
- 사이드바 네비게이션
- 카드 기반 정보 표시

### 사용자 경험
- 직관적인 메뉴 구조
- 실시간 데이터 업데이트
- 로딩 상태 및 에러 처리
- 확인 대화상자 (삭제 등)

## 🔧 API 엔드포인트

### 인증
- `POST /api/admin/login` - 관리자 로그인

### 사용자 관리
- `GET /api/admin/list` - 사용자 목록 조회
- `GET /api/admin/{id}` - 사용자 정보 조회
- `POST /api/admin` - 관리자 생성 (슈퍼관리자만)
- `PUT /api/admin/{id}` - 사용자 정보 수정
- `PUT /api/admin/{id}/password` - 비밀번호 변경
- `PUT /api/admin/{id}/status` - 상태 변경
- `DELETE /api/admin/{id}` - 사용자 삭제 (슈퍼관리자만)

### 대시보드
- `GET /api/admin/dashboard` - 통계 데이터 조회

## 🛠️ 설치 및 설정

### 1. 데이터베이스 마이그레이션
```sql
-- User 테이블에 새로운 컬럼 추가
ALTER TABLE WP_USERS ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE WP_USERS ADD COLUMN email VARCHAR(100) UNIQUE NOT NULL DEFAULT '';
ALTER TABLE WP_USERS ADD COLUMN phone VARCHAR(20);
ALTER TABLE WP_USERS ADD COLUMN role ENUM('SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'USER') NOT NULL DEFAULT 'USER';
ALTER TABLE WP_USERS ADD COLUMN status ENUM('ACTIVE', 'INACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE WP_USERS ADD COLUMN last_login_at DATETIME;
ALTER TABLE WP_USERS ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE WP_USERS ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

### 2. 초기 슈퍼관리자 생성
```sql
INSERT INTO WP_USERS (username, password, name, email, role, status) 
VALUES ('admin', '$2a$10$encoded_password', '시스템관리자', 'admin@example.com', 'SUPER_ADMIN', 'ACTIVE');
```

### 3. Spring Security 설정
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/admin/login").permitAll()
                .requestMatchers("/api/admin/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "OPERATOR")
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
        return http.build();
    }
}
```

## 📊 사용 예시

### 1. 관리자 로그인
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### 2. 사용자 목록 조회
```bash
curl -X GET "http://localhost:8080/api/admin/list?page=1&size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. 사용자 상태 변경
```bash
curl -X PUT "http://localhost:8080/api/admin/1/status?status=INACTIVE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 보안 고려사항

1. **JWT 토큰 관리**: 토큰 만료 시간 설정 및 안전한 저장
2. **비밀번호 정책**: 강력한 비밀번호 요구사항 적용
3. **로그 감사**: 모든 관리자 작업 로깅
4. **세션 관리**: 비정상적인 로그인 시도 감지
5. **데이터 검증**: 입력값 검증 및 SQL 인젝션 방지

## 🚨 주의사항

1. **슈퍼관리자 계정**: 시스템 초기 설정 후 반드시 비밀번호 변경
2. **백업**: 사용자 데이터 정기 백업
3. **모니터링**: 시스템 로그 및 성능 모니터링
4. **업데이트**: 보안 패치 및 시스템 업데이트

## 📈 향후 확장 계획

1. **감사 로그**: 모든 관리자 작업 기록 및 조회
2. **백업/복원**: 데이터베이스 백업 및 복원 기능
3. **알림 시스템**: 중요 이벤트 발생 시 알림
4. **API 문서**: Swagger/OpenAPI 문서화
5. **테스트 코드**: 단위 테스트 및 통합 테스트 추가

## 🤝 기여 방법

1. 이슈 리포트 작성
2. 기능 요청 제안
3. 코드 리뷰 참여
4. 문서 개선 제안

## 📞 지원

문제가 발생하거나 질문이 있으시면:
- GitHub Issues에 이슈 등록
- 프로젝트 담당자에게 문의
- 개발팀 내부 채널 활용
