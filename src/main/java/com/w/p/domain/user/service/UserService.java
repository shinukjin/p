package com.w.p.domain.user.service;

import com.w.p.domain.user.dto.UserDTO.*;
import com.w.p.entity.User;

public interface UserService {

    /**
     * 회원가입
     */
    SignupResponse signup(Signup request);

    /**
     * 사용자 목록 조회
     */
    ListResponse getUserList(int page, int size, String search, String role, String status);

    /**
     * 관리자용 사용자 목록 조회 (페이징)
     */
    ListResponse getUserListForAdmin(int page, int size, String searchKeyword, String role, String status);

    /**
     * 관리자용 사용자 상세 정보 조회
     */
    UserInfo getUserInfoForAdmin(Long userId);

    /**
     * 사용자 상태 변경
     */
    void updateUserStatus(Long userId, String status);

    /**
     * 사용자 역할 변경
     */
    void updateUserRole(Long userId, String role);

    /**
     * 사용자 계정 잠금 해제
     */
    void unlockUser(Long userId);

    /**
     * 사용자 로그인 기록 조회
     */
    LoginHistoryResponse getUserLoginHistory(Long userId, int page, int size);

    /**
     * 사용자 통계 정보 조회
     */
    StatisticsResponse getUserStatistics();

    /**
     * 사용자 상태 일괄 업데이트
     */
    BulkUpdateResponse bulkUpdateUserStatus(BulkStatusUpdateRequest request);

    /**
     * 사용자 정보 업데이트
     */
    void updateUserInfo(Long userId, UpdateRequest request);

    /**
     * 사용자 총 예산 업데이트
     */
    void updateUserTotalBudget(Long userId, TotalBudgetUpdateRequest request);

    /**
     * 현재 로그인한 사용자 정보 조회
     */
    UserInfo getCurrentUserInfo();

    /**
     * ID로 사용자 조회
     */
    User findUserById(Long userId);

    /**
     * 사용자 삭제
     */
    void deleteUser(Long userId);
}
