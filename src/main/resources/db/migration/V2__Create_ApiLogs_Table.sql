-- API 로그 테이블 생성 (UTF-8 인코딩 설정)
CREATE TABLE api_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    endpoint VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    method VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    request_body TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    response_status INT,
    response_body TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    error_message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    execution_time BIGINT,
    ip_address VARCHAR(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    user_agent TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    log_level VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INFO',
    
    INDEX idx_user_id (user_id),
    INDEX idx_username (username),
    INDEX idx_endpoint (endpoint),
    INDEX idx_method (method),
    INDEX idx_response_status (response_status),
    INDEX idx_log_level (log_level),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id_created_at (user_id, created_at),
    INDEX idx_log_level_created_at (log_level, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 로그 레벨 체크 제약 조건
ALTER TABLE api_logs 
ADD CONSTRAINT chk_log_level 
CHECK (log_level IN ('INFO', 'WARNING', 'ERROR', 'DEBUG'));

-- 응답 상태 체크 제약 조건
ALTER TABLE api_logs 
ADD CONSTRAINT chk_response_status 
CHECK (response_status >= 100 AND response_status <= 599);

-- 실행 시간 체크 제약 조건
ALTER TABLE api_logs 
ADD CONSTRAINT chk_execution_time 
CHECK (execution_time >= 0);

-- 메서드 체크 제약 조건
ALTER TABLE api_logs 
ADD CONSTRAINT chk_method 
CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'));
