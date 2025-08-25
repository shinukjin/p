package com.w.p.controller.api.v1.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.w.p.common.ApiResponse;
import com.w.p.dto.user.UserDTO.*;
import com.w.p.service.user.UserService;
import com.w.p.component.jwt.JwtTokenProvider;

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
        
        TokenUpdateResponse response = new TokenUpdateResponse(
            tokenInfo.getToken(),
            tokenInfo.getExpiresAt(),
            tokenInfo.getExpiresIn(),
            updatedUser
        );
        
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
        
        TokenUpdateResponse response = new TokenUpdateResponse(
            tokenInfo.getToken(),
            tokenInfo.getExpiresAt(),
            tokenInfo.getExpiresIn(),
            updatedUser
        );
        
        return ResponseEntity.ok(ApiResponse.success(response, "총 예산이 성공적으로 업데이트되었습니다."));
    }
}
