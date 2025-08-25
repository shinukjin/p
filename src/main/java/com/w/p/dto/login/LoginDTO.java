package com.w.p.dto.login;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

public class LoginDTO {

    /**
     * 로그인 요청에 사용
     *
     */
    @Getter
    public static class LoginRequest{
        @NotBlank(message = "사용자명은 필수입니다.")
        private String username;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String password;
    }

    /**
     * 로그인 응답에 사용
     * jwt 토큰, 만료시간, 사용자 정보 전달
     * 
     */
    @Getter
    public static class LoginResponse{
        private String token;
        private long expiresAt; // 토큰 만료 시간 (Unix timestamp)
        private long expiresIn; // 토큰 만료까지 남은 시간 (초)
        private UserInfo user; // 사용자 정보

        public LoginResponse(String token, long expiresAt, long expiresIn, UserInfo user){
            this.token = token;
            this.expiresAt = expiresAt;
            this.expiresIn = expiresIn;
            this.user = user;
        }
    }

    /**
     * 로그인 응답에 포함될 사용자 정보
     */
    @Getter
    public static class UserInfo {
        private Long id;
        private String username;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String roleDescription;
        private String status;
        private String statusDescription;
        private Long totalBudget;
        private String lastLoginAt;
        private String createdAt;
        private String updatedAt;

        public UserInfo(Long id, String username, String name, String email, String phone, 
                       String role, String roleDescription, String status, String statusDescription, 
                       Long totalBudget, String lastLoginAt, String createdAt, String updatedAt) {
            this.id = id;
            this.username = username;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.role = role;
            this.roleDescription = roleDescription;
            this.status = status;
            this.statusDescription = statusDescription;
            this.totalBudget = totalBudget;
            this.lastLoginAt = lastLoginAt;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
    }
}
