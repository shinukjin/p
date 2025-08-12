package com.w.p.service.user.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.w.p.dto.user.UserDTO.Signup;
import com.w.p.dto.user.UserDTO.SignupResponse;
import com.w.p.entity.User;
import com.w.p.exception.BusinessException;
import com.w.p.repository.UserRepository;
import com.w.p.service.user.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IUserService implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public SignupResponse signup(Signup request) {

        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw BusinessException.userAlreadyExists(request.getUsername());
        }

        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), "ROLE_USER");
        User savedUser = userRepository.save(user);

        return SignupResponse.builder()
            .id(savedUser.getId())
            .username(savedUser.getUsername())
            .message("회원가입이 성공적으로 완료되었습니다.")
            .build();
    }
}
