-- 공통코드 테이블 생성
CREATE TABLE common_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code_group VARCHAR(50) NOT NULL COMMENT '코드 그룹',
    code_value VARCHAR(50) NOT NULL COMMENT '코드값',
    code_name VARCHAR(100) NOT NULL COMMENT '코드명',
    description VARCHAR(500) COMMENT '코드 설명',
    sort_order INT COMMENT '정렬 순서',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '사용 여부',
    parent_id BIGINT COMMENT '부모 코드 ID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    created_by VARCHAR(50) COMMENT '생성자',
    updated_by VARCHAR(50) COMMENT '수정자',
    
    -- 인덱스
    INDEX idx_code_group (code_group),
    INDEX idx_code_group_value (code_group, code_value),
    INDEX idx_code_group_name (code_group, code_name),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order),
    
    -- 제약조건
    UNIQUE KEY uk_code_group_value (code_group, code_value),
    FOREIGN KEY (parent_id) REFERENCES common_codes(id) ON DELETE SET NULL
) COMMENT '공통코드 테이블';

-- 초기 지역코드 데이터 삽입
INSERT INTO common_codes (code_group, code_value, code_name, description, sort_order, is_active) VALUES
-- 서울시
('001', '11680', '강남구', '서울특별시 강남구', 1, TRUE),
('001', '11650', '서초구', '서울특별시 서초구', 2, TRUE),
('001', '11590', '동작구', '서울특별시 동작구', 3, TRUE),
('001', '11620', '관악구', '서울특별시 관악구', 4, TRUE),
('001', '11560', '영등포구', '서울특별시 영등포구', 5, TRUE),
('001', '11530', '구로구', '서울특별시 구로구', 6, TRUE),
('001', '11500', '강서구', '서울특별시 강서구', 7, TRUE),
('001', '11470', '양천구', '서울특별시 양천구', 8, TRUE),
('001', '11440', '마포구', '서울특별시 마포구', 9, TRUE),
('001', '11410', '서대문구', '서울특별시 서대문구', 10, TRUE),

-- 경기도
('001', '41171', '안양시 만안구', '경기도 안양시 만안구', 11, TRUE),
('001', '41173', '안양시 동안구', '경기도 안양시 동안구', 12, TRUE),
('001', '41185', '과천시', '경기도 과천시', 13, TRUE),
('001', '41210', '의왕시', '경기도 의왕시', 14, TRUE),
('001', '41450', '하남시', '경기도 하남시', 15, TRUE),
('001', '41250', '용인시 기흥구', '경기도 용인시 기흥구', 16, TRUE),
('001', '41271', '용인시 수지구', '경기도 용인시 수지구', 17, TRUE),
('001', '41281', '용인시 처인구', '경기도 용인시 처인구', 18, TRUE),
('001', '41290', '파주시', '경기도 파주시', 19, TRUE),
('001', '41570', '김포시', '경기도 김포시', 20, TRUE),
('001', '41360', '광주시', '경기도 광주시', 21, TRUE),
('001', '41670', '여주시', '경기도 여주시', 22, TRUE),
('001', '41370', '오산시', '경기도 오산시', 23, TRUE),
('001', '41430', '시흥시', '경기도 시흥시', 24, TRUE),
('001', '41410', '군포시', '경기도 군포시', 25, TRUE),
('001', '41460', '의정부시', '경기도 의정부시', 26, TRUE),
('001', '41480', '남양주시', '경기도 남양주시', 27, TRUE),
('001', '41500', '고양시 덕양구', '경기도 고양시 덕양구', 28, TRUE),
('001', '41590', '고양시 일산동구', '경기도 고양시 일산동구', 29, TRUE),
('001', '41610', '고양시 일산서구', '경기도 고양시 일산서구', 30, TRUE),
('001', '41630', '양주시', '경기도 양주시', 31, TRUE),
('001', '41310', '구리시', '경기도 구리시', 32, TRUE),
('001', '41650', '포천시', '경기도 포천시', 33, TRUE),
('001', '41690', '연천군', '경기도 연천군', 34, TRUE),
('001', '41800', '가평군', '경기도 가평군', 35, TRUE),
('001', '41820', '양평군', '경기도 양평군', 36, TRUE),

