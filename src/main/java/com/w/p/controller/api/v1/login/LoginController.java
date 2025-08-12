package com.w.p.controller.api.v1.login;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.w.p.common.ApiResponse;
import com.w.p.dto.login.LoginDTO;
import com.w.p.service.login.LoginService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    /**
     * 로그인 API
     *
     * @param request 로그인 요청 정보
     * @return 로그인 결과 (JWT 토큰)
     */
    @PostMapping("/login")
    public ApiResponse<LoginDTO.LoginResponse> login(@Valid @RequestBody LoginDTO.LoginRequest request){
        LoginDTO.LoginResponse response = loginService.login(request);
        return ApiResponse.success(response, "로그인이 성공적으로 완료되었습니다.");
    }
}
