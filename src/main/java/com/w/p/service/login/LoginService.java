package com.w.p.service.login;

import com.w.p.dto.login.LoginDTO;
import com.w.p.dto.login.LoginDTO.LoginRequest;

public interface LoginService {
    public LoginDTO.LoginResponse login(LoginRequest request);
}