-- 부천시
('001', '41190', '부천시', '경기도 부천시', 37, TRUE),
('001', '41192', '부천시 원미구', '경기도 부천시 원미구', 38, TRUE),
('001', '41194', '부천시 소사구', '경기도 부천시 소사구', 39, TRUE),
('001', '41196', '부천시 오정구', '경기도 부천시 오정구', 40, TRUE),

-- 인천시
('001', '28110', '인천시 중구', '인천광역시 중구', 41, TRUE),
('001', '28140', '인천시 동구', '인천광역시 동구', 42, TRUE),
('001', '28177', '인천시 미추홀구', '인천광역시 미추홀구', 43, TRUE),
('001', '28185', '인천시 연수구', '인천광역시 연수구', 44, TRUE),
('001', '28200', '인천시 남동구', '인천광역시 남동구', 45, TRUE),
('001', '28237', '인천시 부평구', '인천광역시 부평구', 46, TRUE),
('001', '28245', '인천시 계양구', '인천광역시 계양구', 47, TRUE),
('001', '28260', '인천시 서구', '인천광역시 서구', 48, TRUE),
('001', '28710', '인천시 강화군', '인천광역시 강화군', 49, TRUE),
('001', '28720', '인천시 옹진군', '인천광역시 옹진군', 50, TRUE),

-- 성남시
('001', '41131', '성남시 수정구', '경기도 성남시 수정구', 51, TRUE),
('001', '41135', '성남시 중원구', '경기도 성남시 중원구', 52, TRUE),
('001', '41150', '성남시 분당구', '경기도 성남시 분당구', 53, TRUE),

-- 수원시
('001', '41110', '수원시 장안구', '경기도 수원시 장안구', 54, TRUE),
('001', '41113', '수원시 권선구', '경기도 수원시 권선구', 55, TRUE),
('001', '41115', '수원시 팔달구', '경기도 수원시 팔달구', 56, TRUE),
('001', '41117', '수원시 영통구', '경기도 수원시 영통구', 57, TRUE),

-- 기타
('001', '41220', '평택시', '경기도 평택시', 58, TRUE),
('001', '41270', '안산시 상록구', '경기도 안산시 상록구', 59, TRUE),
('001', '41273', '안산시 단원구', '경기도 안산시 단원구', 60, TRUE);

-- 부동산 유형 코드
INSERT INTO common_codes (code_group, code_value, code_name, description, sort_order, is_active) VALUES
('002', 'APT', '아파트', '아파트', 1, TRUE),
('002', 'VILLA', '빌라', '빌라', 2, TRUE),
('002', 'HOUSE', '단독주택', '단독주택', 3, TRUE),
('002', 'OFFICE', '사무실', '사무실', 4, TRUE),
('002', 'SHOP', '상가', '상가', 5, TRUE);

-- 거래 유형 코드
INSERT INTO common_codes (code_group, code_value, code_name, description, sort_order, is_active) VALUES
('003', 'SALE', '매매', '매매', 1, TRUE),
('003', 'RENT', '전세', '전세', 2, TRUE),
('003', 'MONTHLY', '월세', '월세', 3, TRUE);

-- 로그 레벨 코드
INSERT INTO common_codes (code_group, code_value, code_name, description, sort_order, is_active) VALUES
('004', 'INFO', '정보', '정보 로그', 1, TRUE),
('004', 'WARN', '경고', '경고 로그', 2, TRUE),
('004', 'ERROR', '오류', '오류 로그', 3, TRUE),
('004', 'DEBUG', '디버그', '디버그 로그', 4, TRUE);

-- 사용자 상태 코드
INSERT INTO common_codes (code_group, code_value, code_name, description, sort_order, is_active) VALUES
('005', 'ACTIVE', '활성', '활성 사용자', 1, TRUE),
('005', 'INACTIVE', '비활성', '비활성 사용자', 2, TRUE),
('005', 'SUSPENDED', '정지', '정지된 사용자', 3, TRUE),
('005', 'DELETED', '삭제', '삭제된 사용자', 4, TRUE);

-- 사용자 역할 코드
INSERT INTO common_codes (code_group, code_value, code_name, description, sort_order, is_active) VALUES
('006', 'USER', '일반사용자', '일반 사용자', 1, TRUE),
('006', 'ADMIN', '관리자', '시스템 관리자', 2, TRUE),
('006', 'MODERATOR', '모더레이터', '커뮤니티 모더레이터', 3, TRUE);
