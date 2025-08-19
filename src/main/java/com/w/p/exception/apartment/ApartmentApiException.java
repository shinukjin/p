package com.w.p.exception.apartment;

/**
 * 아파트 API 관련 예외 클래스
 */
public class ApartmentApiException extends RuntimeException {

    public ApartmentApiException(String message) {
        super(message);
    }

    public ApartmentApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
