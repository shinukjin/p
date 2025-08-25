-- User 테이블에 total_budget 컬럼 추가
ALTER TABLE WP_USERS ADD COLUMN total_budget BIGINT DEFAULT 10000000;

-- 기존 사용자들의 total_budget을 기본값으로 설정
UPDATE WP_USERS SET total_budget = 10000000 WHERE total_budget IS NULL;
