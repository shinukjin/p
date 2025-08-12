package com.w.p.controller.api.v1.test;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.w.p.common.ApiResponse;

/**
 * 로깅 및 응답 형식 테스트용 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }

    @GetMapping("/data")
    public Map<String, Object> getData() {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "테스트 데이터입니다.");
        data.put("timestamp", System.currentTimeMillis());
        data.put("status", "success");
        return data;
    }

    @PostMapping("/echo")
    public ApiResponse<Map<String, Object>> echo(@RequestBody Map<String, Object> request) {
        return ApiResponse.success(request, "에코 응답입니다.");
    }
}
