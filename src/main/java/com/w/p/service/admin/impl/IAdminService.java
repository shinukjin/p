package com.w.p.service.admin.impl;

import com.w.p.common.util.GlobalUtil;
import com.w.p.dto.admin.AdminDTO;
import com.w.p.entity.User;
import com.w.p.exception.AdminException;
import com.w.p.repository.UserRepository;
import com.w.p.repository.WeddingHallRepository;
import com.w.p.service.BaseService;
import com.w.p.service.admin.AdminService;
import com.w.p.component.jwt.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 관리자 서비스 구현체
 */
@Service
@Slf4j
@Transactional
public class IAdminService extends BaseService implements AdminService {

    private final WeddingHallRepository weddingHallRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    public IAdminService(UserRepository userRepository, WeddingHallRepository weddingHallRepository, 
                         PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        super(userRepository);
        this.weddingHallRepository = weddingHallRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public AdminDTO.LoginResponse login(AdminDTO.LoginRequest request) {
        log.info("관리자 로그인 시도: {}", GlobalUtil.maskPassword(request.getUsername()));

        User admin = findUserByUsername(request.getUsername());

        // 관리자 권한 확인
        if (!isAdminRole(admin.getRole())) {
            throw AdminException.accessDenied();
        }

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw AdminException.passwordMismatch();
        }

        // 상태 확인
        if (admin.getStatus() != User.UserStatus.ACTIVE) {
            throw AdminException.accessDenied();
        }

        // 마지막 로그인 시간 업데이트
        updateLastLoginTime(admin.getId());

        // JWT 토큰과 만료 시간 정보 생성
        var tokenInfo = jwtTokenProvider.createTokenWithExpiration(
            admin.getId(), admin.getUsername(), admin.getRole().name()
        );
        
        log.info("관리자 로그인 성공: {} (토큰 만료: {})", 
            GlobalUtil.maskPassword(admin.getUsername()), tokenInfo.getExpiresAtDate());

        return AdminDTO.LoginResponse.builder()
            .token(tokenInfo.getToken())
            .adminInfo(convertToAdminInfo(admin))
            .expiresAt(tokenInfo.getExpiresAt())
            .expiresIn(tokenInfo.getExpiresIn())
            .build();
    }

    @Override
    public AdminDTO.AdminInfo getAdminInfo(Long adminId) {
        User admin = findUserById(adminId);
        validateAdminRole(admin);
        return convertToAdminInfo(admin);
    }

    @Override
    public AdminDTO.AdminInfo createAdmin(AdminDTO.CreateRequest request) {
        log.info("관리자 생성 요청: {}", GlobalUtil.maskPassword(request.getUsername()));

        // 중복 확인
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw AdminException.usernameExists(request.getUsername());
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw AdminException.emailExists(request.getEmail());
        }

        User admin = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .role(request.getRole())
            .status(User.UserStatus.ACTIVE)
            .build();

        User savedAdmin = userRepository.save(admin);
        log.info("관리자 생성 완료: {}", GlobalUtil.maskPassword(savedAdmin.getUsername()));

