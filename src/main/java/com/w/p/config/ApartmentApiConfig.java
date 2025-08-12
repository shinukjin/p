package com.w.p.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

/**
 * 아파트 매매 실거래가 API 설정
 */
@Configuration
@ConfigurationProperties(prefix = "apt")
@Getter
@Setter
public class ApartmentApiConfig {

    private Endpoint endpoint = new Endpoint();
    private String encodingKey;
    private String decodingKey;

    @Getter
    @Setter
    public static class Endpoint {
        private String url;
    }
}
