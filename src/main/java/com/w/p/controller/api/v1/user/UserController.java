package com.w.p.controller.api.v1.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.w.p.common.ApiResponse;
import com.w.p.dto.user.UserDTO.Signup;
import com.w.p.dto.user.UserDTO.SignupResponse;
import com.w.p.service.user.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * 사용자 관련 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 회원가입 API
     *
     * @param request 회원가입 요청 정보
     * @return 회원가입 결과
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody Signup request) {
        SignupResponse response = userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "회원가입이 성공적으로 완료되었습니다."));
    }
}
