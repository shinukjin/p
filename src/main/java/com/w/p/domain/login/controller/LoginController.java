package com.w.p.domain.login.controller;

import com.w.p.dto.login.LoginDTO;
import com.w.p.domain.login.service.LoginService;
import com.w.p.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 로그인 컨트롤러
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class LoginController {

    private final LoginService loginService;

    /**
     * 사용자 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginDTO.LoginResponse>> login(@RequestBody LoginDTO.LoginRequest request) {
        try {
            LoginDTO.LoginResponse response = loginService.login(request);
            return ResponseEntity.ok(ApiResponse.success(response, "로그인이 성공했습니다."));
        } catch (Exception e) {
            log.error("로그인 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("로그인에 실패했습니다."));
        }
    }
}
