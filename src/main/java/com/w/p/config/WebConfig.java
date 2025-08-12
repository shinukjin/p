package com.w.p.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.w.p.common.LoggingInterceptor;

import lombok.RequiredArgsConstructor;

/**
 * 웹 설정 클래스
 */
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final LoggingInterceptor loggingInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggingInterceptor)
                .addPathPatterns("/api/**")  // API 경로만 적용
                .excludePathPatterns(
                    "/api/v1/auth/login",    // 로그인은 민감정보로 제외 (선택사항)
                    "/h2-console/**",        // H2 콘솔 제외
                    "/actuator/**"           // 액추에이터 제외
                );
    }
}
