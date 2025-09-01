package com.w.p.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "api_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "endpoint", nullable = false)
    private String endpoint;
    
    @Column(name = "method", nullable = false)
    private String method;
    
    @Column(name = "request_body", columnDefinition = "TEXT")
    private String requestBody;
    
    @Column(name = "query_parameters", columnDefinition = "TEXT")
    private String queryParameters;
    
    @Column(name = "response_status")
    private Integer responseStatus;
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "execution_time")
    private Long executionTime; // milliseconds
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "log_level")
    @Enumerated(EnumType.STRING)
    private LogLevel logLevel;
    
    public enum LogLevel {
        INFO, WARNING, ERROR, DEBUG
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
