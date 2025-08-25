package com.w.p.common.util;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

/**
 * 글로벌 공통 유틸리티 클래스
 * 포맷팅, 검증, 계산 등 다양한 공통 기능을 제공합니다.
 */
@Slf4j
public class GlobalUtil {

    // 정규식 패턴들
    private static final Pattern NUMERIC_PATTERN = Pattern.compile("\\d+");
    private static final Pattern DECIMAL_PATTERN = Pattern.compile("\\d+(\\.\\d+)?");
    private static final Pattern LAW_CD_PATTERN = Pattern.compile("\\d{5}");
    private static final Pattern DEAL_YMD_PATTERN = Pattern.compile("\\d{6}");
    
    // 상수들
    private static final BigDecimal PYEONG_TO_SQM = new BigDecimal("0.3025"); // 평을 제곱미터로 변환
    private static final BigDecimal WON_UNIT = new BigDecimal("10000"); // 만원 단위
    
    // 날짜 포맷터들
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 거래금액 포맷팅 (만원 단위 제거, 쉼표 추가)
     * @param dealAmount 거래금액 (만원 단위)
     * @return 포맷팅된 금액 문자열
     */
    public static String formatDealAmount(String dealAmount) {
        if (dealAmount == null || dealAmount.trim().isEmpty()) {
            return "0";
        }
        
        try {
            String cleanAmount = dealAmount.replaceAll("[^0-9]", "");
            if (cleanAmount.isEmpty()) {
                return "0";
            }
            
            long amount = Long.parseLong(cleanAmount) * 10000; // 만원 단위를 원 단위로
            return String.format("%,d", amount);
        } catch (NumberFormatException e) {
            log.warn("거래금액 파싱 실패: {}", dealAmount);
            return "0";
        }
    }

    /**
     * 거래일자 포맷팅 (YYYY-MM-DD)
     * @param year 년도
     * @param month 월
     * @param day 일
     * @return 포맷팅된 날짜 문자열
     */
    public static String formatDealDate(String year, String month, String day) {
        if (year == null || month == null || day == null) {
            return "";
        }
        
        try {
            int monthInt = Integer.parseInt(month.trim());
            int dayInt = Integer.parseInt(day.trim());
            
            if (monthInt < 1 || monthInt > 12) {
                log.warn("잘못된 월: {}", month);
                return "";
            }
            
            if (dayInt < 1 || dayInt > 31) {
                log.warn("잘못된 일: {}", day);
                return "";
            }
            
            return String.format("%s-%02d-%02d", year, monthInt, dayInt);
        } catch (NumberFormatException e) {
            log.warn("거래일자 파싱 실패: year={}, month={}, day={}", year, month, day);
            return "";
        }
    }

    /**
     * 평당 가격 계산
     * @param dealAmount 거래금액
     * @param exclusiveArea 전용면적
     * @return 평당 가격 문자열
     */
    public static String calculatePricePerPyeong(String dealAmount, String exclusiveArea) {
        try {
            String cleanAmount = dealAmount.replaceAll("[^0-9]", "");
            String cleanArea = exclusiveArea.replaceAll("[^0-9.]", "");
            
            if (cleanAmount.isEmpty() || cleanArea.isEmpty()) {
                return "0";
            }
            
            BigDecimal amount = new BigDecimal(cleanAmount).multiply(WON_UNIT);
            BigDecimal area = new BigDecimal(cleanArea).multiply(PYEONG_TO_SQM); // 제곱미터를 평으로 변환
            
            if (area.compareTo(BigDecimal.ZERO) == 0) {
                return "0";
            }
            
            BigDecimal pricePerPyeong = amount.divide(area, 0, RoundingMode.HALF_UP);
            
            return String.format("%,d", pricePerPyeong.longValue());
        } catch (Exception e) {
            log.warn("평당 가격 계산 실패: dealAmount={}, exclusiveArea={}", dealAmount, exclusiveArea);
            return "0";
        }
    }

