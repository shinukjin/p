package com.w.p.domain.user.service.impl;

import com.w.p.domain.user.dto.UserDTO;
import com.w.p.entity.User;
import com.w.p.domain.user.repository.UserRepository;
import com.w.p.domain.user.service.UserService;
import com.w.p.component.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import org.springframework.data.domain.PageRequest;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UserDTO.SignupResponse signup(UserDTO.Signup request) {
        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(User.UserRole.USER)
                .status(User.UserStatus.ACTIVE)
                .totalBudget(0L)
                .build();

        User savedUser = userRepository.save(user);
        
        return UserDTO.SignupResponse.builder()
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
    public UserDTO.ListResponse getUserList(int page, int size, String search, String role, String status) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> userPage = userRepository.findAll(pageable);
        
        List<UserDTO.UserInfo> userInfos = userPage.getContent().stream()
                .map(this::convertToUserInfo)
                .collect(Collectors.toList());

        return UserDTO.ListResponse.builder()
                .users(userInfos)
                .totalCount((int) userPage.getTotalElements())
                .currentPage(page)
                .totalPages(userPage.getTotalPages())
                .pageSize(size)
                .build();
    }

    @Override
    public UserDTO.ListResponse getUserListForAdmin(int page, int size, String searchKeyword, String role, String status) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> userPage = userRepository.findAll(pageable);
        
        List<UserDTO.UserInfo> userInfos = userPage.getContent().stream()
                .map(this::convertToUserInfo)
                .collect(Collectors.toList());

        return UserDTO.ListResponse.builder()
                .users(userInfos)
                .totalCount((int) userPage.getTotalElements())
                .currentPage(page)
                .totalPages(userPage.getTotalPages())
                .pageSize(size)
                .build();
    }

    @Override
    public UserDTO.UserInfo getUserInfoForAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
        
        return convertToUserInfo(user);
    }

    @Override
    public void updateUserStatus(Long userId, String status) {
        User user = findUserById(userId);
        
        try {
            User.UserStatus newStatus = User.UserStatus.valueOf(status.toUpperCase());
            user.setStatus(newStatus);
            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 상태값입니다: " + status);
        }
    }

    @Override
    public void updateUserRole(Long userId, String role) {
        User user = findUserById(userId);
        
        try {
            User.UserRole newRole = User.UserRole.valueOf(role.toUpperCase());
            user.setRole(newRole);
            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 역할값입니다: " + role);
        }
    }

    @Override
    public void unlockUser(Long userId) {
        User user = findUserById(userId);
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);
    }

    @Override
    public UserDTO.LoginHistoryResponse getUserLoginHistory(Long userId, int page, int size) {
        // 로그인 이력 조회 로직 구현
        List<UserDTO.LoginHistory> histories = new ArrayList<>();
        
        return UserDTO.LoginHistoryResponse.builder()
                .histories(histories)
                .totalCount(histories.size())
                .currentPage(page)
                .totalPages(1)
                .build();
    }

    @Override
    public UserDTO.StatisticsResponse getUserStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus(User.UserStatus.ACTIVE);
        long inactiveUsers = userRepository.countByStatus(User.UserStatus.INACTIVE);
        
        return UserDTO.StatisticsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .newUsersThisMonth(0)
                .newUsersThisWeek(0)
                .build();
    }

    @Override
    public UserDTO.BulkUpdateResponse bulkUpdateUserStatus(UserDTO.BulkStatusUpdateRequest request) {
        int successCount = 0;
        int failureCount = 0;
        List<String> errors = new ArrayList<>();
        
        for (Long userId : request.getUserIds()) {
            try {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
                
                user.setStatus(User.UserStatus.valueOf(request.getStatus().toUpperCase()));
                userRepository.save(user);
                successCount++;
            } catch (Exception e) {
                failureCount++;
                errors.add("사용자 ID " + userId + ": " + e.getMessage());
            }
        }
        
        return UserDTO.BulkUpdateResponse.builder()
                .successCount(successCount)
                .failureCount(failureCount)
                .errors(errors)
                .build();
    }

    @Override
    public void updateUserInfo(Long userId, UserDTO.UpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
        
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        userRepository.save(user);
    }

    @Override
    public void updateUserTotalBudget(Long userId, UserDTO.TotalBudgetUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
        
        user.setTotalBudget(request.getTotalBudget());
        userRepository.save(user);
    }

    @Override
    public UserDTO.UserInfo getCurrentUserInfo() {
        // 현재 로그인한 사용자 정보 조회 로직 구현
        // SecurityContext에서 사용자 정보를 가져와야 함
        return null;
    }

    @Override
    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
    }

    private UserDTO.UserInfo convertToUserInfo(User user) {
        return UserDTO.UserInfo.builder()
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

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
        
        userRepository.delete(user);
    }
}
