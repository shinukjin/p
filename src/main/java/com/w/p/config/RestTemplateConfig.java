package com.w.p.config;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * RestTemplate 설정 클래스
 */
@Configuration
public class RestTemplateConfig {

    @Value("${rest.template.connect-timeout:5000}")
    private int connectTimeout;

    @Value("${rest.template.read-timeout:10000}")
    private int readTimeout;

    @Bean
    public RestTemplate restTemplate() {
        // RequestFactory 설정
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeout);    // 연결 타임아웃 (기본값: 5초, 로컬: 3초)
        factory.setReadTimeout(readTimeout);         // 읽기 타임아웃 (기본값: 10초, 로컬: 5초)

        return new RestTemplate(factory);
    }
}
