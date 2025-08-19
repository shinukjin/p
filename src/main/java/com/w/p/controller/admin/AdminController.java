package com.w.p.controller.admin;

import com.w.p.common.util.GlobalUtil;
import com.w.p.dto.admin.AdminDTO;
import com.w.p.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

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
    public ResponseEntity<AdminDTO.LoginResponse> login(@Valid @RequestBody AdminDTO.LoginRequest request) {
        log.info("관리자 로그인 요청: {}", GlobalUtil.maskPassword(request.getUsername()));
        
        AdminDTO.LoginResponse response = adminService.login(request);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 정보 조회
     */
    @GetMapping("/{adminId}")
    public ResponseEntity<AdminDTO.AdminInfo> getAdminInfo(@PathVariable Long adminId) {
        log.info("관리자 정보 조회 요청: {}", adminId);
        
        AdminDTO.AdminInfo adminInfo = adminService.getAdminInfo(adminId);
        
        return ResponseEntity.ok(adminInfo);
    }

    /**
     * 관리자 생성 (슈퍼관리자만)
     */
    @PostMapping
    public ResponseEntity<AdminDTO.AdminInfo> createAdmin(@Valid @RequestBody AdminDTO.CreateRequest request) {
        log.info("관리자 생성 요청: {}", GlobalUtil.maskPassword(request.getUsername()));
        
        AdminDTO.AdminInfo adminInfo = adminService.createAdmin(request);
        
        return ResponseEntity.ok(adminInfo);
    }

    /**
     * 관리자 정보 수정
     */
    @PutMapping("/{adminId}")
    public ResponseEntity<AdminDTO.AdminInfo> updateAdmin(
            @PathVariable Long adminId,
            @Valid @RequestBody AdminDTO.UpdateRequest request) {
        log.info("관리자 정보 수정 요청: {}", adminId);
        
        AdminDTO.AdminInfo adminInfo = adminService.updateAdmin(adminId, request);
        
        return ResponseEntity.ok(adminInfo);
    }

    /**
     * 관리자 비밀번호 변경
     */
    @PutMapping("/{adminId}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long adminId,
            @Valid @RequestBody AdminDTO.ChangePasswordRequest request) {
        log.info("관리자 비밀번호 변경 요청: {}", adminId);
        
        adminService.changePassword(adminId, request);
        
        return ResponseEntity.ok().build();
    }

    /**
     * 관리자 상태 변경
     */
    @PutMapping("/{adminId}/status")
    public ResponseEntity<Void> updateAdminStatus(
            @PathVariable Long adminId,
            @RequestParam String status) {
        log.info("관리자 상태 변경 요청: {} -> {}", adminId, status);
        
        adminService.updateAdminStatus(adminId, status);
        
        return ResponseEntity.ok().build();
    }

    /**
     * 관리자 목록 조회
     */
    @GetMapping("/list")
    public ResponseEntity<AdminDTO.ListResponse> getAdminList(AdminDTO.SearchRequest request) {
        log.info("관리자 목록 조회 요청: {}", request);
        
        AdminDTO.ListResponse response = adminService.getAdminList(request);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 삭제 (슈퍼관리자만)
     */
    @DeleteMapping("/{adminId}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long adminId) {
        log.info("관리자 삭제 요청: {}", adminId);
        
        adminService.deleteAdmin(adminId);
        
        return ResponseEntity.ok().build();
    }

    /**
     * 대시보드 통계 조회
     */
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDTO.DashboardResponse> getDashboardStats() {
        log.info("대시보드 통계 조회 요청");
        
        AdminDTO.DashboardResponse response = adminService.getDashboardStats();
        
        return ResponseEntity.ok(response);
    }
}
