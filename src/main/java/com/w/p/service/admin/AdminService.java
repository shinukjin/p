package com.w.p.service.admin;

import com.w.p.dto.admin.AdminDTO;

/**
 * 관리자 서비스 인터페이스
 */
public interface AdminService {

    /**
     * 관리자 로그인
     */
    AdminDTO.LoginResponse login(AdminDTO.LoginRequest request);

    /**
     * 관리자 정보 조회
     */
    AdminDTO.AdminInfo getAdminInfo(Long adminId);

    /**
     * 관리자 생성
     */
    AdminDTO.AdminInfo createAdmin(AdminDTO.CreateRequest request);

    /**
     * 관리자 정보 수정
     */
    AdminDTO.AdminInfo updateAdmin(Long adminId, AdminDTO.UpdateRequest request);

    /**
     * 관리자 비밀번호 변경
     */
    void changePassword(Long adminId, AdminDTO.ChangePasswordRequest request);

    /**
     * 관리자 상태 변경
     */
    void updateAdminStatus(Long adminId, String status);

    /**
     * 관리자 목록 조회
     */
    AdminDTO.ListResponse getAdminList(AdminDTO.SearchRequest request);

    /**
     * 관리자 삭제
     */
    void deleteAdmin(Long adminId);

    /**
     * 대시보드 통계 조회
     */
    AdminDTO.DashboardResponse getDashboardStats();

    /**
     * 마지막 로그인 시간 업데이트
     */
    void updateLastLoginTime(Long adminId);
}
