package com.w.p.common.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

/**
 * GlobalUtil 클래스 테스트
 */
class GlobalUtilTest {

    @Test
    void testFormatDealAmount() {
        assertEquals("85,000,000", GlobalUtil.formatDealAmount("85,000"));
        assertEquals("92,000,000", GlobalUtil.formatDealAmount("92,000"));
        assertEquals("0", GlobalUtil.formatDealAmount(""));
        assertEquals("0", GlobalUtil.formatDealAmount(null));
        assertEquals("0", GlobalUtil.formatDealAmount("invalid"));
    }

    @Test
    void testFormatDealDate() {
        assertEquals("2025-12-15", GlobalUtil.formatDealDate("2025", "12", "15"));
        assertEquals("2025-01-01", GlobalUtil.formatDealDate("2025", "1", "1"));
        assertEquals("", GlobalUtil.formatDealDate("2025", "13", "15")); // 잘못된 월
        assertEquals("", GlobalUtil.formatDealDate("2025", "12", "32")); // 잘못된 일
        assertEquals("", GlobalUtil.formatDealDate(null, "12", "15"));
    }

    @Test
    void testCalculatePricePerPyeong() {
        assertEquals("1,000,000", GlobalUtil.calculatePricePerPyeong("100,000", "30.25"));
        assertEquals("0", GlobalUtil.calculatePricePerPyeong("", "30.25"));
        assertEquals("0", GlobalUtil.calculatePricePerPyeong("100,000", ""));
    }

    @Test
    void testExtractNumeric() {
        assertEquals("12345", GlobalUtil.extractNumeric("abc123def45"));
        assertEquals("", GlobalUtil.extractNumeric(""));
        assertEquals("", GlobalUtil.extractNumeric(null));
        assertEquals("", GlobalUtil.extractNumeric("abc"));
    }

    @Test
    void testExtractDecimal() {
        assertEquals("123.45", GlobalUtil.extractDecimal("abc123.45def"));
        assertEquals("", GlobalUtil.extractDecimal(""));
        assertEquals("", GlobalUtil.extractDecimal(null));
        assertEquals("", GlobalUtil.extractDecimal("abc"));
    }

    @Test
    void testIsValidLawdCd() {
        assertTrue(GlobalUtil.isValidLawdCd("12345"));
        assertFalse(GlobalUtil.isValidLawdCd("1234"));
        assertFalse(GlobalUtil.isValidLawdCd("123456"));
        assertFalse(GlobalUtil.isValidLawdCd("abcde"));
        assertFalse(GlobalUtil.isValidLawdCd(""));
        assertFalse(GlobalUtil.isValidLawdCd(null));
    }

    @Test
    void testIsValidDealYmd() {
        assertTrue(GlobalUtil.isValidDealYmd("202512"));
        assertFalse(GlobalUtil.isValidDealYmd("20251"));
        assertFalse(GlobalUtil.isValidDealYmd("2025123"));
        assertFalse(GlobalUtil.isValidDealYmd("abc"));
        assertFalse(GlobalUtil.isValidDealYmd(""));
        assertFalse(GlobalUtil.isValidDealYmd(null));
    }

    @Test
    void testIsNumeric() {
        assertTrue(GlobalUtil.isNumeric("12345"));
        assertFalse(GlobalUtil.isNumeric("123.45"));
        assertFalse(GlobalUtil.isNumeric("abc"));
        assertFalse(GlobalUtil.isNumeric(""));
        assertFalse(GlobalUtil.isNumeric(null));
    }

    @Test
    void testIsDecimal() {
        assertTrue(GlobalUtil.isDecimal("123.45"));
        assertTrue(GlobalUtil.isDecimal("123"));
        assertFalse(GlobalUtil.isDecimal("abc"));
        assertFalse(GlobalUtil.isDecimal(""));
        assertFalse(GlobalUtil.isDecimal(null));
    }

    @Test
    void testIsEmpty() {
        assertTrue(GlobalUtil.isEmpty(""));
        assertTrue(GlobalUtil.isEmpty("   "));
        assertTrue(GlobalUtil.isEmpty(null));
        assertFalse(GlobalUtil.isEmpty("hello"));
    }

    @Test
    void testIsNotEmpty() {
        assertFalse(GlobalUtil.isNotEmpty(""));
        assertFalse(GlobalUtil.isNotEmpty("   "));
        assertFalse(GlobalUtil.isNotEmpty(null));
        assertTrue(GlobalUtil.isNotEmpty("hello"));
    }

    @Test
    void testMaskApiKey() {
        String url = "http://api.example.com?serviceKey=abc123&param=value";
        String masked = GlobalUtil.maskApiKey(url);
        assertEquals("http://api.example.com?serviceKey=***&param=value", masked);
    }

    @Test
    void testMaskPassword() {
        assertEquals("***", GlobalUtil.maskPassword(""));
        assertEquals("***", GlobalUtil.maskPassword("a"));
        assertEquals("ab***", GlobalUtil.maskPassword("abc"));
        assertEquals("ab***", GlobalUtil.maskPassword("abcdef"));
    }

