package com.w.p.dto.admin;

import com.w.p.entity.User;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 관리자 관련 DTO들
 */
public class AdminDTO {

    /**
     * 관리자 로그인 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        private String username;
        private String password;
    }

    /**
     * 관리자 로그인 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {
        private String token;
        private AdminInfo adminInfo;
        private long expiresAt; // 토큰 만료 시간 (Unix timestamp)
        private long expiresIn; // 토큰 만료까지 남은 시간 (초)
    }

    /**
     * 관리자 정보
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminInfo {
        private Long id;
        private String username;
        private String name;
        private String email;
        private String phone;
        private User.UserRole role;
        private User.UserStatus status;
        private LocalDateTime lastLoginAt;
        private LocalDateTime createdAt;
    }

    /**
     * 관리자 생성 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String username;
        private String password;
        private String name;
        private String email;
        private String phone;
        private User.UserRole role;
    }

    /**
     * 관리자 수정 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String name;
        private String email;
        private String phone;
        private User.UserRole role;
        private User.UserStatus status;
    }

    /**
     * 관리자 비밀번호 변경 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
        private String confirmPassword;
    }

    /**
     * 관리자 검색 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchRequest {
        private String keyword;
        private User.UserRole role;
        private User.UserStatus status;
        @Builder.Default
        private Integer page = 1;
        @Builder.Default
        private Integer size = 20;
    }

    /**
     * 관리자 목록 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private java.util.List<AdminInfo> admins;
        private long totalCount;
        private int totalPages;
        private int currentPage;
        private int pageSize;
    }

    /**
     * 대시보드 통계 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardResponse {
        private long totalUsers;
        private long totalApartments;
        private long totalWeddingHalls;
        private long totalWeddingServices;
        private long todayVisitors;
        private long thisMonthVisitors;
        private java.util.List<Integer> weeklyVisitors;
        private java.util.List<Integer> monthlyVisitors;
    }

    /**
     * 차트 데이터
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChartData {
        private String label;
        private long value;
    }

    /**
     * 시스템 통계 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SystemStatisticsResponse {
        private long totalUsers;
        private long activeUsers;
        private long inactiveUsers;
        private long adminUsers;
        private long regularUsers;
    }

    /**
     * 사용자 정보
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private Long id;
        private String username;
        private String name;
        private String email;
        private User.UserRole role;
        private User.UserStatus status;
        private LocalDateTime createdAt;
    }
}
