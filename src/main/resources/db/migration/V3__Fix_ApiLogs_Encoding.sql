-- 기존 API 로그 테이블 인코딩 수정 (UTF-8)
-- MySQL을 사용하는 경우에만 실행

-- 테이블이 존재하는 경우에만 실행
-- ALTER TABLE api_logs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- H2 데이터베이스의 경우 테이블을 다시 생성해야 할 수 있습니다
-- 기존 데이터 백업 후 테이블 삭제 및 재생성 권장

-- 임시로 테이블 이름 변경
-- RENAME TABLE api_logs TO api_logs_backup;

-- 새 테이블 생성 (UTF-8 인코딩)
CREATE TABLE IF NOT EXISTS api_logs_new (
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

-- 데이터 마이그레이션 (필요한 경우)
-- INSERT INTO api_logs_new SELECT * FROM api_logs_backup;

-- 기존 테이블 삭제 및 새 테이블 이름 변경
-- DROP TABLE api_logs_backup;
-- RENAME TABLE api_logs_new TO api_logs;
