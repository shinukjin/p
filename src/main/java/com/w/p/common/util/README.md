# GlobalUtil 클래스

프로젝트 전반에서 사용할 수 있는 글로벌 공통 유틸리티 클래스입니다.

## 주요 기능

### 1. 포맷팅 유틸리티
- **거래금액 포맷팅**: `formatDealAmount(String dealAmount)` - 만원 단위를 원 단위로 변환하고 천 단위 쉼표 추가
- **거래일자 포맷팅**: `formatDealDate(String year, String month, String day)` - YYYY-MM-DD 형식으로 변환
- **평당 가격 계산**: `calculatePricePerPyeong(String dealAmount, String exclusiveArea)` - 평당 가격 계산 및 포맷팅
- **숫자 포맷팅**: `formatNumber(long number)` - 천 단위 쉼표 추가
- **소수점 포맷팅**: `formatDecimal(double number, int decimalPlaces)` - 소수점 자릿수 지정
- **퍼센트 포맷팅**: `formatPercentage(double value)` - 퍼센트 형식으로 변환
- **파일 크기 포맷팅**: `formatFileSize(long bytes)` - B, KB, MB, GB 단위로 변환
- **시간 포맷팅**: `formatTime(long seconds)` - HH:MM:SS 형식으로 변환

### 2. 검증 유틸리티
- **법정동코드 검증**: `isValidLawdCd(String lawdCd)` - 5자리 숫자 검증
- **거래년월 검증**: `isValidDealYmd(String dealYmd)` - 6자리 숫자 검증
- **숫자 검증**: `isNumeric(String input)` - 정수 검증
- **소수점 검증**: `isDecimal(String input)` - 소수점이 있는 숫자 검증
- **빈 문자열 검증**: `isEmpty(String input)`, `isNotEmpty(String input)`

### 3. 데이터 추출 유틸리티
- **숫자 추출**: `extractNumeric(String input)` - 문자열에서 숫자만 추출
- **소수점 추출**: `extractDecimal(String input)` - 문자열에서 소수점이 있는 숫자 추출

### 4. 변환 유틸리티
- **만원 → 원 변환**: `convertManwonToWon(String amountInManwon)` - 만원 단위를 원 단위로 변환
- **제곱미터 → 평 변환**: `convertSqmToPyeong(String squareMeters)` - 제곱미터를 평으로 변환
- **안전한 파싱**: `parseLongSafe()`, `parseIntSafe()`, `parseBigDecimalSafe()` - 예외 발생 시 기본값 반환

### 5. 마스킹 유틸리티
- **API 키 마스킹**: `maskApiKey(String url)` - serviceKey=*** 형태로 마스킹
- **비밀번호 마스킹**: `maskPassword(String password)` - 앞 2자리만 노출
- **전화번호 마스킹**: `maskPhoneNumber(String phoneNumber)` - 뒷 4자리 마스킹
- **이메일 마스킹**: `maskEmail(String email)` - 앞 2자리만 노출
- **카드번호 마스킹**: `maskCardNumber(String cardNumber)` - 중간 부분 마스킹
- **계좌번호 마스킹**: `maskAccountNumber(String accountNumber)` - 중간 부분 마스킹

### 6. 기타 유틸리티
- **문자열 길이 제한**: `truncateString(String input, int maxLength)` - 최대 길이 제한 및 "..." 추가
- **현재 날짜**: `getCurrentYearMonth()`, `getCurrentDate()` - 현재 날짜를 다양한 형식으로 반환

## 사용 예시

```java
import com.w.p.common.util.GlobalUtil;

// 거래금액 포맷팅
String formattedAmount = GlobalUtil.formatDealAmount("85,000"); // "85,000,000"

// 거래일자 포맷팅
String formattedDate = GlobalUtil.formatDealDate("2025", "12", "15"); // "2025-12-15"

// 평당 가격 계산
String pricePerPyeong = GlobalUtil.calculatePricePerPyeong("100,000", "30.25"); // "1,000,000"

// 검증
boolean isValidLawdCd = GlobalUtil.isValidLawdCd("12345"); // true
boolean isEmpty = GlobalUtil.isEmpty(""); // true

// 마스킹
String maskedUrl = GlobalUtil.maskApiKey("http://api.com?serviceKey=abc123"); // "http://api.com?serviceKey=***"
String maskedPhone = GlobalUtil.maskPhoneNumber("01012345678"); // "0101234****"

// 변환
BigDecimal won = GlobalUtil.convertManwonToWon("100"); // 1000000
BigDecimal pyeong = GlobalUtil.convertSqmToPyeong("100"); // 30.25

// 안전한 파싱
Long number = GlobalUtil.parseLongSafe("123", 0L); // 123
Long defaultNumber = GlobalUtil.parseLongSafe("invalid", 0L); // 0
```

## 장점

1. **코드 중복 제거**: 여러 서비스에서 반복되는 포맷팅 로직을 중앙화
2. **일관성 보장**: 동일한 포맷팅 규칙을 프로젝트 전반에 적용
3. **유지보수성 향상**: 포맷팅 로직 변경 시 한 곳에서만 수정
4. **테스트 용이성**: 각 유틸리티 메서드를 독립적으로 테스트 가능
5. **재사용성**: 새로운 서비스나 컴포넌트에서 쉽게 활용 가능

## 주의사항

- 모든 메서드는 `null` 안전하게 설계되어 있습니다
- 예외 발생 시 적절한 기본값을 반환합니다
- 로깅을 통해 디버깅 정보를 제공합니다
- 정규식 패턴은 상수로 정의되어 성능을 최적화했습니다
