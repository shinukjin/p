package com.w.p.controller.admin;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.w.p.common.util.SecurityUtil;
import com.w.p.dto.user.UserDTO;
import com.w.p.service.user.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 관리자용 사용자 관리 컨트롤러
 * ADMIN, SUPER_ADMIN 역할을 가진 사용자만 접근 가능
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Slf4j
public class AdminUserManagementController {

    private final UserService userService;

    /**
     * 전체 사용자 목록 조회 (페이징)
     */
    @GetMapping
    public ResponseEntity<UserDTO.ListResponse> getUserList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        
        log.info("사용자 목록 조회 요청 - 페이지: {}, 크기: {}, 검색어: {}, 역할: {}, 상태: {}", 
                page, size, searchKeyword, role, status);
        
        UserDTO.ListResponse response = userService.getUserListForAdmin(page, size, searchKeyword, role, status);
        return ResponseEntity.ok(response);
    }

    /**
     * 사용자 상세 정보 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO.UserInfo> getUserInfo(@PathVariable Long userId) {
        log.info("사용자 정보 조회 요청: {}", userId);
        
        UserDTO.UserInfo userInfo = userService.getUserInfoForAdmin(userId);
        return ResponseEntity.ok(userInfo);
    }

    /**
     * 사용자 상태 변경 (활성/비활성/잠금)
     */
    @PutMapping("/{userId}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status) {
        
        log.info("사용자 상태 변경 요청: {} -> {}", userId, status);
        
        // 본인 상태 변경 방지
        SecurityUtil.getCurrentUserId().ifPresent(currentUserId -> {
            if (currentUserId.equals(userId)) {
                throw new IllegalArgumentException("본인의 상태는 변경할 수 없습니다.");
            }
        });
        
        userService.updateUserStatus(userId, status);
        return ResponseEntity.ok().build();
    }

    /**
     * 사용자 역할 변경
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role) {
        
        log.info("사용자 역할 변경 요청: {} -> {}", userId, role);
        
        // 본인 역할 변경 방지
        SecurityUtil.getCurrentUserId().ifPresent(currentUserId -> {
            if (currentUserId.equals(userId)) {
                throw new IllegalArgumentException("본인의 역할은 변경할 수 없습니다.");
            }
        });
        
        userService.updateUserRole(userId, role);
        return ResponseEntity.ok().build();
    }

    /**
     * 사용자 계정 잠금 해제
     */
    @PutMapping("/{userId}/unlock")
    public ResponseEntity<Void> unlockUser(@PathVariable Long userId) {
        log.info("사용자 계정 잠금 해제 요청: {}", userId);
        
        userService.unlockUser(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 사용자 로그인 기록 조회
     */
    @GetMapping("/{userId}/login-history")
    public ResponseEntity<UserDTO.LoginHistoryResponse> getUserLoginHistory(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("사용자 로그인 기록 조회 요청: {}", userId);
        
        UserDTO.LoginHistoryResponse response = userService.getUserLoginHistory(userId, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * 사용자 통계 정보 조회
     */
    @GetMapping("/statistics")
    public ResponseEntity<UserDTO.StatisticsResponse> getUserStatistics() {
        log.info("사용자 통계 정보 조회 요청");
        
        UserDTO.StatisticsResponse response = userService.getUserStatistics();
        return ResponseEntity.ok(response);
    }

    /**
     * 사용자 일괄 상태 변경 (CSV 업로드 등)
     */
    @PostMapping("/bulk-status-update")
    public ResponseEntity<UserDTO.BulkUpdateResponse> bulkUpdateUserStatus(
            @RequestBody UserDTO.BulkStatusUpdateRequest request) {
        
        log.info("사용자 일괄 상태 변경 요청: {}건", request.getUserIds().size());
        
        UserDTO.BulkUpdateResponse response = userService.bulkUpdateUserStatus(request);
        return ResponseEntity.ok(response);
    }
}
