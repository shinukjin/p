package com.w.p.service.login.impl;

import java.time.LocalDateTime;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.w.p.common.util.GlobalUtil;
import com.w.p.component.jwt.JwtTokenProvider;
import com.w.p.dto.login.LoginDTO;
import com.w.p.dto.login.LoginDTO.LoginRequest;
import com.w.p.entity.User;
import com.w.p.entity.User.UserStatus;
import com.w.p.repository.UserRepository;
import com.w.p.service.BaseService;
import com.w.p.service.login.LoginService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ILoginService extends BaseService implements LoginService {

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    public ILoginService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                        JwtTokenProvider jwtTokenProvider) {
        super(userRepository);
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    @Override
    public LoginDTO.LoginResponse login(LoginRequest request) {
        log.info("사용자 로그인 시도: {}", request.getUsername());
        
        User user = findUserByUsername(request.getUsername());

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        if(user.getStatus() != UserStatus.ACTIVE) {
            throw new BadCredentialsException("Inactive user");
        }

        // 새로운 JWT 토큰 생성 (사용자 상세 정보 포함)
        JwtTokenProvider.TokenInfo tokenInfo = jwtTokenProvider.generateTokenInfo(user);
        
        // 마지막 로그인 시간 업데이트
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // 사용자 정보 DTO 생성
        LoginDTO.UserInfo userInfo = new LoginDTO.UserInfo(
            user.getId(),
            user.getUsername(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole().name(),
            user.getRole().getDescription(),
            user.getStatus().name(),
            user.getStatus().getDescription(),
            user.getTotalBudget(),
            GlobalUtil.formatDateTime(user.getLastLoginAt()),
            GlobalUtil.formatDateTime(user.getCreatedAt()),
            GlobalUtil.formatDateTime(user.getUpdatedAt())
        );

        log.info("사용자 로그인 성공: {}", user.getUsername());
        
        return new LoginDTO.LoginResponse(
            tokenInfo.getToken(),
            tokenInfo.getExpiresAt(),
            tokenInfo.getExpiresIn(),
            userInfo
        );
    }
}
