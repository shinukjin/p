package com.w.p.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보를 저장하는 테이블.
 * 회원 가입 시 사용자 정보 저장.
 */
@Entity
@Table(name = "WP_USERS")
@Getter
@NoArgsConstructor
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    public User(String username, String password, String role){
        this.username = username;
        this.password = password;
        this.role = role;
    }

}
