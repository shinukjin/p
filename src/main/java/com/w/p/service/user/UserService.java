package com.w.p.service.user;

import com.w.p.dto.user.UserDTO.*;

public interface UserService {

    public SignupResponse signup(Signup request);

    // 관리자용 사용자 관리 메서드들
    
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
     * 사용자 일괄 상태 변경
     */
    BulkUpdateResponse bulkUpdateUserStatus(BulkStatusUpdateRequest request);
}
