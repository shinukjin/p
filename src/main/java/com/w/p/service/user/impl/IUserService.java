package com.w.p.service.user.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.w.p.dto.user.UserDTO.*;
import com.w.p.entity.User;
import com.w.p.exception.UserException;
import com.w.p.repository.UserRepository;
import com.w.p.service.BaseService;
import com.w.p.service.user.UserService;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class IUserService extends BaseService implements UserService{

    private final PasswordEncoder passwordEncoder;
    
    public IUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        super(userRepository);
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public SignupResponse signup(Signup request) {

        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw UserException.usernameExists(request.getUsername());
        }

        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw UserException.emailExists(request.getEmail());
        }

        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .role(User.UserRole.USER)
            .status(User.UserStatus.ACTIVE)
            .build();

        User savedUser = userRepository.save(user);

        return SignupResponse.builder()
            .id(savedUser.getId())
            .username(savedUser.getUsername())
            .name(savedUser.getName())
            .email(savedUser.getEmail())
            .phone(savedUser.getPhone())
            .role(savedUser.getRole().name())
            .status(savedUser.getStatus().name())
            .createdAt(savedUser.getCreatedAt())
            .message("회원가입이 성공적으로 완료되었습니다.")
            .build();
    }

    @Override
    public ListResponse getUserListForAdmin(int page, int size, String searchKeyword, String role, String status) {
        Pageable pageable = PageRequest.of(page, size);
        
        // 실제로는 검색 조건에 따른 쿼리를 구현해야 함
        // 여기서는 간단하게 모든 사용자를 조회
        Page<User> userPage = userRepository.findAll(pageable);
        
        List<UserInfo> userInfos = userPage.getContent().stream()
            .map(this::convertToUserInfo)
            .collect(Collectors.toList());
        
        return ListResponse.builder()
            .users(userInfos)
            .currentPage(page)
            .totalPages(userPage.getTotalPages())
            .totalElements(userPage.getTotalElements())
            .pageSize(size)
            .build();
    }

    @Override
    public UserInfo getUserInfoForAdmin(Long userId) {
        User user = findUserById(userId);
        return convertToUserInfo(user);
    }

    @Override
    public void updateUserStatus(Long userId, String status) {
        User user = findUserById(userId);
        
        try {
            User.UserStatus userStatus = User.UserStatus.valueOf(status.toUpperCase());
            user.setStatus(userStatus);
            userRepository.save(user);
            log.info("사용자 {} 상태 변경: {}", userId, status);
        } catch (IllegalArgumentException e) {
            throw UserException.invalidStatus(status);
        }
    }

    @Override
    public void updateUserRole(Long userId, String role) {
        User user = findUserById(userId);
        
        try {
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            user.setRole(userRole);
            userRepository.save(user);
            log.info("사용자 {} 역할 변경: {}", userId, role);
        } catch (IllegalArgumentException e) {
            throw UserException.invalidRole(role);
        }
    }

    @Override
    public void unlockUser(Long userId) {
        User user = findUserById(userId);
        
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);
        log.info("사용자 {} 계정 잠금 해제", userId);
    }

    @Override
    public LoginHistoryResponse getUserLoginHistory(Long userId, int page, int size) {
        // 실제로는 로그인 기록 테이블에서 조회해야 함
        // 여기서는 더미 데이터 반환
        List<LoginHistory> loginHistory = new ArrayList<>();
        
        return LoginHistoryResponse.builder()
            .loginHistory(loginHistory)
            .currentPage(page)
            .totalPages(0)
            .totalElements(0)
            .pageSize(size)
            .build();
    }

    @Override
    public StatisticsResponse getUserStatistics() {
        // 실제로는 데이터베이스에서 통계를 계산해야 함
        long totalUsers = userRepository.count();
        
        return StatisticsResponse.builder()
            .totalUsers(totalUsers)
            .activeUsers(totalUsers) // 실제로는 ACTIVE 상태 사용자 수 계산
            .inactiveUsers(0)
            .lockedUsers(0)
            .newUsersThisMonth(0)
            .newUsersThisWeek(0)
            .totalLoginsToday(0)
            .totalLoginsThisWeek(0)
            .build();
    }

    @Override
    public BulkUpdateResponse bulkUpdateUserStatus(BulkStatusUpdateRequest request) {
        int successCount = 0;
        int failureCount = 0;
        List<String> failureReasons = new ArrayList<>();
        
        for (Long userId : request.getUserIds()) {
            try {
                updateUserStatus(userId, request.getStatus());
                successCount++;
            } catch (Exception e) {
                failureCount++;
                failureReasons.add("사용자 " + userId + ": " + e.getMessage());
            }
        }
        
        return BulkUpdateResponse.builder()
            .successCount(successCount)
            .failureCount(failureCount)
            .failureReasons(failureReasons)
            .message(String.format("일괄 업데이트 완료: 성공 %d건, 실패 %d건", successCount, failureCount))
            .build();
    }

    @Override
    public void updateUserInfo(Long userId, UpdateRequest request) {
        User user = findUserById(userId);
        
        // 사용자명 중복 체크 (자신의 사용자명은 제외)
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw UserException.usernameExists(request.getUsername());
            }
            user.setUsername(request.getUsername());
        }
        
        // 이메일 중복 체크 (자신의 이메일은 제외)
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw UserException.emailExists(request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        userRepository.save(user);
        log.info("사용자 {} 정보 업데이트 완료", userId);
    }

    @Override
    public void updateUserTotalBudget(Long userId, TotalBudgetUpdateRequest request) {
        User user = findUserById(userId);
        
        if (request.getTotalBudget() != null) {
            user.setTotalBudget(request.getTotalBudget());
            userRepository.save(user);
            log.info("사용자 {} 총 예산 업데이트: {}", userId, request.getTotalBudget());
        }
    }

    @Override
    public UserInfo getCurrentUserInfo() {
        User currentUser = getCurrentUser();
        return convertToUserInfo(currentUser);
    }

    @Override
    public User findUserById(Long userId) {
        return super.findUserById(userId);
    }

    @Override
    public ListResponse getUserList(int page, int size, String search, String role, String status) {
        return getUserListForAdmin(page, size, search, role, status);
    }

    /**
     * User 엔티티를 UserInfo DTO로 변환
     */
    private UserInfo convertToUserInfo(User user) {
        return UserInfo.builder()
            .id(user.getId())
            .username(user.getUsername())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .status(user.getStatus().name())
            .totalBudget(user.getTotalBudget())
            .lastLoginAt(user.getLastLoginAt())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}
