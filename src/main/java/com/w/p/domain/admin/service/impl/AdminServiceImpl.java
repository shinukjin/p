package com.w.p.domain.admin.service.impl;

import com.w.p.domain.admin.service.AdminService;
import com.w.p.domain.user.repository.UserRepository;
import com.w.p.dto.admin.AdminDTO;
import com.w.p.entity.User;
import com.w.p.exception.AdminException;
import com.w.p.component.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AdminDTO.LoginResponse adminLogin(AdminDTO.LoginRequest request) {
        log.info("관리자 로그인 시도: {}", request.getUsername());
        
        User admin = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> AdminException.accessDenied());

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw AdminException.passwordMismatch();
        }

        if (admin.getRole() != User.UserRole.ADMIN) {
            throw AdminException.accessDenied();
        }

        String token = jwtTokenProvider.createToken(admin.getId(), admin.getUsername(), admin.getRole().name());
        long expiresAt = jwtTokenProvider.getExpirationDateFromToken(token).getTime();
        long expiresIn = jwtTokenProvider.getExpirationDateFromToken(token).getTime() - System.currentTimeMillis();

        log.info("관리자 로그인 성공: {}", admin.getUsername());

        return AdminDTO.LoginResponse.builder()
                .token(token)
                .adminInfo(AdminDTO.AdminInfo.builder()
                        .id(admin.getId())
                        .username(admin.getUsername())
                        .name(admin.getName())
                        .email(admin.getEmail())
                        .role(admin.getRole())
                        .status(admin.getStatus())
                        .createdAt(admin.getCreatedAt())
                        .build())
                .expiresAt(expiresAt)
                .expiresIn(expiresIn)
                .build();
    }

    @Override
    public AdminDTO.SystemStatisticsResponse getSystemStatistics() {
        log.info("시스템 통계 조회");
        
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus(User.UserStatus.ACTIVE);
        long inactiveUsers = userRepository.countByStatus(User.UserStatus.INACTIVE);
        long adminUsers = userRepository.countByRole(User.UserRole.ADMIN);
        long regularUsers = userRepository.countByRole(User.UserRole.USER);

        return AdminDTO.SystemStatisticsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .adminUsers(adminUsers)
                .regularUsers(regularUsers)
                .build();
    }

    @Override
    public List<AdminDTO.UserInfo> getAllUsers() {
        log.info("전체 사용자 목록 조회");
        
        return userRepository.findAll().stream()
                .map(user -> AdminDTO.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public AdminDTO.UserInfo getUserById(Long userId) {
        log.info("사용자 상세 정보 조회: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AdminException.notFound(userId));

        return AdminDTO.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public AdminDTO.UserInfo updateUserStatus(Long userId, User.UserStatus status) {
        log.info("사용자 상태 업데이트: userId={}, status={}", userId, status);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AdminException.notFound(userId));

        user.setStatus(status);
        User savedUser = userRepository.save(user);

        log.info("사용자 상태 업데이트 완료: userId={}, status={}", userId, status);

        return AdminDTO.UserInfo.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    public AdminDTO.UserInfo updateUserRole(Long userId, User.UserRole role) {
        log.info("사용자 역할 업데이트: userId={}, role={}", userId, role);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AdminException.notFound(userId));

        user.setRole(role);
        User savedUser = userRepository.save(user);

        log.info("사용자 역할 업데이트 완료: userId={}, role={}", userId, role);

        return AdminDTO.UserInfo.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    public void deleteUser(Long userId) {
        log.info("사용자 삭제: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AdminException.notFound(userId));

        userRepository.delete(user);

        log.info("사용자 삭제 완료: {}", userId);
    }

    @Override
    public List<AdminDTO.UserInfo> searchUsers(String keyword) {
        log.info("사용자 검색: {}", keyword);
        
        List<User> users = userRepository.findByUsernameContainingOrNameContainingOrEmailContaining(
                keyword, keyword, keyword);

        return users.stream()
                .map(user -> AdminDTO.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void updateLastLoginTime(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AdminException.notFound(userId));
        
        // 마지막 로그인 시간 업데이트 로직
        userRepository.save(user);
    }

    @Override
    public AdminDTO.DashboardResponse getDashboard() {
        log.info("관리자 대시보드 조회");
        
        // 실제 구현에서는 각 도메인의 Repository를 주입받아서 사용
        long totalUsers = userRepository.count();
        long totalApartments = 0; // ApartmentRepository.count()
        long totalWeddingHalls = 0; // WeddingHallRepository.count()
        long totalWeddingServices = 0; // WeddingServiceRepository.count()
        long todayVisitors = 0; // 방문자 통계 로직
        long thisMonthVisitors = 0; // 월별 방문자 통계 로직
        
        // 임시 데이터 (실제 구현에서는 데이터베이스에서 조회)
        List<Integer> weeklyVisitors = List.of(120, 150, 180, 200, 220, 250, 280);
        List<Integer> monthlyVisitors = List.of(1500, 1800, 2200, 2500, 2800, 3000, 3200, 3500, 3800, 4000, 4200, 4500);

        return AdminDTO.DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalApartments(totalApartments)
                .totalWeddingHalls(totalWeddingHalls)
                .totalWeddingServices(totalWeddingServices)
                .todayVisitors(todayVisitors)
                .thisMonthVisitors(thisMonthVisitors)
                .weeklyVisitors(weeklyVisitors)
                .monthlyVisitors(monthlyVisitors)
                .build();
    }

    @Override
    public List<AdminDTO.ChartData> getVisitorChartData() {
        log.info("방문자 차트 데이터 조회");
        
        // 임시 데이터 (실제 구현에서는 데이터베이스에서 조회)
        return List.of(
                AdminDTO.ChartData.builder().label("월").value(120).build(),
                AdminDTO.ChartData.builder().label("화").value(150).build(),
                AdminDTO.ChartData.builder().label("수").value(180).build(),
                AdminDTO.ChartData.builder().label("목").value(200).build(),
                AdminDTO.ChartData.builder().label("금").value(220).build(),
                AdminDTO.ChartData.builder().label("토").value(250).build(),
                AdminDTO.ChartData.builder().label("일").value(280).build()
        );
    }

    @Override
    public List<AdminDTO.ChartData> getMonthlyChartData() {
        log.info("월별 차트 데이터 조회");
        
        // 임시 데이터 (실제 구현에서는 데이터베이스에서 조회)
        return List.of(
                AdminDTO.ChartData.builder().label("1월").value(1500).build(),
                AdminDTO.ChartData.builder().label("2월").value(1800).build(),
                AdminDTO.ChartData.builder().label("3월").value(2200).build(),
                AdminDTO.ChartData.builder().label("4월").value(2500).build(),
                AdminDTO.ChartData.builder().label("5월").value(2800).build(),
                AdminDTO.ChartData.builder().label("6월").value(3000).build(),
                AdminDTO.ChartData.builder().label("7월").value(3200).build(),
                AdminDTO.ChartData.builder().label("8월").value(3500).build(),
                AdminDTO.ChartData.builder().label("9월").value(3800).build(),
                AdminDTO.ChartData.builder().label("10월").value(4000).build(),
                AdminDTO.ChartData.builder().label("11월").value(4200).build(),
                AdminDTO.ChartData.builder().label("12월").value(4500).build()
        );
    }
}
