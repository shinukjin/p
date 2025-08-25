package com.w.p.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.ZoneId;
import java.util.TimeZone;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        // Java 8 Time 모듈 등록
        objectMapper.registerModule(new JavaTimeModule());
        
        // 날짜를 타임스탬프가 아닌 ISO 형식으로 직렬화
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // 한국 시간대 설정
        objectMapper.setTimeZone(TimeZone.getTimeZone(ZoneId.of("Asia/Seoul")));
        
        return objectMapper;
    }
}
