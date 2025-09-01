package com.w.p.domain.user.dto;

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

        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 6, max = 20, message = "비밀번호는 6자 이상 20자 이하여야 합니다.")
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).*$", message = "비밀번호는 영문과 숫자를 포함해야 합니다.")
        private String confirmPassword;

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
     * 사용자 생성 요청 DTO
     */
    @Getter
    @Setter
    public static class CreateRequest {
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

        private Long totalBudget;
    }

    /**
     * 사용자 응답 DTO
     */
    @Getter
    @Builder
    public static class Response {
        private Long id;
        private String username;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String status;
        private Long totalBudget;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(com.w.p.entity.User user) {
            return Response.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(user.getRole().name())
                    .status(user.getStatus().name())
                    .totalBudget(user.getTotalBudget())
                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();
        }
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
        private Long totalBudget;
        private LocalDateTime lastLoginAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    /**
     * 사용자 정보 업데이트 요청 DTO
     */
    @Getter
    @Setter
    public static class UpdateRequest {
        @Size(max = 100, message = "이름은 100자 이하여야 합니다.")
        private String name;

        @Email(message = "유효한 이메일 주소를 입력해주세요.")
        @Size(max = 100, message = "이메일은 100자 이하여야 합니다.")
        private String email;

        @Pattern(regexp = "^[0-9-+()]*$", message = "유효한 전화번호를 입력해주세요.")
        @Size(max = 20, message = "전화번호는 20자 이하여야 합니다.")
        private String phone;
    }

    /**
     * 총 예산 업데이트 요청 DTO
     */
    @Getter
    @Setter
    public static class TotalBudgetUpdateRequest {
        private Long totalBudget;
    }

    /**
     * 토큰 업데이트 응답 DTO
     */
    @Getter
    @Builder
    public static class TokenUpdateResponse {
        private String token;
        private LocalDateTime expiresAt;
        private long expiresIn;
        private UserInfo user;
    }

    /**
     * 로그인 요청 DTO
     */
    @Getter
    @Setter
    public static class Login {
        @NotBlank(message = "사용자명은 필수입니다.")
        private String username;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String password;
    }

    /**
     * 로그인 응답 DTO
     */
    @Getter
    @Builder
    public static class LoginResponse {
        private String token;
        private LocalDateTime expiresAt;
        private long expiresIn;
        private UserInfo user;
    }

    /**
     * 관리자용 사용자 목록 조회 응답 DTO
     */
    @Getter
    @Builder
    public static class UserListResponse {
        private List<UserInfo> users;
        private long totalElements;
        private int totalPages;
        private int currentPage;
        private int pageSize;
    }

    /**
     * 관리자용 사용자 검색 요청 DTO
     */
    @Getter
    @Setter
    public static class UserSearchRequest {
        private String username;
        private String email;
        private String role;
        private String status;
        private int page = 0;
        private int size = 10;
    }

    /**
     * 관리자용 사용자 상태 변경 요청 DTO
     */
    @Getter
    @Setter
    public static class UserStatusUpdateRequest {
        @NotBlank(message = "상태는 필수입니다.")
        private String status;
    }

    /**
     * 관리자용 사용자 역할 변경 요청 DTO
     */
    @Getter
    @Setter
    public static class UserRoleUpdateRequest {
        @NotBlank(message = "역할은 필수입니다.")
        private String role;
    }

    /**
     * 사용자 목록 응답 DTO
     */
    @Getter
    @Builder
    public static class ListResponse {
        private List<UserInfo> users;
        private int totalCount;
        private int currentPage;
        private int totalPages;
        private int pageSize;
    }

    /**
     * 로그인 이력 DTO
     */
    @Getter
    @Builder
    public static class LoginHistory {
        private Long id;
        private String username;
        private LocalDateTime loginAt;
        private String ipAddress;
        private String userAgent;
    }

    /**
     * 로그인 이력 응답 DTO
     */
    @Getter
    @Builder
    public static class LoginHistoryResponse {
        private List<LoginHistory> histories;
        private int totalCount;
        private int currentPage;
        private int totalPages;
    }

    /**
     * 통계 응답 DTO
     */
    @Getter
    @Builder
    public static class StatisticsResponse {
        private long totalUsers;
        private long activeUsers;
        private long inactiveUsers;
        private long newUsersThisMonth;
        private long newUsersThisWeek;
    }

    /**
     * 일괄 상태 업데이트 요청 DTO
     */
    @Getter
    @Setter
    public static class BulkStatusUpdateRequest {
        private List<Long> userIds;
        private String status;
    }

    /**
     * 일괄 업데이트 응답 DTO
     */
    @Getter
    @Builder
    public static class BulkUpdateResponse {
        private int successCount;
        private int failureCount;
        private List<String> errors;
    }
}
