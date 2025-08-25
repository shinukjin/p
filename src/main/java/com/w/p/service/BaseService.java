package com.w.p.service;

import com.w.p.entity.User;
import com.w.p.exception.UserException;
import com.w.p.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 공통 서비스 기능을 제공하는 베이스 클래스
 */
@RequiredArgsConstructor
public abstract class BaseService {

    protected final UserRepository userRepository;

    /**
     * 사용자명으로 사용자 조회 (공통)
     */
    protected User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> UserException.notFound(username));
    }
    
    /**
     * ID로 사용자 조회 (공통)
     */
    protected User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> UserException.notFound(userId));
    }

    /**
     * String을 Long으로 안전하게 변환
     */
    protected Long parseStringToLong(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * String을 Double로 안전하게 변환
     */
    protected Double parseStringToDouble(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * String을 Integer로 안전하게 변환
     */
    protected Integer parseStringToInteger(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * 현재 로그인한 사용자 조회
     */
    protected User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw UserException.unauthorized();
        }
        
        String username = authentication.getName();
        return findUserByUsername(username);
    }
}
