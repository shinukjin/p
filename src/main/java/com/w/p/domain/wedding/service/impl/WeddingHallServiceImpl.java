package com.w.p.domain.wedding.service.impl;

import com.w.p.domain.wedding.dto.WeddingHallDTO;
import com.w.p.domain.wedding.service.WeddingHallService;
import com.w.p.domain.wedding.repository.WeddingHallRepository;
import com.w.p.entity.WeddingHall;
import com.w.p.entity.User;
import com.w.p.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 웨딩홀 서비스 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeddingHallServiceImpl implements WeddingHallService {
    
    private final WeddingHallRepository weddingHallRepository;
    private final UserRepository userRepository;
    
    @Override
    public List<WeddingHallDTO.Response> getWeddingHallsByUserId(Long userId) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return weddingHalls.stream()
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public WeddingHallDTO.Response getWeddingHallById(Long userId, Long weddingHallId) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        return WeddingHallDTO.Response.from(weddingHall);
    }
    
    @Override
    @Transactional
    public WeddingHallDTO.Response createWeddingHall(Long userId, WeddingHallDTO.Request request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        WeddingHall weddingHall = WeddingHall.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .website(request.getWebsite())
                .pricePerTable(request.getPrice())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .facilities(request.getFacilities())
                .parkingInfo(request.getParkingInfo())
                .imageUrl(request.getImageUrl())
                .isBookmarked(request.getIsBookmarked() != null ? request.getIsBookmarked() : false)
                .memo(request.getMemo())
                .user(user)
                .build();
        
        WeddingHall savedWeddingHall = weddingHallRepository.save(weddingHall);
        
        log.info("웨딩홀이 생성되었습니다. ID: {}, 사용자: {}", savedWeddingHall.getId(), userId);
        return WeddingHallDTO.Response.from(savedWeddingHall);
    }
    
    @Override
    @Transactional
    public WeddingHallDTO.Response updateWeddingHall(Long userId, Long weddingHallId, WeddingHallDTO.Update updateRequest) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 업데이트 적용
        if (updateRequest.getName() != null) weddingHall.setName(updateRequest.getName());
        if (updateRequest.getAddress() != null) weddingHall.setAddress(updateRequest.getAddress());
        if (updateRequest.getPhone() != null) weddingHall.setPhone(updateRequest.getPhone());
        if (updateRequest.getWebsite() != null) weddingHall.setWebsite(updateRequest.getWebsite());
        if (updateRequest.getPrice() != null) weddingHall.setPricePerTable(updateRequest.getPrice());
        if (updateRequest.getCapacity() != null) weddingHall.setCapacity(updateRequest.getCapacity());
        if (updateRequest.getDescription() != null) weddingHall.setDescription(updateRequest.getDescription());
        if (updateRequest.getFacilities() != null) weddingHall.setFacilities(updateRequest.getFacilities());
        if (updateRequest.getParkingInfo() != null) weddingHall.setParkingInfo(updateRequest.getParkingInfo());
        if (updateRequest.getImageUrl() != null) weddingHall.setImageUrl(updateRequest.getImageUrl());
        if (updateRequest.getIsBookmarked() != null) weddingHall.setIsBookmarked(updateRequest.getIsBookmarked());
        if (updateRequest.getMemo() != null) weddingHall.setMemo(updateRequest.getMemo());
        
        WeddingHall savedWeddingHall = weddingHallRepository.save(weddingHall);
        
        log.info("웨딩홀이 수정되었습니다. ID: {}, 사용자: {}", savedWeddingHall.getId(), userId);
        return WeddingHallDTO.Response.from(savedWeddingHall);
    }
    
    @Override
    @Transactional
    public void deleteWeddingHall(Long userId, Long weddingHallId) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        weddingHallRepository.delete(weddingHall);
        log.info("웨딩홀이 삭제되었습니다. ID: {}, 사용자: {}", weddingHallId, userId);
    }
    
    @Override
    public List<WeddingHallDTO.Response> searchWeddingHalls(Long userId, String keyword) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return weddingHalls.stream()
                .filter(weddingHall -> {
                    if (keyword == null || keyword.isEmpty()) return true;
                    String lowerKeyword = keyword.toLowerCase();
                    return weddingHall.getName().toLowerCase().contains(lowerKeyword) ||
                           (weddingHall.getDescription() != null && weddingHall.getDescription().toLowerCase().contains(lowerKeyword)) ||
                           (weddingHall.getAddress() != null && weddingHall.getAddress().toLowerCase().contains(lowerKeyword));
                })
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<WeddingHallDTO.Response> searchWeddingHalls(Long userId, WeddingHallDTO.SearchRequest searchRequest) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return weddingHalls.stream()
                .filter(weddingHall -> {
                    // 키워드 필터
                    if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().trim().isEmpty()) {
                        String lowerKeyword = searchRequest.getKeyword().toLowerCase();
                        if (!weddingHall.getName().toLowerCase().contains(lowerKeyword) &&
                            (weddingHall.getDescription() == null || !weddingHall.getDescription().toLowerCase().contains(lowerKeyword)) &&
                            (weddingHall.getAddress() == null || !weddingHall.getAddress().toLowerCase().contains(lowerKeyword))) {
                            return false;
                        }
                    }
                    // 가격 범위 필터
                    if (searchRequest.getMinPrice() != null && weddingHall.getPricePerTable().compareTo(searchRequest.getMinPrice()) < 0) {
                        return false;
                    }
                    if (searchRequest.getMaxPrice() != null && weddingHall.getPricePerTable().compareTo(searchRequest.getMaxPrice()) > 0) {
                        return false;
                    }
                    // 수용 인원 필터
                    if (searchRequest.getMinCapacity() != null && weddingHall.getCapacity() < searchRequest.getMinCapacity()) {
                        return false;
                    }
                    if (searchRequest.getMaxCapacity() != null && weddingHall.getCapacity() > searchRequest.getMaxCapacity()) {
                        return false;
                    }
                    // 지역 필터
                    if (searchRequest.getLocation() != null && !searchRequest.getLocation().trim().isEmpty()) {
                        if (weddingHall.getAddress() == null || !weddingHall.getAddress().toLowerCase().contains(searchRequest.getLocation().toLowerCase())) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public WeddingHallDTO.Response toggleBookmark(Long userId, Long weddingHallId) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 북마크 상태 토글
        weddingHall.setIsBookmarked(!weddingHall.getIsBookmarked());
        WeddingHall savedWeddingHall = weddingHallRepository.save(weddingHall);
        
        log.info("웨딩홀 북마크 상태가 변경되었습니다. ID: {}, 북마크: {}, 사용자: {}", 
                savedWeddingHall.getId(), savedWeddingHall.getIsBookmarked(), userId);
        return WeddingHallDTO.Response.from(savedWeddingHall);
    }
    
    @Override
    public List<WeddingHallDTO.Response> getWeddingHallsByPriceRange(Long userId, BigDecimal minPrice, BigDecimal maxPrice) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return weddingHalls.stream()
                .filter(weddingHall -> {
                    if (minPrice != null && weddingHall.getPricePerTable().compareTo(minPrice) < 0) return false;
                    if (maxPrice != null && weddingHall.getPricePerTable().compareTo(maxPrice) > 0) return false;
                    return true;
                })
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<WeddingHallDTO.Response> getWeddingHallsByCapacity(Long userId, Integer minCapacity, Integer maxCapacity) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return weddingHalls.stream()
                .filter(weddingHall -> {
                    if (minCapacity != null && weddingHall.getCapacity() < minCapacity) return false;
                    if (maxCapacity != null && weddingHall.getCapacity() > maxCapacity) return false;
                    return true;
                })
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<WeddingHallDTO.Response> getWeddingHallsByLocation(Long userId, String location) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return weddingHalls.stream()
                .filter(weddingHall -> {
                    if (location == null || location.isEmpty()) return true;
                    return weddingHall.getAddress() != null && 
                           weddingHall.getAddress().toLowerCase().contains(location.toLowerCase());
                })
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<WeddingHallDTO.Response> getBookmarkedWeddingHalls(Long userId) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return weddingHalls.stream()
                .filter(WeddingHall::getIsBookmarked)
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<WeddingHallDTO.Response> compareWeddingHalls(Long userId, List<Long> weddingHallIds) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findAllById(weddingHallIds);
        return weddingHalls.stream()
                .filter(weddingHall -> weddingHall.getUser().getId().equals(userId))
                .map(WeddingHallDTO.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 웨딩홀 통계 정보 조회
     * @param userId 사용자 ID
     * @return 웨딩홀 통계 정보 (총 개수, 북마크 개수, 평균 가격)
     */
    @Override
    public WeddingHallDTO.ListResponse getWeddingHallStatistics(Long userId) {
        List<WeddingHall> weddingHalls = weddingHallRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        int totalCount = weddingHalls.size();
        int bookmarkedCount = (int) weddingHalls.stream()
                .filter(WeddingHall::getIsBookmarked)
                .count();
        
        BigDecimal averagePrice = weddingHalls.stream()
                .map(WeddingHall::getPricePerTable)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(totalCount > 0 ? totalCount : 1), 2, RoundingMode.HALF_UP);
        
        return WeddingHallDTO.ListResponse.builder()
                .weddingHalls(weddingHalls.stream()
                        .map(WeddingHallDTO.Response::from)
                        .collect(Collectors.toList()))
                .totalCount(totalCount)
                .bookmarkedCount(bookmarkedCount)
                .averagePrice(averagePrice)
                .build();
    }
    
    @Override
    public WeddingHallDTO.Response setWeddingHallAlert(Long userId, Long weddingHallId, BigDecimal priceThreshold) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 알림 임계값 설정 로직 (실제 구현에서는 별도 테이블이나 필드에 저장)
        log.info("웨딩홀 알림 설정: ID: {}, 임계값: {}", weddingHallId, priceThreshold);
        
        return WeddingHallDTO.Response.from(weddingHall);
    }
    
    @Override
    public WeddingHallDTO.Response shareWeddingHall(Long userId, Long weddingHallId, String shareWithUsername) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 웨딩홀 공유 로직 (실제 구현에서는 별도 테이블에 저장)
        log.info("웨딩홀 공유: ID: {}, 공유 대상: {}", weddingHallId, shareWithUsername);
        
        return WeddingHallDTO.Response.from(weddingHall);
    }
    
    @Override
    public List<WeddingHallDTO.Response> applyWeddingHallTemplate(Long userId, String templateName) {
        // 템플릿 적용 로직 (실제 구현에서는 템플릿 데이터베이스에서 조회)
        log.info("웨딩홀 템플릿 적용: 사용자: {}, 템플릿: {}", userId, templateName);
        
        // 빈 리스트 반환 (실제 구현에서는 템플릿 기반 웨딩홀 생성)
        return List.of();
    }
    
    @Override
    public String exportWeddingHallToExcel(Long userId, Long weddingHallId, String format) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // Excel 내보내기 로직 (실제 구현에서는 Apache POI 등을 사용)
        log.info("웨딩홀 Excel 내보내기: ID: {}, 형식: {}", weddingHallId, format);
        
        return "웨딩홀이 " + format + " 형식으로 내보내졌습니다.";
    }
    
    @Override
    public List<WeddingHallDTO.Response> importWeddingHallFromExcel(Long userId, String excelData, String format) {
        // Excel 가져오기 로직 (실제 구현에서는 Excel 파일을 파싱하여 웨딩홀 생성)
        log.info("웨딩홀 Excel 가져오기: 사용자: {}, 형식: {}", userId, format);
        
        // 빈 리스트 반환 (실제 구현에서는 파싱된 웨딩홀 데이터 반환)
        return List.of();
    }
    
    @Override
    public WeddingHallDTO.Response checkWeddingHallAvailability(Long userId, Long weddingHallId, String date) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 예약 상태 확인 로직 (실제 구현에서는 예약 테이블에서 조회)
        log.info("웨딩홀 예약 상태 확인: ID: {}, 날짜: {}", weddingHallId, date);
        
        return WeddingHallDTO.Response.from(weddingHall);
    }
    
    @Override
    public WeddingHallDTO.Response requestWeddingHallQuote(Long userId, Long weddingHallId, WeddingHallDTO.QuoteRequest quoteRequest) {
        WeddingHall weddingHall = weddingHallRepository.findById(weddingHallId)
                .orElseThrow(() -> new RuntimeException("웨딩홀을 찾을 수 없습니다."));
        
        if (!weddingHall.getUser().getId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // 견적 요청 로직 (실제 구현에서는 견적 테이블에 저장)
        log.info("웨딩홀 견적 요청: ID: {}, 요청 내용: {}", weddingHallId, quoteRequest);
        
        return WeddingHallDTO.Response.from(weddingHall);
    }
}
