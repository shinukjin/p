package com.w.p.domain.user.controller;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.w.p.common.ApiResponse;
import com.w.p.component.jwt.JwtTokenProvider;
import com.w.p.domain.user.dto.UserDTO.Signup;
import com.w.p.domain.user.dto.UserDTO.SignupResponse;
import com.w.p.domain.user.dto.UserDTO.TokenUpdateResponse;
import com.w.p.domain.user.dto.UserDTO.TotalBudgetUpdateRequest;
import com.w.p.domain.user.dto.UserDTO.UpdateRequest;
import com.w.p.domain.user.dto.UserDTO.UserInfo;
import com.w.p.domain.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * 사용자 관련 API 컨트롤러
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원가입 API
     *
     * @param request 회원가입 요청 정보
     * @return 회원가입 결과
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody Signup request) {
        SignupResponse response = userService.signup(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "회원가입이 성공적으로 완료되었습니다."));
    }

    /**
     * 현재 사용자 정보 조회 API
     *
     * @return 현재 로그인한 사용자 정보
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfo>> getCurrentUserInfo() {
        UserInfo userInfo = userService.getCurrentUserInfo();
        return ResponseEntity.ok(ApiResponse.success(userInfo, "사용자 정보를 성공적으로 조회했습니다."));
    }

    /**
     * 사용자 정보 업데이트 API
     *
     * @param request 업데이트할 사용자 정보
     * @return 업데이트 결과 및 새로운 JWT 토큰
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<TokenUpdateResponse>> updateUserInfo(@Valid @RequestBody UpdateRequest request) {
        // 현재 로그인한 사용자의 ID를 가져와서 업데이트
        UserInfo currentUser = userService.getCurrentUserInfo();
        userService.updateUserInfo(currentUser.getId(), request);
        
        // 업데이트된 사용자 정보로 새로운 JWT 토큰 생성
        UserInfo updatedUser = userService.getCurrentUserInfo();
        JwtTokenProvider.TokenInfo tokenInfo = jwtTokenProvider.generateTokenInfo(
            userService.findUserById(updatedUser.getId())
        );
        
        TokenUpdateResponse response = TokenUpdateResponse.builder()
            .token(tokenInfo.getToken())
            .expiresAt(LocalDateTime.ofInstant(Instant.ofEpochMilli(tokenInfo.getExpiresAt()), ZoneId.systemDefault()))
            .expiresIn(tokenInfo.getExpiresIn())
            .user(updatedUser)
            .build();
        
        return ResponseEntity.ok(ApiResponse.success(response, "사용자 정보가 성공적으로 업데이트되었습니다."));
    }

    /**
     * 사용자 총 예산 업데이트 API
     *
     * @param request 업데이트할 총 예산 정보
     * @return 업데이트 결과 및 새로운 JWT 토큰
     */
    @PutMapping("/me/budget")
    public ResponseEntity<ApiResponse<TokenUpdateResponse>> updateUserTotalBudget(@Valid @RequestBody TotalBudgetUpdateRequest request) {
        // 현재 로그인한 사용자의 ID를 가져와서 업데이트
        UserInfo currentUser = userService.getCurrentUserInfo();
        userService.updateUserTotalBudget(currentUser.getId(), request);
        
        // 업데이트된 사용자 정보로 새로운 JWT 토큰 생성
        UserInfo updatedUser = userService.getCurrentUserInfo();
        JwtTokenProvider.TokenInfo tokenInfo = jwtTokenProvider.generateTokenInfo(
            userService.findUserById(updatedUser.getId())
        );
        
        TokenUpdateResponse response = TokenUpdateResponse.builder()
            .token(tokenInfo.getToken())
            .expiresAt(LocalDateTime.ofInstant(Instant.ofEpochMilli(tokenInfo.getExpiresAt()), ZoneId.systemDefault()))
            .expiresIn(tokenInfo.getExpiresIn())
            .user(updatedUser)
            .build();
        
        return ResponseEntity.ok(ApiResponse.success(response, "총 예산이 성공적으로 업데이트되었습니다."));
    }

    /**
     * 사용자 탈퇴 API
     *
     * @return 탈퇴 결과
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteUser() {
        UserInfo currentUser = userService.getCurrentUserInfo();
        userService.deleteUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "회원 탈퇴가 성공적으로 완료되었습니다."));
    }
}

