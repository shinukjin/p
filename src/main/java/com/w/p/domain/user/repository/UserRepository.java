package com.w.p.domain.user.repository;

import com.w.p.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    long countByRole(User.UserRole role);
    
    long countByRoleIn(List<User.UserRole> roles);
    
    @Query("SELECT u FROM User u WHERE " +
           "(:keyword IS NULL OR u.username LIKE %:keyword% OR u.name LIKE %:keyword% OR u.email LIKE %:keyword%) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(u.role IN ('SUPER_ADMIN', 'ADMIN', 'OPERATOR'))")
    Page<User> findAdminsBySearchCriteria(
        @Param("keyword") String keyword,
        @Param("role") User.UserRole role,
        @Param("status") User.UserStatus status,
        Pageable pageable
    );

    long countByStatus(User.UserStatus status);
    
    List<User> findByUsernameContainingOrNameContainingOrEmailContaining(
        String username, String name, String email);
}
