package com.w.p.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.w.p.common.LoggingInterceptor;

/**
 * 웹 설정 클래스
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoggingInterceptor loggingInterceptor;

    @Value("${file.upload.path:uploads}")
    private String uploadPath;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggingInterceptor)
                .addPathPatterns("/api/**")  // API 경로만 적용
                .excludePathPatterns(
                    "/api/v1/login",        // 로그인은 민감정보로 제외
                    "/api/v1/admin/logs/**", // 로그 조회 API 제외 (무한 루프 방지)
                    "/api/v1/admin/logs",    // 로그 조회 API 제외 (무한 루프 방지)
                    "/h2-console/**",        // H2 콘솔 제외
                    "/actuator/**"           // 액추에이터 제외
                );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 이미지 파일에 대한 정적 리소스 핸들러 추가
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
        
        // log.info("정적 리소스 핸들러 등록: /uploads/** -> {}", uploadPath); // Original code had this line commented out
    }
}