    /**
     * 숫자만 추출
     * @param input 입력 문자열
     * @return 숫자만 포함된 문자열
     */
    public static String extractNumeric(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "";
        }
        return input.replaceAll("[^0-9]", "");
    }

    /**
     * 소수점이 있는 숫자 추출
     * @param input 입력 문자열
     * @return 소수점이 있는 숫자 문자열
     */
    public static String extractDecimal(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "";
        }
        return input.replaceAll("[^0-9.]", "");
    }

    /**
     * 법정동코드 검증
     * @param lawdCd 법정동코드
     * @return 유효성 여부
     */
    public static boolean isValidLawdCd(String lawdCd) {
        return lawdCd != null && LAW_CD_PATTERN.matcher(lawdCd).matches();
    }

    /**
     * 거래년월 검증
     * @param dealYmd 거래년월
     * @return 유효성 여부
     */
    public static boolean isValidDealYmd(String dealYmd) {
        return dealYmd != null && DEAL_YMD_PATTERN.matcher(dealYmd).matches();
    }

    /**
     * 숫자 검증
     * @param input 입력 문자열
     * @return 숫자 여부
     */
    public static boolean isNumeric(String input) {
        return input != null && NUMERIC_PATTERN.matcher(input).matches();
    }

    /**
     * 소수점이 있는 숫자 검증
     * @param input 입력 문자열
     * @return 소수점이 있는 숫자 여부
     */
    public static boolean isDecimal(String input) {
        return input != null && DECIMAL_PATTERN.matcher(input).matches();
    }

    /**
     * 빈 문자열 체크
     * @param input 입력 문자열
     * @return 빈 문자열 여부
     */
    public static boolean isEmpty(String input) {
        return input == null || input.trim().isEmpty();
    }

    /**
     * 빈 문자열이 아닌지 체크
     * @param input 입력 문자열
     * @return 빈 문자열이 아닌지 여부
     */
    public static boolean isNotEmpty(String input) {
        return !isEmpty(input);
    }

    /**
     * 현재 날짜를 YYYYMM 형식으로 반환
     * @return 현재 날짜 문자열
     */
    public static String getCurrentYearMonth() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
    }

    /**
     * 현재 날짜를 YYYY-MM-DD 형식으로 반환
     * @return 현재 날짜 문자열
     */
    public static String getCurrentDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    /**
     * 금액을 원 단위로 변환 (만원 -> 원)
     * @param amountInManwon 만원 단위 금액
     * @return 원 단위 금액
     */
    public static BigDecimal convertManwonToWon(String amountInManwon) {
        try {
            String cleanAmount = extractNumeric(amountInManwon);
            if (cleanAmount.isEmpty()) {
                return BigDecimal.ZERO;
            }
            return new BigDecimal(cleanAmount).multiply(WON_UNIT);
        } catch (Exception e) {
            log.warn("만원을 원으로 변환 실패: {}", amountInManwon);
            return BigDecimal.ZERO;
        }
    }

    /**
     * 제곱미터를 평으로 변환
     * @param squareMeters 제곱미터
     * @return 평
     */
    public static BigDecimal convertSqmToPyeong(String squareMeters) {
        try {
            String cleanArea = extractDecimal(squareMeters);
            if (cleanArea.isEmpty()) {
                return BigDecimal.ZERO;
            }
            return new BigDecimal(cleanArea).multiply(PYEONG_TO_SQM);
        } catch (Exception e) {
            log.warn("제곱미터를 평으로 변환 실패: {}", squareMeters);
            return BigDecimal.ZERO;
        }
    }

    /**
     * 안전한 Long 파싱
     * @param input 입력 문자열
     * @param defaultValue 기본값
     * @return 파싱된 Long 값 또는 기본값
     */
    public static Long parseLongSafe(String input, Long defaultValue) {
        try {
            String cleanInput = extractNumeric(input);
            return cleanInput.isEmpty() ? defaultValue : Long.parseLong(cleanInput);
        } catch (NumberFormatException e) {
            log.warn("Long 파싱 실패: {}", input);
            return defaultValue;
        }
    }

    /**
     * 안전한 Integer 파싱
     * @param input 입력 문자열
     * @param defaultValue 기본값
     * @return 파싱된 Integer 값 또는 기본값
     */
    public static Integer parseIntSafe(String input, Integer defaultValue) {
        try {
            String cleanInput = extractNumeric(input);
            return cleanInput.isEmpty() ? defaultValue : Integer.parseInt(cleanInput);
        } catch (NumberFormatException e) {
            log.warn("Integer 파싱 실패: {}", input);
            return defaultValue;
        }
    }

    /**
     * 안전한 BigDecimal 파싱
     * @param input 입력 문자열
     * @param defaultValue 기본값
     * @return 파싱된 BigDecimal 값 또는 기본값
     */
    public static BigDecimal parseBigDecimalSafe(String input, BigDecimal defaultValue) {
        try {
            String cleanInput = extractDecimal(input);
            return cleanInput.isEmpty() ? defaultValue : new BigDecimal(cleanInput);
        } catch (NumberFormatException e) {
            log.warn("BigDecimal 파싱 실패: {}", input);
            return defaultValue;
        }
    }

    /**
     * 민감한 정보 마스킹 (API 키, 비밀번호 등)
     * @param input 원본 문자열
     * @param pattern 마스킹할 패턴 (정규식)
     * @param replacement 마스킹 문자열
     * @return 마스킹된 문자열
     */
    public static String maskSensitiveInfo(String input, String pattern, String replacement) {
        if (input == null) {
            return null;
        }
        return input.replaceAll(pattern, replacement);
    }

    /**
     * API 키 마스킹 (serviceKey=*** 형태로)
     * @param url 원본 URL
     * @return 마스킹된 URL
     */
    public static String maskApiKey(String url) {
        return maskSensitiveInfo(url, "serviceKey=[^&]*", "serviceKey=***");
    }

    /**
     * 비밀번호 마스킹
     * @param password 원본 비밀번호
     * @return 마스킹된 비밀번호
     */
    public static String maskPassword(String password) {
        if (password == null || password.length() <= 2) {
            return "***";
        }
        return password.substring(0, 2) + "***";
    }

    /**
     * 전화번호 마스킹
     * @param phoneNumber 원본 전화번호
     * @return 마스킹된 전화번호
     */
    public static String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 4) {
            return "***";
        }
        return phoneNumber.substring(0, phoneNumber.length() - 4) + "****";
    }

    /**
     * 이메일 마스킹
     * @param email 원본 이메일
     * @return 마스킹된 이메일
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        String[] parts = email.split("@");
        if (parts[0].length() <= 2) {
            return "***@" + parts[1];
        }
        return parts[0].substring(0, 2) + "***@" + parts[1];
    }

    /**
     * 문자열 길이 제한
     * @param input 원본 문자열
     * @param maxLength 최대 길이
     * @return 제한된 문자열
     */
    public static String truncateString(String input, int maxLength) {
        if (input == null) {
            return null;
        }
        if (input.length() <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength) + "...";
    }

    /**
     * 숫자 포맷팅 (천 단위 쉼표)
     * @param number 숫자
     * @return 포맷팅된 문자열
     */
    public static String formatNumber(long number) {
        return String.format("%,d", number);
    }

    /**
     * 소수점 포맷팅
     * @param number 숫자
     * @param decimalPlaces 소수점 자릿수
     * @return 포맷팅된 문자열
     */
    public static String formatDecimal(double number, int decimalPlaces) {
        return String.format("%." + decimalPlaces + "f", number);
    }

    /**
     * 퍼센트 포맷팅
     * @param value 값 (0.0 ~ 1.0)
     * @return 퍼센트 문자열
     */
    public static String formatPercentage(double value) {
        return String.format("%.2f%%", value * 100);
    }

    /**
     * 파일 크기 포맷팅 (B, KB, MB, GB)
     * @param bytes 바이트
     * @return 포맷팅된 파일 크기
     */
    public static String formatFileSize(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        } else if (bytes < 1024 * 1024) {
            return String.format("%.1f KB", bytes / 1024.0);
        } else if (bytes < 1024 * 1024 * 1024) {
            return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
        } else {
            return String.format("%.1f GB", bytes / (1024.0 * 1024.0 * 1024.0));
        }
    }

    /**
     * 시간 포맷팅 (초 -> HH:MM:SS)
     * @param seconds 초
     * @return 포맷팅된 시간
     */
    public static String formatTime(long seconds) {
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long secs = seconds % 60;
        return String.format("%02d:%02d:%02d", hours, minutes, secs);
    }

    /**
     * 카드 번호 마스킹
     * @param cardNumber 카드 번호
     * @return 마스킹된 카드 번호
     */
    public static String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "***";
        }
        return cardNumber.substring(0, 4) + "-****-****-" + cardNumber.substring(cardNumber.length() - 4);
    }

    /**
     * 계좌번호 마스킹
     * @param accountNumber 계좌번호
     * @return 마스킹된 계좌번호
     */
    public static String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "***";
        }
        return accountNumber.substring(0, 4) + "-****-" + accountNumber.substring(accountNumber.length() - 4);
    }

    // ==================== 날짜 포맷팅 메서드들 ====================

    /**
     * LocalDateTime을 읽기 쉬운 문자열로 변환
     * 
     * @param dateTime 변환할 LocalDateTime
     * @return 포맷된 문자열 (yyyy-MM-dd HH:mm:ss)
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DATE_TIME_FORMATTER);
    }
    
    /**
     * LocalDateTime을 날짜만 문자열로 변환
     * 
     * @param dateTime 변환할 LocalDateTime
     * @return 포맷된 문자열 (yyyy-MM-dd)
     */
    public static String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DATE_FORMATTER);
    }
    
    /**
     * 문자열을 LocalDateTime으로 파싱
     * 
     * @param dateTimeStr 파싱할 문자열 (yyyy-MM-dd HH:mm:ss 형식)
     * @return LocalDateTime 객체
     */
    public static LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.trim().isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateTimeStr, DATE_TIME_FORMATTER);
    }
    
    /**
     * 문자열을 날짜만 LocalDateTime으로 파싱 (시간은 00:00:00으로 설정)
     * 
     * @param dateStr 파싱할 문자열 (yyyy-MM-dd 형식)
     * @return LocalDateTime 객체
     */
    public static LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateStr + " 00:00:00", DATE_TIME_FORMATTER);
    }
    
    /**
     * 현재 시간을 포맷된 문자열로 반환
     * 
     * @return 현재 시간 문자열 (yyyy-MM-dd HH:mm:ss)
     */
    public static String getCurrentDateTimeString() {
        return formatDateTime(LocalDateTime.now());
    }
    
    /**
     * 현재 날짜를 포맷된 문자열로 반환
     * 
     * @return 현재 날짜 문자열 (yyyy-MM-dd)
     */
    public static String getCurrentDateString() {
        return formatDate(LocalDateTime.now());
    }
}
