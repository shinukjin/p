package com.w.p.domain.login.service.impl;

import java.util.Date;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.w.p.component.jwt.JwtTokenProvider;
import com.w.p.domain.login.service.LoginService;
import com.w.p.domain.user.repository.UserRepository;
import com.w.p.dto.login.LoginDTO;
import com.w.p.entity.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public LoginDTO.LoginResponse login(LoginDTO.LoginRequest request) {
        log.info("로그인 시도: {}", request.getUsername());
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new BadCredentialsException("Account is not active");
        }

        String token = jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole().name());
        Date expirationDate = jwtTokenProvider.getExpirationDateFromToken(token);
        long expiresAt = expirationDate.getTime();
        long expiresIn = expirationDate.getTime() - System.currentTimeMillis();

        log.info("로그인 성공: {}", user.getUsername());

        return new LoginDTO.LoginResponse(
                token,
                expiresAt,
                expiresIn,
                new LoginDTO.UserInfo(
                        user.getId(),
                        user.getUsername(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus(),
                        user.getCreatedAt().toString(),
                        user.getUpdatedAt().toString()
                )
        );
    }

    @Override
    public LoginDTO.TokenRefreshResponse refreshToken(String refreshToken) {
        log.info("토큰 갱신 시도");
        
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new BadCredentialsException("Account is not active");
        }

        String newToken = jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole().name());
        Date expirationDate = jwtTokenProvider.getExpirationDateFromToken(newToken);
        long expiresAt = expirationDate.getTime();
        long expiresIn = expirationDate.getTime() - System.currentTimeMillis();

        log.info("토큰 갱신 성공: {}", username);

        return new LoginDTO.TokenRefreshResponse(
                newToken,
                expiresAt,
                expiresIn
        );
    }
}
