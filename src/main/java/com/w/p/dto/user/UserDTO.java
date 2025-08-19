package com.w.p.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UserDTO {
    private Long id;
    private String username;

    /**
     * 회원 가입 요청 DTO
     */
    @Getter
    @Setter
    public static class Signup {
        @NotBlank(message = "사용자명은 필수입니다.")
        @Size(min = 3, max = 20, message = "사용자명은 3자 이상 20자 이하여야 합니다.")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.")
        private String username;

        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 6, max = 20, message = "비밀번호는 6자 이상 20자 이하여야 합니다.")
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).*$", message = "비밀번호는 영문과 숫자를 포함해야 합니다.")
        private String password;

        @NotBlank(message = "이름은 필수입니다.")
        @Size(max = 100, message = "이름은 100자 이하여야 합니다.")
        private String name;

        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "유효한 이메일 주소를 입력해주세요.")
        @Size(max = 100, message = "이메일은 100자 이하여야 합니다.")
        private String email;

        @Pattern(regexp = "^[0-9-+()]*$", message = "유효한 전화번호를 입력해주세요.")
        @Size(max = 20, message = "전화번호는 20자 이하여야 합니다.")
        private String phone;
    }

    /**
     * 회원가입 응답 DTO
     */
    @Getter
    @Builder
    public static class SignupResponse {
        private Long id;
        private String username;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String status;
        private LocalDateTime createdAt;
        private String message;
    }

    /**
     * 사용자 정보 DTO (관리자용)
     */
    @Getter
    @Setter
    @Builder
    public static class UserInfo {
        private Long id;
        private String username;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String status;
        private LocalDateTime lastLoginAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    /**
     * 사용자 목록 조회 응답 DTO
     */
    @Getter
    @Setter
    @Builder
    public static class ListResponse {
        private List<UserInfo> users;
        private int currentPage;
        private int totalPages;
        private long totalElements;
        private int pageSize;
    }

    /**
     * 로그인 기록 DTO
     */
    @Getter
    @Setter
    @Builder
    public static class LoginHistory {
        private Long id;
        private Long userId;
        private String username;
        private LocalDateTime loginAt;
        private String ipAddress;
        private String userAgent;
        private String status;
    }

    /**
     * 로그인 기록 응답 DTO
     */
    @Getter
    @Setter
    @Builder
    public static class LoginHistoryResponse {
        private List<LoginHistory> loginHistory;
        private int currentPage;
        private int totalPages;
        private long totalElements;
        private int pageSize;
    }

    /**
     * 사용자 통계 응답 DTO
     */
    @Getter
    @Setter
    @Builder
    public static class StatisticsResponse {
        private long totalUsers;
        private long activeUsers;
        private long inactiveUsers;
        private long lockedUsers;
        private long newUsersThisMonth;
        private long newUsersThisWeek;
        private long totalLoginsToday;
        private long totalLoginsThisWeek;
    }

    /**
     * 일괄 상태 변경 요청 DTO
     */
    @Getter
    @Setter
    public static class BulkStatusUpdateRequest {
        private List<Long> userIds;
        private String status;
        private String reason;
    }

    /**
     * 일괄 업데이트 응답 DTO
     */
    @Getter
    @Setter
    @Builder
    public static class BulkUpdateResponse {
        private int successCount;
        private int failureCount;
        private List<String> failureReasons;
        private String message;
    }
}
