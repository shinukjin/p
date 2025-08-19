package com.w.p.service.admin;

import com.w.p.dto.admin.WeddingHallDTO;
import com.w.p.entity.WeddingHall;
import com.w.p.entity.User;
import com.w.p.repository.WeddingHallRepository;
import com.w.p.repository.UserRepository;
import com.w.p.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 관리자용 결혼식장 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminWeddingHallService {

    private final WeddingHallRepository weddingHallRepository;
    private final UserRepository userRepository;

    /**
     * 결혼식장 목록 조회
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<WeddingHallDTO>> getWeddingHalls() {
        try {
            List<WeddingHall> weddingHalls = weddingHallRepository.findAll();
            List<WeddingHallDTO> dtos = weddingHalls.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success(dtos, "결혼식장 목록을 성공적으로 조회했습니다.");
        } catch (Exception e) {
            log.error("결혼식장 목록 조회 중 오류 발생", e);
            return ApiResponse.error("결혼식장 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 결혼식장 상세 조회
     */
    @Transactional(readOnly = true)
    public ApiResponse<WeddingHallDTO> getWeddingHall(Long id) {
        try {
            WeddingHall weddingHall = weddingHallRepository.findById(id)
                    .orElse(null);

            if (weddingHall == null) {
                return ApiResponse.error("해당 결혼식장을 찾을 수 없습니다.");
            }

            WeddingHallDTO dto = convertToDTO(weddingHall);
            return ApiResponse.success(dto, "결혼식장 정보를 성공적으로 조회했습니다.");
        } catch (Exception e) {
            log.error("결혼식장 상세 조회 중 오류 발생", e);
            return ApiResponse.error("결혼식장 상세 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 결혼식장 생성
     */
    public ApiResponse<WeddingHallDTO> createWeddingHall(WeddingHallDTO dto) {
        try {
            // 사용자 확인
            User user = null;
            if (dto.getUserId() != null) {
                user = userRepository.findById(dto.getUserId()).orElse(null);
            }

            WeddingHall weddingHall = WeddingHall.builder()
                    .name(dto.getName())
                    .address(dto.getAddress())
                    .phone(dto.getPhone())
                    .website(dto.getWebsite())
                    .pricePerTable(dto.getPrice())
                    .capacity(dto.getCapacity())
                    .hallType(dto.getHallType())
                    .description(dto.getDescription())
                    .imageUrl(dto.getImageUrl())
                    .rating(dto.getRating())
                    .parkingInfo(dto.getParkingInfo())
                    .facilities(dto.getFacilities())
                    .memo(dto.getMemo())
                    .user(user)
                    .build();

            WeddingHall savedWeddingHall = weddingHallRepository.save(weddingHall);
            WeddingHallDTO savedDto = convertToDTO(savedWeddingHall);

            return ApiResponse.success(savedDto, "결혼식장이 성공적으로 생성되었습니다.");
        } catch (Exception e) {
            log.error("결혼식장 생성 중 오류 발생", e);
            return ApiResponse.error("결혼식장 생성 중 오류가 발생했습니다.");
        }
    }

    /**
     * 결혼식장 수정
     */
    public ApiResponse<WeddingHallDTO> updateWeddingHall(Long id, WeddingHallDTO dto) {
        try {
            WeddingHall weddingHall = weddingHallRepository.findById(id)
                    .orElse(null);

            if (weddingHall == null) {
                return ApiResponse.error("해당 결혼식장을 찾을 수 없습니다.");
            }

            // 사용자 확인
            User user = null;
            if (dto.getUserId() != null) {
                user = userRepository.findById(dto.getUserId()).orElse(null);
            }

            // 데이터 업데이트
            weddingHall.setName(dto.getName());
            weddingHall.setAddress(dto.getAddress());
            weddingHall.setPhone(dto.getPhone());
            weddingHall.setWebsite(dto.getWebsite());
            weddingHall.setPricePerTable(dto.getPrice());
            weddingHall.setCapacity(dto.getCapacity());
            weddingHall.setHallType(dto.getHallType());
            weddingHall.setDescription(dto.getDescription());
            weddingHall.setImageUrl(dto.getImageUrl());
            weddingHall.setRating(dto.getRating());
            weddingHall.setParkingInfo(dto.getParkingInfo());
            weddingHall.setFacilities(dto.getFacilities());
            weddingHall.setMemo(dto.getMemo());
            weddingHall.setUser(user);

            WeddingHall updatedWeddingHall = weddingHallRepository.save(weddingHall);
            WeddingHallDTO updatedDto = convertToDTO(updatedWeddingHall);

            return ApiResponse.success(updatedDto, "결혼식장이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            log.error("결혼식장 수정 중 오류 발생", e);
            return ApiResponse.error("결혼식장 수정 중 오류가 발생했습니다.");
        }
    }

    /**
     * 결혼식장 삭제
     */
    public ApiResponse<Void> deleteWeddingHall(Long id) {
        try {
            WeddingHall weddingHall = weddingHallRepository.findById(id)
                    .orElse(null);

            if (weddingHall == null) {
                return ApiResponse.error("해당 결혼식장을 찾을 수 없습니다.");
            }

            weddingHallRepository.delete(weddingHall);
            return ApiResponse.success(null, "결혼식장이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            log.error("결혼식장 삭제 중 오류 발생", e);
            return ApiResponse.error("결혼식장 삭제 중 오류가 발생했습니다.");
        }
    }

    /**
     * 엔티티를 DTO로 변환
     */
    private WeddingHallDTO convertToDTO(WeddingHall weddingHall) {
        return WeddingHallDTO.builder()
                .id(weddingHall.getId())
                .name(weddingHall.getName())
                .address(weddingHall.getAddress())
                .phone(weddingHall.getPhone())
                .website(weddingHall.getWebsite())
                .price(weddingHall.getPricePerTable())
                .capacity(weddingHall.getCapacity())
                .hallType(weddingHall.getHallType())
                .description(weddingHall.getDescription())
                .imageUrl(weddingHall.getImageUrl())
                .rating(weddingHall.getRating())
                .parkingInfo(weddingHall.getParkingInfo())
                .facilities(weddingHall.getFacilities())
                .memo(weddingHall.getMemo())
                .status("active") // 기본값
                .createdAt(weddingHall.getCreatedAt())
                .updatedAt(weddingHall.getUpdatedAt())
                .userId(weddingHall.getUser() != null ? weddingHall.getUser().getId() : null)
                .userName(weddingHall.getUser() != null ? weddingHall.getUser().getName() : null)
                .build();
    }
}
