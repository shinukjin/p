package com.w.p.common.util;

import com.w.p.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Optional;

/**
 * Spring Security 관련 유틸리티 클래스
 * 현재 인증된 사용자의 정보와 권한을 쉽게 확인할 수 있도록 도와줍니다.
 */
@Component
public class SecurityUtil {

    /**
     * 현재 인증된 사용자의 Authentication 객체를 반환합니다.
     */
    public static Optional<Authentication> getAuthentication() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());
    }

    /**
     * 현재 인증된 사용자의 Principal을 반환합니다.
     */
    public static Optional<Object> getPrincipal() {
        return getAuthentication().map(Authentication::getPrincipal);
    }

    /**
     * 현재 인증된 사용자의 User 객체를 반환합니다.
     */
    public static Optional<User> getCurrentUser() {
        return getPrincipal()
                .filter(principal -> principal instanceof User)
                .map(principal -> (User) principal);
    }

    /**
     * 현재 인증된 사용자의 ID를 반환합니다.
     */
    public static Optional<Long> getCurrentUserId() {
        return getCurrentUser().map(User::getId);
    }

    /**
     * 현재 인증된 사용자의 사용자명을 반환합니다.
     */
    public static Optional<String> getCurrentUsername() {
        return getCurrentUser().map(User::getUsername);
    }

    /**
     * 현재 인증된 사용자의 역할을 반환합니다.
     */
    public static Optional<User.UserRole> getCurrentUserRole() {
        return getCurrentUser().map(User::getRole);
    }

    /**
     * 현재 인증된 사용자가 특정 역할을 가지고 있는지 확인합니다.
     */
    public static boolean hasRole(String role) {
        return getAuthentication()
                .map(Authentication::getAuthorities)
                .map(authorities -> authorities.stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(authority -> authority.equals("ROLE_" + role)))
                .orElse(false);
    }

    /**
     * 현재 인증된 사용자가 관리자 역할을 가지고 있는지 확인합니다.
     */
    public static boolean isAdmin() {
        return hasRole("ADMIN") || hasRole("SUPER_ADMIN") || hasRole("OPERATOR");
    }

    /**
     * 현재 인증된 사용자가 슈퍼 관리자인지 확인합니다.
     */
    public static boolean isSuperAdmin() {
        return hasRole("SUPER_ADMIN");
    }

    /**
     * 현재 인증된 사용자가 일반 관리자인지 확인합니다.
     */
    public static boolean isGeneralAdmin() {
        return hasRole("ADMIN");
    }

    /**
     * 현재 인증된 사용자가 운영자인지 확인합니다.
     */
    public static boolean isOperator() {
        return hasRole("OPERATOR");
    }

    /**
     * 현재 인증된 사용자가 일반 사용자인지 확인합니다.
     */
    public static boolean isUser() {
        return hasRole("USER");
    }

    /**
     * 현재 인증된 사용자가 인증되었는지 확인합니다.
     */
    public static boolean isAuthenticated() {
        return getAuthentication()
                .map(Authentication::isAuthenticated)
                .orElse(false);
    }

    /**
     * 현재 인증된 사용자가 익명 사용자인지 확인합니다.
     */
    public static boolean isAnonymous() {
        return getAuthentication()
                .map(Authentication::getPrincipal)
                .map(principal -> "anonymousUser".equals(principal))
                .orElse(true);
    }
}