        return convertToAdminInfo(savedAdmin);
    }

    @Override
    public AdminDTO.AdminInfo updateAdmin(Long adminId, AdminDTO.UpdateRequest request) {
        log.info("관리자 정보 수정 요청: {}", adminId);

        User admin = findUserById(adminId);
        validateAdminRole(admin);

        // 이메일 중복 확인 (자신 제외)
        if (!admin.getEmail().equals(request.getEmail()) && 
            userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw AdminException.emailExists(request.getEmail());
        }

        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPhone(request.getPhone());
        admin.setRole(request.getRole());
        admin.setStatus(request.getStatus());

        User updatedAdmin = userRepository.save(admin);
        log.info("관리자 정보 수정 완료: {}", adminId);

        return convertToAdminInfo(updatedAdmin);
    }

    @Override
    public void changePassword(Long adminId, AdminDTO.ChangePasswordRequest request) {
        log.info("관리자 비밀번호 변경 요청: {}", adminId);

        User admin = findUserById(adminId);

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
            throw AdminException.passwordMismatch();
        }

        // 새 비밀번호 확인
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw AdminException.newPasswordMismatch();
        }

        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(admin);

        log.info("관리자 비밀번호 변경 완료: {}", adminId);
    }

    @Override
    public void updateAdminStatus(Long adminId, String status) {
        log.info("관리자 상태 변경 요청: {} -> {}", adminId, status);

        User admin = findUserById(adminId);
        admin.setStatus(User.UserStatus.valueOf(status.toUpperCase()));
        userRepository.save(admin);

        log.info("관리자 상태 변경 완료: {} -> {}", adminId, status);
    }

    @Override
    public AdminDTO.ListResponse getAdminList(AdminDTO.SearchRequest request) {
        log.info("관리자 목록 조회 요청: {}", request);

        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        Page<User> adminPage = userRepository.findAdminsBySearchCriteria(
            request.getKeyword(),
            request.getRole(),
            request.getStatus(),
            pageable
        );

        List<AdminDTO.AdminInfo> adminInfos = adminPage.getContent().stream()
            .map(this::convertToAdminInfo)
            .collect(Collectors.toList());

        return AdminDTO.ListResponse.builder()
            .admins(adminInfos)
            .totalCount(adminPage.getTotalElements())
            .totalPages(adminPage.getTotalPages())
            .currentPage(request.getPage())
            .pageSize(request.getSize())
            .build();
    }

    @Override
    public void deleteAdmin(Long adminId) {
        log.info("관리자 삭제 요청: {}", adminId);

        User admin = findUserById(adminId);
        validateAdminRole(admin);

        userRepository.delete(admin);
        log.info("관리자 삭제 완료: {}", adminId);
    }

    @Override
    public AdminDTO.DashboardResponse getDashboardStats() {
        log.info("대시보드 통계 조회");

        long totalUsers = userRepository.countByRole(User.UserRole.USER);
        long totalAdmins = userRepository.countByRoleIn(List.of(
            User.UserRole.SUPER_ADMIN, 
            User.UserRole.ADMIN, 
            User.UserRole.OPERATOR
        ));
        long totalWeddingHalls = weddingHallRepository.countAllWeddingHalls();

        // TODO: 실제 통계 데이터 구현
        return AdminDTO.DashboardResponse.builder()
            .totalUsers(totalUsers)
            .totalApartments(0) // TODO: 아파트 매매 데이터 카운트
            .totalWeddingHalls(totalWeddingHalls)
            .totalWeddingServices(0) // TODO: 웨딩서비스 데이터 카운트
            .todayVisitors(0) // TODO: 방문자 통계
            .thisMonthVisitors(0) // TODO: 월간 방문자 통계
            .weeklyVisitors(List.of(0, 0, 0, 0, 0, 0, 0)) // TODO: 주간 방문자 차트 - 7일 데이터
            .monthlyVisitors(List.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)) // TODO: 월간 방문자 차트 - 12개월 데이터
            .build();
    }

    @Override
    public void updateLastLoginTime(Long adminId) {
        User admin = findUserById(adminId);
        admin.setLastLoginAt(LocalDateTime.now());
        userRepository.save(admin);
    }

    /**
     * 관리자 역할인지 확인
     */
    private boolean isAdminRole(User.UserRole role) {
        return role == User.UserRole.SUPER_ADMIN || 
               role == User.UserRole.ADMIN || 
               role == User.UserRole.OPERATOR;
    }
    
    /**
     * 관리자 권한 검증
     */
    private void validateAdminRole(User user) {
        if (!isAdminRole(user.getRole())) {
            throw AdminException.accessDenied();
        }
    }

    /**
     * User 엔티티를 AdminInfo DTO로 변환
     */
    private AdminDTO.AdminInfo convertToAdminInfo(User user) {
        return AdminDTO.AdminInfo.builder()
            .id(user.getId())
            .username(user.getUsername())
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole())
            .status(user.getStatus())
            .lastLoginAt(user.getLastLoginAt())
            .createdAt(user.getCreatedAt())
            .build();
    }
}