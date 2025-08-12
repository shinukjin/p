package com.w.p.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDTO {
    private Long id;
    private String username;

    /**
     * 회원 가입 요청 DTO
     */
    @Getter
    public static class Signup {
        @NotBlank(message = "사용자명은 필수입니다.")
        @Size(min = 3, max = 20, message = "사용자명은 3자 이상 20자 이하여야 합니다.")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.")
        private String username;

        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 6, max = 20, message = "비밀번호는 6자 이상 20자 이하여야 합니다.")
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).*$", message = "비밀번호는 영문과 숫자를 포함해야 합니다.")
        private String password;
    }

    /**
     * 회원가입 응답 DTO
     */
    @Getter
    @Builder
    public static class SignupResponse {
        private Long id;
        private String username;
        private String message;
    }
}
