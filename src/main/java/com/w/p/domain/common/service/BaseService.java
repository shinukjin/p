package com.w.p.domain.common.service;

import com.w.p.entity.User;

/**
 * 공통 서비스 기능을 제공하는 베이스 인터페이스
 */
public interface BaseService {

    /**
     * 사용자명으로 사용자 조회 (공통)
     */
    User findUserByUsername(String username);
    
    /**
     * ID로 사용자 조회 (공통)
     */
    User findUserById(Long userId);

    /**
     * String을 Long으로 안전하게 변환
     */
    Long parseStringToLong(String value);

    /**
     * String을 Double로 안전하게 변환
     */
    Double parseStringToDouble(String value);

    /**
     * String을 Integer로 안전하게 변환
     */
    Integer parseStringToInteger(String value);

    /**
     * 현재 로그인한 사용자 조회
     */
    User getCurrentUser();
}
