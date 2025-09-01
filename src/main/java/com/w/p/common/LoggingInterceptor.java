package com.w.p.common;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import com.w.p.entity.ApiLog;
import com.w.p.service.ApiLogService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * API 요청/응답 로깅 인터셉터
 */
@Component
@Slf4j
public class LoggingInterceptor implements HandlerInterceptor {

    private ApiLogService apiLogService;

    public LoggingInterceptor() {
        // 기본 생성자
    }

    @Autowired
    public void setApiLogService(ApiLogService apiLogService) {
        this.apiLogService = apiLogService;
    }

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
        
        // 로그 조회 API는 로깅하지 않음 (무한 루프 방지)
        String uri = request.getRequestURI();
        if (uri.contains("/admin/logs") || uri.contains("/logs")) {
            return;
        }
        
        String requestId = (String) request.getAttribute(REQUEST_ID_HEADER);
        Long startTime = (Long) request.getAttribute(START_TIME_ATTR);
        long duration = System.currentTimeMillis() - startTime;
        
        // 응답 정보 로깅
        logResponse(request, response, requestId, duration, ex);
        
        // API 로그를 DB에 저장
        saveApiLogToDatabase(request, response, requestId, duration, ex);
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
                try {
                    // UTF-8 인코딩으로 문자열 변환
                    String body = new String(content, "UTF-8");
                    log.info("[REQUEST BODY] ID: {} | Body: {}", requestId, body);
                } catch (Exception e) {
                    log.warn("요청 본문 인코딩 변환 실패: {}", e.getMessage());
                }
            }
        }
    }

    private void logResponseBody(HttpServletResponse response, String requestId) {
        if (response instanceof ContentCachingResponseWrapper) {
            ContentCachingResponseWrapper wrapper = (ContentCachingResponseWrapper) response;
            byte[] content = wrapper.getContentAsByteArray();
            if (content.length > 0) {
                try {
                    // UTF-8 인코딩으로 문자열 변환
                    String body = new String(content, "UTF-8");
                    log.info("[RESPONSE BODY] ID: {} | Body: {}", requestId, body);
                } catch (Exception e) {
                    log.warn("응답 본문 인코딩 변환 실패: {}", e.getMessage());
                }
                
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
    
    /**
     * API 로그를 데이터베이스에 저장
     */
    private void saveApiLogToDatabase(HttpServletRequest request, HttpServletResponse response, 
                                    String requestId, long duration, Exception ex) {
        try {
            // ApiLogService가 초기화되지 않은 경우 스킵
            if (apiLogService == null) {
                log.debug("ApiLogService가 아직 초기화되지 않았습니다. 로그 저장을 건너뜁니다.");
                return;
            }
            
            // 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = null;
            String username = "anonymous";
            
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getName())) {
                try {
                    username = authentication.getName();
                    // userId는 별도로 추출해야 할 수 있습니다
                } catch (Exception e) {
                    log.warn("사용자 정보 추출 실패: {}", e.getMessage());
                }
            }
            
            // 로그 레벨 결정
            ApiLog.LogLevel logLevel = ApiLog.LogLevel.INFO;
            if (ex != null) {
                logLevel = ApiLog.LogLevel.ERROR;
            } else if (response.getStatus() >= 400) {
                logLevel = ApiLog.LogLevel.WARNING;
            }
            
            // 에러 메시지 생성
            String errorMessage = null;
            if (ex != null) {
                errorMessage = String.format("[%s] %s: %s", 
                    ex.getClass().getSimpleName(), 
                    ex.getMessage() != null ? ex.getMessage() : "Unknown error",
                    ex.getCause() != null ? "Caused by: " + ex.getCause().getMessage() : ""
                ).trim();
            } else if (response.getStatus() >= 400) {
                errorMessage = String.format("HTTP %d Error", response.getStatus());
            }
            
            // API 로그 생성
            ApiLog apiLog = ApiLog.builder()
                .userId(userId)
                .username(username)
                .endpoint(request.getRequestURI())
                .method(request.getMethod())
                .requestBody(getRequestBodyForLog(request))
                .queryParameters(request.getQueryString())
                .responseStatus(response.getStatus())
                .errorMessage(errorMessage)
                .executionTime(duration)
                .ipAddress(getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .logLevel(logLevel)
                .build();
            
            // 로그 저장 (비동기로 처리하는 것이 좋습니다)
            apiLogService.saveLog(apiLog);
            
        } catch (Exception e) {
            log.error("API 로그 저장 실패: {}", e.getMessage(), e);
        }
    }
    
    /**
     * 로그 저장용 요청 본문 추출
     */
    private String getRequestBodyForLog(HttpServletRequest request) {
        try {
            if (request instanceof ContentCachingRequestWrapper) {
                ContentCachingRequestWrapper wrapper = (ContentCachingRequestWrapper) request;
                byte[] content = wrapper.getContentAsByteArray();
                if (content.length > 0) {
                    // UTF-8 인코딩으로 문자열 변환
                    return new String(content, "UTF-8");
                }
            }
            return null;
        } catch (Exception e) {
            log.warn("요청 본문 로그 추출 실패: {}", e.getMessage());
            return null;
        }
    }
    

}
