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
     * jwt 토큰, 만료시간 전달
     * 
     */

     @Getter
    public static class LoginResponse{
        private String token;

        public LoginResponse(String token){
            this.token = token;
        }
    }
}
