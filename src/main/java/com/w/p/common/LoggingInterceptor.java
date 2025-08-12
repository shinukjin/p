package com.w.p.common;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * API 요청/응답 로깅 인터셉터
 */
@Component
@Slf4j
public class LoggingInterceptor implements HandlerInterceptor {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";
    private static final String START_TIME_ATTR = "startTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        
        // 요청 ID 생성 및 설정
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        request.setAttribute(REQUEST_ID_HEADER, requestId);
        response.setHeader(REQUEST_ID_HEADER, requestId);
        
        // 시작 시간 기록
        request.setAttribute(START_TIME_ATTR, System.currentTimeMillis());
        
        // 요청 정보 로깅
        logRequest(request, requestId);
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        
        String requestId = (String) request.getAttribute(REQUEST_ID_HEADER);
        Long startTime = (Long) request.getAttribute(START_TIME_ATTR);
        long duration = System.currentTimeMillis() - startTime;
        
        // 응답 정보 로깅
        logResponse(request, response, requestId, duration, ex);
    }

    private void logRequest(HttpServletRequest request, String requestId) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String clientIp = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        
        StringBuilder logMessage = new StringBuilder();
        logMessage.append("[REQUEST] ")
                  .append("ID: ").append(requestId)
                  .append(" | Method: ").append(method)
                  .append(" | URI: ").append(uri);
        
        if (queryString != null) {
            logMessage.append("?").append(queryString);
        }
        
        logMessage.append(" | IP: ").append(clientIp)
                  .append(" | User-Agent: ").append(userAgent);
        
        log.info(logMessage.toString());
        
        // 요청 바디 로깅 (POST, PUT, PATCH의 경우)
        if (isLoggableMethod(method)) {
            logRequestBody(request, requestId);
        }
    }

    private void logResponse(HttpServletRequest request, HttpServletResponse response, 
                           String requestId, long duration, Exception ex) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int status = response.getStatus();
        
        StringBuilder logMessage = new StringBuilder();
        logMessage.append("[RESPONSE] ")
                  .append("ID: ").append(requestId)
                  .append(" | Method: ").append(method)
                  .append(" | URI: ").append(uri)
                  .append(" | Status: ").append(status)
                  .append(" | Duration: ").append(duration).append("ms");
        
        if (ex != null) {
            logMessage.append(" | Exception: ").append(ex.getClass().getSimpleName())
                     .append(" - ").append(ex.getMessage());
            log.error(logMessage.toString());
        } else if (status >= 400) {
            log.warn(logMessage.toString());
        } else {
            log.info(logMessage.toString());
        }
        
        // 응답 바디 로깅 (에러 상태인 경우)
        if (status >= 400) {
            logResponseBody(response, requestId);
        }
    }

    private void logRequestBody(HttpServletRequest request, String requestId) {
        if (request instanceof ContentCachingRequestWrapper) {
            ContentCachingRequestWrapper wrapper = (ContentCachingRequestWrapper) request;
            byte[] content = wrapper.getContentAsByteArray();
            if (content.length > 0) {
                String body = new String(content);
                log.info("[REQUEST BODY] ID: {} | Body: {}", requestId, body);
            }
        }
    }

    private void logResponseBody(HttpServletResponse response, String requestId) {
        if (response instanceof ContentCachingResponseWrapper) {
            ContentCachingResponseWrapper wrapper = (ContentCachingResponseWrapper) response;
            byte[] content = wrapper.getContentAsByteArray();
            if (content.length > 0) {
                String body = new String(content);
                log.info("[RESPONSE BODY] ID: {} | Body: {}", requestId, body);
                try {
                    wrapper.copyBodyToResponse();
                } catch (IOException e) {
                    log.error("Error copying response body", e);
                }
            }
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private boolean isLoggableMethod(String method) {
        return "POST".equals(method) || "PUT".equals(method) || "PATCH".equals(method);
    }
}
