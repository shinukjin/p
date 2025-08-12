# 네이버 지도 연동 설정 가이드

## 개요
실거래가 조회 화면에 매물보기 버튼이 추가되어 네이버 지도에서 매물 위치를 확인할 수 있습니다.

## 주요 기능
- 실거래가 목록에서 매물보기 버튼 클릭
- 주소를 좌표로 변환 (지오코딩)
- 새 탭으로 네이버 지도 열기
- 매물 위치에 마커 표시

## 설정 방법

### 1. 네이버 클라우드 플랫폼 API 키 발급

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/) 접속
2. 회원가입 및 로그인
3. Console > Services > AI·Application Service > Maps 선택
4. 새 프로젝트 생성 또는 기존 프로젝트 선택
5. Maps API 활성화
6. 인증 정보 생성:
   - Application 이름 입력
   - Service 선택: Geocoding
   - HTTP Referer 설정 (개발환경: `http://localhost:8080/*`)

### 2. 백엔드 설정

`src/main/resources/application.properties` 파일에 API 키 설정:

```properties
# 네이버 지도 API 설정
naver.map.client-id=YOUR_CLIENT_ID_HERE
naver.map.client-secret=YOUR_CLIENT_SECRET_HERE
```

### 3. 프론트엔드 설정

별도 설정 불필요 (백엔드에서 지오코딩 처리)

## 파일 구조

### 백엔드
```
src/main/java/com/w/p/
├── controller/api/v1/map/
│   └── MapController.java              # 지도 관련 API 컨트롤러
├── service/map/
│   ├── MapService.java                 # 지도 서비스 인터페이스
│   └── impl/MapServiceImpl.java        # 지도 서비스 구현체
└── dto/map/
    └── MapDTO.java                     # 지도 관련 DTO
```

### 프론트엔드
```
frontend/src/
├── api/
│   └── map.ts                          # 지도 관련 API 함수 및 URL 생성
└── pages/
    └── ApartmentTradesPage.tsx         # 실거래가 페이지 (매물보기 버튼 추가)
```

## API 엔드포인트

### 지오코딩
- **GET** `/api/v1/map/geocode?address={주소}`
- 주소를 좌표로 변환

## 사용 방법

1. 실거래가 조회 페이지에서 원하는 매물의 "매물보기" 버튼 클릭
2. 새 탭으로 네이버 지도가 열리며 해당 매물의 위치가 표시됨
3. 지도에서 매물 마커와 정보 확인 가능

## 동작 방식

1. **좌표 변환 성공 시**: 정확한 좌표로 네이버 지도 열기
2. **좌표 변환 실패 시**: 주소로 네이버 지도 검색
3. **API 오류 시**: 기본 주소로 네이버 지도 검색

## 주의사항

1. **API 키 보안**:
   - 클라이언트 시크릿은 백엔드에서만 사용
   - HTTP Referer 제한 설정 권장

2. **API 사용량 제한**:
   - 네이버 클라우드 플랫폼의 무료 사용량 확인
   - 필요시 유료 플랜 고려

## 개발 시 임시 동작

API 키가 설정되지 않은 경우에도 개발을 위해 임시 좌표를 반환하도록 구현되어 있습니다:
- 지오코딩: 서울 중심 근처의 랜덤 좌표 반환
- 네이버 지도: 임시 좌표로 지도 열기

## 문제 해결

### 지도가 열리지 않는 경우
1. 팝업 차단 설정 확인
2. 백엔드 서버 실행 상태 확인
3. API 키 설정 확인
4. 브라우저 개발자 도구에서 네트워크 탭 확인
