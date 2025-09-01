package com.w.p.domain.common.service.impl;

import com.w.p.domain.common.service.BaseService;
import com.w.p.entity.User;
import com.w.p.exception.UserException;
import com.w.p.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * 공통 서비스 기능을 제공하는 베이스 서비스 구현체
 */
@Service
@RequiredArgsConstructor
public class BaseServiceImpl implements BaseService {

    private final UserRepository userRepository;

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> UserException.notFound(username));
    }
    
    @Override
    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> UserException.notFound(userId));
    }

    @Override
    public Long parseStringToLong(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Override
    public Double parseStringToDouble(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Override
    public Integer parseStringToInteger(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw UserException.unauthorized();
        }
        
        String username = authentication.getName();
        return findUserByUsername(username);
    }
}
