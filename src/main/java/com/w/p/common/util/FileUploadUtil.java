package com.w.p.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 파일 업로드 유틸리티 클래스
 */
@Slf4j
@Component
public class FileUploadUtil {

    @Value("${file.upload.path:/uploads}")
    private String uploadPath;

    @Value("${file.upload.max-size:10485760}") // 10MB
    private long maxFileSize;

    @Value("${file.upload.allowed-types:image/jpeg,image/png,image/gif,image/webp}")
    private String allowedTypes;

    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};

    /**
     * 이미지 파일 업로드
     * @param files 업로드할 이미지 파일들
     * @return 업로드된 이미지 URL 리스트
     */
    public List<String> uploadImages(MultipartFile[] files) throws IOException {
        List<String> uploadedUrls = new ArrayList<>();
        
        if (files == null || files.length == 0) {
            return uploadedUrls;
        }

        // 업로드 디렉토리 생성
        createUploadDirectory();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            // 파일 검증
            validateFile(file);

            // 파일명 생성 (중복 방지)
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = generateUniqueFilename(fileExtension);

            // 파일 저장
            Path filePath = Paths.get(uploadPath, uniqueFilename);
            Files.copy(file.getInputStream(), filePath);

            // URL 생성
            String fileUrl = "/uploads/" + uniqueFilename;
            uploadedUrls.add(fileUrl);

            log.info("이미지 업로드 완료: {} -> {}", originalFilename, fileUrl);
        }

        return uploadedUrls;
    }

    /**
     * 단일 이미지 파일 업로드
     * @param file 업로드할 이미지 파일
     * @return 업로드된 이미지 URL
     */
    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 파일 검증
        validateFile(file);

        // 업로드 디렉토리 생성
        createUploadDirectory();

        // 파일명 생성
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = generateUniqueFilename(fileExtension);

        // 파일 저장
        Path filePath = Paths.get(uploadPath, uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        // URL 생성
        String fileUrl = "/uploads/" + uniqueFilename;

        log.info("이미지 업로드 완료: {} -> {}", originalFilename, fileUrl);
        return fileUrl;
    }

    /**
     * 파일 검증
     * @param file 검증할 파일
     */
    private void validateFile(MultipartFile file) {
        // 파일 크기 검증
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                String.format("파일 크기가 너무 큽니다. 최대 크기: %d bytes, 현재 크기: %d bytes", 
                    maxFileSize, file.getSize())
            );
        }

        // 파일 타입 검증 (더 유연하게)
        String contentType = file.getContentType();
        log.info("파일 검증 - 원본명: {}, Content-Type: {}, 크기: {}", 
            file.getOriginalFilename(), contentType, file.getSize());
        
        if (contentType == null) {
            // Content-Type이 null인 경우 확장자로만 검증
            log.warn("Content-Type이 null입니다. 확장자로만 검증합니다.");
        } else if (!isAllowedImageType(contentType)) {
            // application/octet-stream도 허용 (일부 브라우저에서 발생)
            if ("application/octet-stream".equals(contentType)) {
                log.info("application/octet-stream 타입 허용 - 확장자로 검증");
            } else {
                throw new IllegalArgumentException(
                    String.format("지원하지 않는 파일 타입입니다: %s", contentType)
                );
            }
        }

        // 파일 확장자 검증
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isAllowedExtension(originalFilename)) {
            throw new IllegalArgumentException(
                String.format("지원하지 않는 파일 확장자입니다: %s", originalFilename)
            );
        }
    }

    /**
     * 허용된 이미지 타입인지 확인
     * @param contentType 파일 타입
     * @return 허용 여부
     */
    private boolean isAllowedImageType(String contentType) {
        String[] allowedTypeArray = allowedTypes.split(",");
        for (String allowedType : allowedTypeArray) {
            if (contentType.startsWith(allowedType.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 허용된 확장자인지 확인
     * @param filename 파일명
     * @return 허용 여부
     */
    private boolean isAllowedExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (allowedExt.equals(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 파일 확장자 추출
     * @param filename 파일명
     * @return 확장자
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    /**
     * 고유한 파일명 생성
     * @param extension 파일 확장자
     * @return 고유한 파일명
     */
    private String generateUniqueFilename(String extension) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("img_%s_%s%s", timestamp, uuid, extension);
    }

    /**
     * 업로드 디렉토리 생성
     */
    private void createUploadDirectory() throws IOException {
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            log.info("업로드 디렉토리 생성: {}", uploadPath);
        }
    }

    /**
     * 파일 삭제
     * @param fileUrl 삭제할 파일 URL
     * @return 삭제 성공 여부
     */
    public boolean deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return false;
        }

        try {
            String filename = fileUrl.substring("/uploads/".length());
            Path filePath = Paths.get(uploadPath, filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("파일 삭제 완료: {}", fileUrl);
                return true;
            }
        } catch (IOException e) {
            log.error("파일 삭제 실패: {}", fileUrl, e);
        }
        
        return false;
    }
}
