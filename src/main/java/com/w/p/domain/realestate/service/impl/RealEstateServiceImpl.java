package com.w.p.domain.realestate.service.impl;

import com.w.p.common.util.FileUploadUtil;
import com.w.p.domain.realestate.dto.RealEstateDTO;
import com.w.p.domain.realestate.service.RealEstateService;
import com.w.p.domain.realestate.repository.RealEstateRepository;
import com.w.p.entity.RealEstate;
import com.w.p.entity.User;
import com.w.p.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 부동산 서비스 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RealEstateServiceImpl implements RealEstateService {

    private final RealEstateRepository realEstateRepository;
    private final UserRepository userRepository;
    private final FileUploadUtil fileUploadUtil;

    @Override
    public List<RealEstateDTO> getRealEstates(String username) {
        log.info("사용자별 부동산 목록 조회: {}", username);
        
        User user = getUserByUsername(username);
        List<RealEstate> realEstates = realEstateRepository.findByUserOrderByCreatedAtDesc(user);
        
        return realEstates.stream()
                .map(RealEstateDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public RealEstateDTO getRealEstate(String username, Long id) {
        log.info("부동산 상세 조회: username={}, id={}", username, id);
        
        User user = getUserByUsername(username);
        RealEstate realEstate = getRealEstateByIdAndUser(id, user);
        
        return RealEstateDTO.from(realEstate);
    }

    @Override
    @Transactional
    public RealEstateDTO createRealEstate(String username, RealEstateDTO.CreateRequest request) {
        try {
            // 사용자 확인
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));

            // 부동산 엔티티 생성
            RealEstate realEstate = new RealEstate();
            realEstate.setUser(user);
            realEstate.setTitle(request.getTitle());
            realEstate.setPropertyType(RealEstate.PropertyType.valueOf(request.getPropertyType()));
            realEstate.setTransactionType(RealEstate.TransactionType.valueOf(request.getTransactionType()));
            realEstate.setAddress(request.getAddress());
            realEstate.setDetailAddress(request.getDetailAddress());
            realEstate.setLatitude(Double.parseDouble(request.getLatitude()));
            realEstate.setLongitude(Double.parseDouble(request.getLongitude()));
            realEstate.setPrice(parseLongOrNull(request.getPrice()));
            realEstate.setMonthlyRent(parseLongOrNull(request.getMonthlyRent()));
            realEstate.setDeposit(parseLongOrNull(request.getDeposit()));
            realEstate.setArea(Double.parseDouble(request.getArea()));
            realEstate.setRooms(Integer.parseInt(request.getRooms()));
            realEstate.setBathrooms(Integer.parseInt(request.getBathrooms()));
            realEstate.setParking(parseIntOrNull(request.getParking()));
            realEstate.setFloor(parseIntOrNull(request.getFloor()));
            realEstate.setTotalFloors(parseIntOrNull(request.getTotalFloors()));
            realEstate.setBuildYear(parseIntOrNull(request.getYearBuilt()));
            realEstate.setDescription(request.getDescription());
            realEstate.setContactInfo(String.format("이름: %s, 전화: %s, 이메일: %s", 
                request.getContactName(), request.getContactPhone(), request.getContactEmail()));
            realEstate.setIsAvailable(true);
            realEstate.setIsBookmarked(false);
            realEstate.setCreatedAt(LocalDateTime.now());
            realEstate.setUpdatedAt(LocalDateTime.now());

            // 이미지 업로드 처리
            String imageUrl = null;
            String imagesJson = null;
            
            if (request.getImages() != null && request.getImages().length > 0) {
                try {
                    log.info("🖼️ 이미지 업로드 시작: {}개 파일", request.getImages().length);
                    
                    // 이미지 파일들 업로드
                    List<String> uploadedUrls = fileUploadUtil.uploadImages(request.getImages());
                    
                    if (!uploadedUrls.isEmpty()) {
                        // imageUrl: 첫 번째 이미지 URL 저장 (기존 호환성)
                        imageUrl = uploadedUrls.get(0);
                        
                        // images: JSON 배열로 모든 이미지 URL 저장
                        imagesJson = convertUrlsToJson(uploadedUrls);
                        
                        log.info("✅ 이미지 업로드 완료: {}개 파일, 첫 번째 URL: {}", 
                            uploadedUrls.size(), imageUrl);
                    }
                } catch (IOException e) {
                    log.error("❌ 이미지 업로드 실패", e);
                    throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
                }
            } else {
                log.info("📝 이미지 없음");
            }

            // 이미지 정보 설정
            realEstate.setImageUrl(imageUrl);
            realEstate.setImages(imagesJson);

            // 부동산 저장
            RealEstate savedEstate = realEstateRepository.save(realEstate);
            log.info("🎉 부동산 등록 완료 - ID: {}, 제목: {}, 이미지: {}개", 
                savedEstate.getId(), savedEstate.getTitle(), 
                imageUrl != null ? 1 : 0);

            return RealEstateDTO.from(savedEstate);
        } catch (Exception e) {
            log.error("❌ 부동산 등록 실패", e);
            throw new RuntimeException("부동산 등록에 실패했습니다.", e);
        }
    }

    @Override
    @Transactional
    public RealEstateDTO updateRealEstate(String username, Long id, RealEstateDTO.CreateRequest request) {
        log.info("부동산 수정: username={}, id={}", username, id);
        
        User user = getUserByUsername(username);
        RealEstate realEstate = getRealEstateByIdAndUser(id, user);
        
        realEstate.setTitle(request.getTitle());
        realEstate.setPropertyType(RealEstate.PropertyType.valueOf(request.getPropertyType()));
        realEstate.setTransactionType(RealEstate.TransactionType.valueOf(request.getTransactionType()));
        realEstate.setAddress(request.getAddress());
        realEstate.setDetailAddress(request.getDetailAddress());
        realEstate.setLatitude(parseDouble(request.getLatitude()));
        realEstate.setLongitude(parseDouble(request.getLongitude()));
        realEstate.setPrice(parseLong(request.getPrice()));
        realEstate.setMonthlyRent(parseLong(request.getMonthlyRent()));
        realEstate.setDeposit(parseLong(request.getDeposit()));
        realEstate.setArea(parseDouble(request.getArea()));
        realEstate.setRooms(parseInteger(request.getRooms()));
        realEstate.setBathrooms(parseInteger(request.getBathrooms()));
        realEstate.setFloor(parseInteger(request.getFloor()));
        realEstate.setTotalFloors(parseInteger(request.getTotalFloors()));
        realEstate.setBuildYear(parseInteger(request.getYearBuilt()));
        realEstate.setDescription(request.getDescription());
        realEstate.setContactInfo(buildContactInfo(request));
        
        RealEstate updatedRealEstate = realEstateRepository.save(realEstate);
        log.info("부동산 수정 완료: id={}", updatedRealEstate.getId());
        
        return RealEstateDTO.from(updatedRealEstate);
    }

    @Override
    @Transactional
    public void deleteRealEstate(String username, Long id) {
        log.info("부동산 삭제: username={}, id={}", username, id);
        
        User user = getUserByUsername(username);
        RealEstate realEstate = getRealEstateByIdAndUser(id, user);
        
        realEstateRepository.delete(realEstate);
        log.info("부동산 삭제 완료: id={}", id);
    }

    @Override
    @Transactional
    public RealEstateDTO toggleBookmark(String username, Long id) {
        log.info("북마크 토글: username={}, id={}", username, id);
        
        User user = getUserByUsername(username);
        RealEstate realEstate = getRealEstateByIdAndUser(id, user);
        
        boolean currentBookmark = realEstate.getIsBookmarked() != null ? realEstate.getIsBookmarked() : false;
        realEstate.setIsBookmarked(!currentBookmark);
        
        RealEstate savedRealEstate = realEstateRepository.save(realEstate);
        log.info("북마크 토글 완료: id={}, bookmark={}", id, savedRealEstate.getIsBookmarked());
        
        return RealEstateDTO.from(savedRealEstate);
    }

    @Override
    public List<RealEstateDTO> searchRealEstates(String username, RealEstateDTO.SearchRequest request) {
        log.info("부동산 검색: username={}, keyword={}", username, request.getKeyword());
        
        User user = getUserByUsername(username);
        List<RealEstate> realEstates;
        
        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            // 키워드 검색 (제목 또는 주소)
            List<RealEstate> titleResults = realEstateRepository.findByUserAndTitleContaining(user, request.getKeyword());
            List<RealEstate> addressResults = realEstateRepository.findByUserAndAddressContaining(user, request.getKeyword());
            
            // 중복 제거 및 합치기
            realEstates = titleResults.stream()
                    .filter(estate -> !addressResults.contains(estate))
                    .collect(Collectors.toList());
            realEstates.addAll(addressResults);
        } else if (request.getPropertyType() != null) {
            // 매물 타입별 검색
            realEstates = realEstateRepository.findByUserAndPropertyTypeOrderByCreatedAtDesc(user, request.getPropertyType());
        } else if (request.getTransactionType() != null) {
            // 거래 타입별 검색
            realEstates = realEstateRepository.findByUserAndTransactionTypeOrderByCreatedAtDesc(user, request.getTransactionType());
        } else if (request.getIsBookmarked() != null && request.getIsBookmarked()) {
            // 북마크된 매물만 검색
            realEstates = realEstateRepository.findByUserAndIsBookmarkedTrueOrderByCreatedAtDesc(user);
        } else {
            // 전체 조회
            realEstates = realEstateRepository.findByUserOrderByCreatedAtDesc(user);
        }
        
        return realEstates.stream()
                .map(RealEstateDTO::from)
                .collect(Collectors.toList());
    }

    // Private helper methods
    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
    }

    private RealEstate getRealEstateByIdAndUser(Long id, User user) {
        return realEstateRepository.findById(id)
                .filter(estate -> estate.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("부동산 정보를 찾을 수 없습니다: " + id));
    }

    private Double parseDouble(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Double 파싱 실패: {}", value);
            return null;
        }
    }

    private Long parseLong(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Long.parseLong(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Long 파싱 실패: {}", value);
            return null;
        }
    }

    private Integer parseInteger(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Integer 파싱 실패: {}", value);
            return null;
        }
    }

    private String buildContactInfo(RealEstateDTO.CreateRequest request) {
        StringBuilder contactInfo = new StringBuilder();
        if (request.getContactName() != null && !request.getContactName().trim().isEmpty()) {
            contactInfo.append("이름: ").append(request.getContactName().trim());
        }
        if (request.getContactPhone() != null && !request.getContactPhone().trim().isEmpty()) {
            if (contactInfo.length() > 0) contactInfo.append(", ");
            contactInfo.append("전화: ").append(request.getContactPhone().trim());
        }
        if (request.getContactEmail() != null && !request.getContactEmail().trim().isEmpty()) {
            if (contactInfo.length() > 0) contactInfo.append(", ");
            contactInfo.append("이메일: ").append(request.getContactEmail().trim());
        }
        return contactInfo.length() > 0 ? contactInfo.toString() : null;
    }

    private Long parseLongOrNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Long.parseLong(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Long 파싱 실패: {}", value);
            return null;
        }
    }

    private Integer parseIntOrNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            log.warn("Integer 파싱 실패: {}", value);
            return null;
        }
    }

    /**
     * 이미지 URL 리스트를 JSON 형태의 문자열로 변환
     */
    private String convertUrlsToJson(List<String> urls) {
        if (urls == null || urls.isEmpty()) {
            return null;
        }
        return "[" + urls.stream()
            .map(url -> "\"" + url + "\"")
            .collect(Collectors.joining(",")) + "]";
    }
}
