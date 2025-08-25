package com.w.p.service.impl;

import com.w.p.dto.RealEstateDTO;
import com.w.p.entity.RealEstate;
import com.w.p.entity.User;
import com.w.p.exception.RealEstateException;
import com.w.p.repository.RealEstateRepository;
import com.w.p.repository.UserRepository;
import com.w.p.service.BaseService;
import com.w.p.service.RealEstateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 부동산 서비스 구현체
 */
@Service
@Slf4j
@Transactional(readOnly = true)
public class IRealEstateService extends BaseService implements RealEstateService {

    private final RealEstateRepository realEstateRepository;

    public IRealEstateService(UserRepository userRepository, RealEstateRepository realEstateRepository) {
        super(userRepository);
        this.realEstateRepository = realEstateRepository;
    }

    @Override
    public List<RealEstateDTO> getRealEstates(String username) {
        User user = findUserByUsername(username);
        List<RealEstate> estates = realEstateRepository.findByUserOrderByCreatedAtDesc(user);
        return estates.stream()
                .map(RealEstateDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public RealEstateDTO getRealEstate(String username, Long id) {
        User user = findUserByUsername(username);
        RealEstate estate = realEstateRepository.findById(id)
                .orElseThrow(RealEstateException::notFound);
        
        // 사용자 권한 확인
        if (!estate.getUser().getId().equals(user.getId())) {
            throw RealEstateException.accessDenied();
        }
        
        return RealEstateDTO.from(estate);
    }

    @Override
    @Transactional
    public RealEstateDTO createRealEstate(String username, RealEstateDTO.CreateRequest request) {
        User user = findUserByUsername(username);
        RealEstate estate = buildRealEstate(request, user);
        RealEstate savedEstate = realEstateRepository.save(estate);
        log.info("부동산 매물 등록 완료 - ID: {}, 제목: {}", savedEstate.getId(), savedEstate.getTitle());
        return RealEstateDTO.from(savedEstate);
    }

    @Override
    @Transactional
    public RealEstateDTO updateRealEstate(String username, Long id, RealEstateDTO.CreateRequest request) {
        RealEstate estate = findEstateByUserAndId(username, id);
        updateEstateFields(estate, request);
        RealEstate updatedEstate = realEstateRepository.save(estate);
        log.info("부동산 매물 수정 완료 - ID: {}", updatedEstate.getId());
        return RealEstateDTO.from(updatedEstate);
    }

    @Override
    @Transactional
    public void deleteRealEstate(String username, Long id) {
        RealEstate estate = findEstateByUserAndId(username, id);
        realEstateRepository.delete(estate);
        log.info("부동산 매물 삭제 완료 - ID: {}", id);
    }

    @Override
    @Transactional
    public RealEstateDTO toggleBookmark(String username, Long id) {
        RealEstate estate = findEstateByUserAndId(username, id);
        estate.setIsBookmarked(!estate.getIsBookmarked());
        return RealEstateDTO.from(realEstateRepository.save(estate));
    }

    @Override
    public List<RealEstateDTO> searchRealEstates(String username, RealEstateDTO.SearchRequest request) {
        User user = findUserByUsername(username);
        List<RealEstate> estates;
        
        if (request.getIsBookmarked() != null && request.getIsBookmarked()) {
            // 북마크된 매물만 조회
            estates = realEstateRepository.findByUserAndIsBookmarkedTrueOrderByCreatedAtDesc(user);
        } else if (request.getPropertyType() != null) {
            // 매물 타입별 조회
            estates = realEstateRepository.findByUserAndPropertyTypeOrderByCreatedAtDesc(user, request.getPropertyType());
        } else if (request.getTransactionType() != null) {
            // 거래 타입별 조회
            estates = realEstateRepository.findByUserAndTransactionTypeOrderByCreatedAtDesc(user, request.getTransactionType());
        } else if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            // 키워드 검색 (제목 + 주소)
            List<RealEstate> titleResults = realEstateRepository.findByUserAndTitleContaining(user, request.getKeyword());
            List<RealEstate> addressResults = realEstateRepository.findByUserAndAddressContaining(user, request.getKeyword());
            
            estates = titleResults.stream()
                    .distinct()
                    .collect(Collectors.toList());
            estates.addAll(addressResults.stream()
                    .filter(estate -> !estates.contains(estate))
                    .collect(Collectors.toList()));
        } else {
            // 전체 조회
            estates = realEstateRepository.findByUserOrderByCreatedAtDesc(user);
        }
        
        return estates.stream()
                .map(RealEstateDTO::from)
                .collect(Collectors.toList());
    }

    // === 공통 메서드들 ===
    
    private RealEstate findEstateByUserAndId(String username, Long id) {
        User user = findUserByUsername(username);
        RealEstate estate = realEstateRepository.findById(id)
                .orElseThrow(RealEstateException::notFound);
        
        if (!estate.getUser().getId().equals(user.getId())) {
            throw RealEstateException.accessDenied();
        }
        return estate;
    }
    
    private RealEstate buildRealEstate(RealEstateDTO.CreateRequest request, User user) {
        RealEstate estate = new RealEstate();
        updateEstateFields(estate, request);
        estate.setUser(user);
        return estate;
    }
    
    private void updateEstateFields(RealEstate estate, RealEstateDTO.CreateRequest request) {
        estate.setTitle(request.getTitle());
        estate.setPropertyType(RealEstate.PropertyType.valueOf(request.getPropertyType()));
        estate.setTransactionType(RealEstate.TransactionType.valueOf(request.getTransactionType()));
        estate.setAddress(request.getAddress());
        estate.setDetailAddress(request.getDetailAddress());
        
        // 타입 변환
        estate.setLatitude(parseStringToDouble(request.getLatitude()));
        estate.setLongitude(parseStringToDouble(request.getLongitude()));
        estate.setPrice(parseStringToLong(request.getPrice()));
        estate.setMonthlyRent(parseStringToLong(request.getMonthlyRent()));
        estate.setDeposit(parseStringToLong(request.getDeposit()));
        estate.setArea(parseStringToDouble(request.getArea()));
        estate.setRooms(parseStringToInteger(request.getRooms()));
        estate.setBathrooms(parseStringToInteger(request.getBathrooms()));
        estate.setFloor(parseStringToInteger(request.getFloor()));
        estate.setTotalFloors(parseStringToInteger(request.getTotalFloors()));
        estate.setBuildYear(parseStringToInteger(request.getYearBuilt()));
        
        estate.setDescription(request.getDescription());
        estate.setContactInfo(buildContactInfo(request));
    }
    
    private String buildContactInfo(RealEstateDTO.CreateRequest request) {
        return request.getContactName() + " / " + request.getContactPhone() + 
               (request.getContactEmail() != null ? " / " + request.getContactEmail() : "");
    }
}
