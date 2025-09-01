package com.w.p.domain.admin.service;

import com.w.p.dto.admin.AdminDTO;
import com.w.p.entity.User;

import java.util.List;

/**
 * 관리자 서비스 인터페이스
 */
public interface AdminService {

    /**
     * 관리자 로그인
     */
    AdminDTO.LoginResponse adminLogin(AdminDTO.LoginRequest request);

    /**
     * 시스템 통계 조회
     */
    AdminDTO.SystemStatisticsResponse getSystemStatistics();

    /**
     * 전체 사용자 목록 조회
     */
    List<AdminDTO.UserInfo> getAllUsers();

    /**
     * 사용자 상세 정보 조회
     */
    AdminDTO.UserInfo getUserById(Long userId);

    /**
     * 사용자 상태 업데이트
     */
    AdminDTO.UserInfo updateUserStatus(Long userId, User.UserStatus status);

    /**
     * 사용자 역할 업데이트
     */
    AdminDTO.UserInfo updateUserRole(Long userId, User.UserRole role);

    /**
     * 사용자 삭제
     */
    void deleteUser(Long userId);

    /**
     * 사용자 검색
     */
    List<AdminDTO.UserInfo> searchUsers(String keyword);

    /**
     * 마지막 로그인 시간 업데이트
     */
    void updateLastLoginTime(Long userId);

    /**
     * 관리자 대시보드 조회
     */
    AdminDTO.DashboardResponse getDashboard();

    /**
     * 방문자 차트 데이터 조회
     */
    List<AdminDTO.ChartData> getVisitorChartData();

    /**
     * 월별 차트 데이터 조회
     */
    List<AdminDTO.ChartData> getMonthlyChartData();
}
