package com.w.p.domain.admin.controller;

import com.w.p.dto.admin.AdminDTO;
import com.w.p.domain.admin.service.AdminService;
import com.w.p.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 관리자 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;

    /**
     * 관리자 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminDTO.LoginResponse>> login(@RequestBody AdminDTO.LoginRequest request) {
        try {
            AdminDTO.LoginResponse response = adminService.adminLogin(request);
            return ResponseEntity.ok(ApiResponse.success(response, "관리자 로그인이 성공했습니다."));
        } catch (Exception e) {
            log.error("관리자 로그인 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("로그인에 실패했습니다."));
        }
    }

    /**
     * 시스템 통계 조회
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<AdminDTO.SystemStatisticsResponse>> getSystemStatistics() {
        try {
            AdminDTO.SystemStatisticsResponse response = adminService.getSystemStatistics();
            return ResponseEntity.ok(ApiResponse.success(response, "시스템 통계를 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("시스템 통계 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("시스템 통계 조회에 실패했습니다."));
        }
    }

    /**
     * 전체 사용자 목록 조회
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<java.util.List<AdminDTO.UserInfo>>> getAllUsers() {
        try {
            java.util.List<AdminDTO.UserInfo> users = adminService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success(users, "사용자 목록을 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("사용자 목록 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("사용자 목록 조회에 실패했습니다."));
        }
    }

    /**
     * 사용자 상세 정보 조회
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<AdminDTO.UserInfo>> getUserById(@PathVariable Long userId) {
        try {
            AdminDTO.UserInfo userInfo = adminService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.success(userInfo, "사용자 정보를 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("사용자 정보 조회에 실패했습니다."));
        }
    }

    /**
     * 사용자 상태 업데이트
     */
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<AdminDTO.UserInfo>> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status) {
        try {
            com.w.p.entity.User.UserStatus userStatus = com.w.p.entity.User.UserStatus.valueOf(status.toUpperCase());
            AdminDTO.UserInfo userInfo = adminService.updateUserStatus(userId, userStatus);
            return ResponseEntity.ok(ApiResponse.success(userInfo, "사용자 상태가 성공적으로 업데이트되었습니다."));
        } catch (Exception e) {
            log.error("사용자 상태 업데이트 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("사용자 상태 업데이트에 실패했습니다."));
        }
    }

    /**
     * 사용자 역할 업데이트
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<AdminDTO.UserInfo>> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role) {
        try {
            com.w.p.entity.User.UserRole userRole = com.w.p.entity.User.UserRole.valueOf(role.toUpperCase());
            AdminDTO.UserInfo userInfo = adminService.updateUserRole(userId, userRole);
            return ResponseEntity.ok(ApiResponse.success(userInfo, "사용자 역할이 성공적으로 업데이트되었습니다."));
        } catch (Exception e) {
            log.error("사용자 역할 업데이트 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("사용자 역할 업데이트에 실패했습니다."));
        }
    }

    /**
     * 사용자 삭제
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok(ApiResponse.success(null, "사용자가 성공적으로 삭제되었습니다."));
        } catch (Exception e) {
            log.error("사용자 삭제 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("사용자 삭제에 실패했습니다."));
        }
    }

    /**
     * 사용자 검색
     */
    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<java.util.List<AdminDTO.UserInfo>>> searchUsers(@RequestParam String keyword) {
        try {
            java.util.List<AdminDTO.UserInfo> users = adminService.searchUsers(keyword);
            return ResponseEntity.ok(ApiResponse.success(users, "사용자 검색이 성공적으로 완료되었습니다."));
        } catch (Exception e) {
            log.error("사용자 검색 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("사용자 검색에 실패했습니다."));
        }
    }

    /**
     * 관리자 대시보드 조회
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDTO.DashboardResponse>> getDashboard() {
        try {
            AdminDTO.DashboardResponse dashboard = adminService.getDashboard();
            return ResponseEntity.ok(ApiResponse.success(dashboard, "대시보드 정보를 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("대시보드 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("대시보드 조회에 실패했습니다."));
        }
    }

    /**
     * 차트 데이터 조회
     */
    @GetMapping("/charts/visitors")
    public ResponseEntity<ApiResponse<java.util.List<AdminDTO.ChartData>>> getVisitorChartData() {
        try {
            java.util.List<AdminDTO.ChartData> chartData = adminService.getVisitorChartData();
            return ResponseEntity.ok(ApiResponse.success(chartData, "방문자 차트 데이터를 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("방문자 차트 데이터 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("방문자 차트 데이터 조회에 실패했습니다."));
        }
    }

    /**
     * 월별 방문자 통계 조회
     */
    @GetMapping("/charts/monthly")
    public ResponseEntity<ApiResponse<java.util.List<AdminDTO.ChartData>>> getMonthlyChartData() {
        try {
            java.util.List<AdminDTO.ChartData> chartData = adminService.getMonthlyChartData();
            return ResponseEntity.ok(ApiResponse.success(chartData, "월별 차트 데이터를 성공적으로 조회했습니다."));
        } catch (Exception e) {
            log.error("월별 차트 데이터 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("월별 차트 데이터 조회에 실패했습니다."));
        }
    }
}
