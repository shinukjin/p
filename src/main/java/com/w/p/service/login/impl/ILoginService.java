package com.w.p.service.login.impl;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.w.p.component.jwt.JwtTokenProvider;
import com.w.p.dto.login.LoginDTO;
import com.w.p.dto.login.LoginDTO.LoginRequest;
import com.w.p.entity.User;
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

        // 토큰과 만료 시간 정보를 함께 생성
        var tokenInfo = jwtTokenProvider.createTokenWithExpiration(
            user.getId(), user.getUsername(), user.getRole().name()
        );
        
        log.info("사용자 로그인 성공: {} (토큰 만료: {})", 
            user.getUsername(), tokenInfo.getExpiresAtDate());

        return new LoginDTO.LoginResponse(
            tokenInfo.getToken(), 
            tokenInfo.getExpiresAt(), 
            tokenInfo.getExpiresIn()
        );
    }
}
