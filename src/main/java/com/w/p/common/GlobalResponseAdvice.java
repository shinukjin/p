package com.w.p.common;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.w.p.exception.ErrorResponse;

/**
 * 모든 API 응답을 ApiResponse 형식으로 래핑하는 어드바이스
 */
@RestControllerAdvice
public class GlobalResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // 이미 ApiResponse나 ErrorResponse로 래핑된 경우는 제외
        return !returnType.getParameterType().equals(ApiResponse.class) 
            && !returnType.getParameterType().equals(ErrorResponse.class)
            && !returnType.getDeclaringClass().getPackageName().startsWith("org.springframework");
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,
            ServerHttpResponse response) {
        
        // 이미 래핑된 응답이거나 에러 응답인 경우 그대로 반환
        if (body instanceof ApiResponse || body instanceof ErrorResponse) {
            return body;
        }
        
        // String 타입의 경우 특별 처리 (Jackson 변환 문제 방지)
        if (body instanceof String) {
            return ApiResponse.success(body);
        }
        
        // 일반적인 경우 성공 응답으로 래핑
        return ApiResponse.success(body);
    }
}