    @Test
    void testMaskPhoneNumber() {
        assertEquals("***", GlobalUtil.maskPhoneNumber(""));
        assertEquals("***", GlobalUtil.maskPhoneNumber("123"));
        assertEquals("1****", GlobalUtil.maskPhoneNumber("12345"));
        assertEquals("123****", GlobalUtil.maskPhoneNumber("1234567"));
    }

    @Test
    void testMaskEmail() {
        assertEquals("***", GlobalUtil.maskEmail(""));
        assertEquals("***", GlobalUtil.maskEmail("a@b.com"));
        assertEquals("ab***@b.com", GlobalUtil.maskEmail("abc@b.com"));
        assertEquals("ab***@example.com", GlobalUtil.maskEmail("abcdef@example.com"));
    }

    @Test
    void testTruncateString() {
        assertEquals("hello", GlobalUtil.truncateString("hello", 10));
        assertEquals("hello...", GlobalUtil.truncateString("hello world", 5));
        assertNull(GlobalUtil.truncateString(null, 5));
    }

    @Test
    void testFormatNumber() {
        assertEquals("1,234", GlobalUtil.formatNumber(1234));
        assertEquals("1,234,567", GlobalUtil.formatNumber(1234567));
    }

    @Test
    void testFormatDecimal() {
        assertEquals("123.46", GlobalUtil.formatDecimal(123.456, 2));
        assertEquals("123.5", GlobalUtil.formatDecimal(123.456, 1));
    }

    @Test
    void testFormatPercentage() {
        assertEquals("12.34%", GlobalUtil.formatPercentage(0.1234));
        assertEquals("100.00%", GlobalUtil.formatPercentage(1.0));
    }

    @Test
    void testFormatFileSize() {
        assertEquals("1024 B", GlobalUtil.formatFileSize(1024));
        assertEquals("1.0 KB", GlobalUtil.formatFileSize(1025));
        assertEquals("1.0 MB", GlobalUtil.formatFileSize(1024 * 1024));
    }

    @Test
    void testFormatTime() {
        assertEquals("00:01:30", GlobalUtil.formatTime(90));
        assertEquals("01:00:00", GlobalUtil.formatTime(3600));
        assertEquals("01:30:45", GlobalUtil.formatTime(5445));
    }

    @Test
    void testMaskCardNumber() {
        assertEquals("1234-****-****-5678", GlobalUtil.maskCardNumber("1234567890125678"));
        assertEquals("***", GlobalUtil.maskCardNumber("123"));
    }

    @Test
    void testMaskAccountNumber() {
        assertEquals("1234-****-5678", GlobalUtil.maskAccountNumber("1234567890125678"));
        assertEquals("***", GlobalUtil.maskAccountNumber("123"));
    }

    @Test
    void testConvertManwonToWon() {
        assertEquals(new BigDecimal("100000"), GlobalUtil.convertManwonToWon("10"));
        assertEquals(new BigDecimal("1000000"), GlobalUtil.convertManwonToWon("100"));
        assertEquals(BigDecimal.ZERO, GlobalUtil.convertManwonToWon(""));
        assertEquals(BigDecimal.ZERO, GlobalUtil.convertManwonToWon("invalid"));
    }

    @Test
    void testConvertSqmToPyeong() {
        assertEquals(new BigDecimal("30.25"), GlobalUtil.convertSqmToPyeong("100"));
        assertEquals(BigDecimal.ZERO, GlobalUtil.convertSqmToPyeong(""));
        assertEquals(BigDecimal.ZERO, GlobalUtil.convertSqmToPyeong("invalid"));
    }

    @Test
    void testParseLongSafe() {
        assertEquals(Long.valueOf(123), GlobalUtil.parseLongSafe("123", 0L));
        assertEquals(Long.valueOf(0), GlobalUtil.parseLongSafe("", 0L));
        assertEquals(Long.valueOf(0), GlobalUtil.parseLongSafe("invalid", 0L));
    }

    @Test
    void testParseIntSafe() {
        assertEquals(Integer.valueOf(123), GlobalUtil.parseIntSafe("123", 0));
        assertEquals(Integer.valueOf(0), GlobalUtil.parseIntSafe("", 0));
        assertEquals(Integer.valueOf(0), GlobalUtil.parseIntSafe("invalid", 0));
    }

    @Test
    void testParseBigDecimalSafe() {
        assertEquals(new BigDecimal("123.45"), GlobalUtil.parseBigDecimalSafe("123.45", BigDecimal.ZERO));
        assertEquals(BigDecimal.ZERO, GlobalUtil.parseBigDecimalSafe("", BigDecimal.ZERO));
        assertEquals(BigDecimal.ZERO, GlobalUtil.parseBigDecimalSafe("invalid", BigDecimal.ZERO));
    }
}
