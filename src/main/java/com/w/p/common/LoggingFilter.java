package com.w.p.common;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 요청/응답 바디를 캐싱하여 로깅할 수 있도록 하는 필터
 */
@Component
public class LoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // API 경로만 로깅 대상으로 설정
        if (isLoggableRequest(request)) {
            ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
            ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);
            
            try {
                filterChain.doFilter(requestWrapper, responseWrapper);
            } finally {
                responseWrapper.copyBodyToResponse();
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private boolean isLoggableRequest(HttpServletRequest request) {
        String uri = request.getRequestURI();
        
        // API 경로만 로깅
        if (uri.startsWith("/api/")) {
            return true;
        }
        
        // 정적 리소스, 헬스체크 등은 제외
        return !uri.startsWith("/static/") 
            && !uri.startsWith("/css/")
            && !uri.startsWith("/js/")
            && !uri.startsWith("/images/")
            && !uri.startsWith("/favicon.ico")
            && !uri.startsWith("/actuator/")
            && !uri.startsWith("/h2-console/");
    }
}
