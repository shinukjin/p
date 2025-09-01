package com.w.p.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import com.w.p.component.jwt.JwtAccessDeniedHandler;
import com.w.p.component.jwt.JwtAuthenticationEntryPoint;
import com.w.p.component.jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())) // H2 콘솔용
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 공개 접근 가능한 엔드포인트
                .requestMatchers("/api/v1/login").permitAll()
                .requestMatchers("/api/v1/signup").permitAll()     // 로그인/회원가입은 인증 불필요
                .requestMatchers("/api/v1/test/**").permitAll()     // 테스트 API는 인증 불필요
                .requestMatchers("/error").permitAll()             // 에러 페이지는 인증 불필요
                .requestMatchers("/h2-console/**").permitAll()     // H2 콘솔은 인증 불필요
                
                // 관리자 인증 관련 (로그인 페이지 등)
                .requestMatchers("/api/v1/admin/login").permitAll()
                
                // 관리자 전용 API - ADMIN, SUPER_ADMIN, OPERATOR 역할 필요
                .requestMatchers("/api/v1/admin/**").hasAnyAuthority("ADMIN", "SUPER_ADMIN", "OPERATOR")
                
                // 슈퍼 관리자 전용 API - SUPER_ADMIN 역할만 필요
                .requestMatchers("/api/v1/admin/super/**").hasAuthority("SUPER_ADMIN")
                
                // 사용자 관리 API - ADMIN, SUPER_ADMIN 역할 필요
                .requestMatchers("/api/v1/admin/users/**").hasAnyAuthority("ADMIN", "SUPER_ADMIN")
                
                // 시스템 설정 API - SUPER_ADMIN 역할만 필요
                .requestMatchers("/api/v1/admin/system/**").hasRole("SUPER_ADMIN")
                
                // 일반 사용자 API - 인증된 사용자 모두 접근 가능
                
                // 나머지는 모두 인증 필요
                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint) // 인증 실패
                .accessDeniedHandler(jwtAccessDeniedHandler) // 권한 실패
            )
            .userDetailsService(customUserDetailsService)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    // authenticationManager bean 등록, 로그인 시 사용.
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 오리진 설정 (프론트엔드 URL)
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*"));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 허용할 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // 인증 정보 포함 허용
        configuration.setAllowCredentials(true);

        // preflight 요청 캐시 시간 (초)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
