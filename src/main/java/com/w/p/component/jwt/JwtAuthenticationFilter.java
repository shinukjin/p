package com.w.p.component.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.w.p.config.security.CustomUserDetailsService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = resolveToken(request);

        if(token != null && jwtTokenProvider.validateToken(token)){
            Claims claims = jwtTokenProvider.getClaims(token);
            String username = claims.getSubject(); // subject에서 사용자명 추출
            String role = claims.get("role", String.class);

            log.debug("JWT 토큰에서 추출한 사용자명: {}, 역할: {}", username, role);

            UserDetails details;
            try {
                details = customUserDetailsService.loadUserByUsername(username);
                log.debug("사용자 정보 로드 성공: {}", username);
            } catch (Exception e) {
                log.error("사용자 정보 로드 실패 - 사용자명: {}, 오류: {}", username, e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }

            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request){
        String bearer = request.getHeader("Authorization");
        if(bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

}
