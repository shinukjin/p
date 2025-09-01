package com.w.p.domain.login.service;

import com.w.p.dto.login.LoginDTO;
import com.w.p.dto.login.LoginDTO.LoginRequest;

public interface LoginService {
    public LoginDTO.LoginResponse login(LoginRequest request);
    public LoginDTO.TokenRefreshResponse refreshToken(String refreshToken);
}
