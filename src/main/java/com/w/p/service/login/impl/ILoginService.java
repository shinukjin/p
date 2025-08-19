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
import com.w.p.service.login.LoginService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ILoginService implements LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Override
    public LoginDTO.LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(()-> new UsernameNotFoundException("User not Found"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        String token = jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole().name());

        return new LoginDTO.LoginResponse(token);
    }
}
