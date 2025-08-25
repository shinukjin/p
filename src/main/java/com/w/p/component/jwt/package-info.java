/**
 * JWT (JSON Web Token) 관련 컴포넌트들을 포함하는 패키지
 * 
 * <h2>주요 클래스</h2>
 * <ul>
 *   <li><strong>JwtTokenProvider</strong>: JWT 토큰 생성 및 기본적인 JWT 작업</li>
 *   <li><strong>TokenInfo</strong>: 토큰 정보를 담는 데이터 클래스</li>
 *   <li><strong>TokenValidator</strong>: 토큰 유효성 검증 및 클레임 추출</li>
 * </ul>
 * 
 * <h2>사용 예시</h2>
 * <pre>
 * // 토큰 생성
 * TokenInfo tokenInfo = jwtTokenProvider.createTokenWithExpiration(userId, username, role);
 * 
 * // 토큰 검증
 * ValidationResult result = tokenValidator.validateToken(token);
 * if (result.isValid()) {
 *     // 토큰이 유효함
 *     Claims claims = result.getClaims();
 * }
 * </pre>
 * 
 * <h2>설정</h2>
 * application.properties에서 다음 설정이 필요합니다:
 * <ul>
 *   <li>jwt.secret: JWT 서명에 사용할 비밀키</li>
 *   <li>jwt.expiration: 토큰 만료 시간 (밀리초)</li>
 * </ul>
 * 
 * @author 시스템 관리자
 * @version 1.0
 * @since 2025
 */
package com.w.p.component.jwt;
