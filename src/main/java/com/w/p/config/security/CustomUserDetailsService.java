package com.w.p.config.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.w.p.entity.User;
import com.w.p.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService{

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("사용자 조회 시도: {}", username);

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> {
                log.error("사용자를 찾을 수 없음: {}", username);
                return new UsernameNotFoundException("User not found: " + username);
            });

        log.debug("사용자 조회 성공: {}", username);
        return new CustomUserDetails(user);
    }
}
