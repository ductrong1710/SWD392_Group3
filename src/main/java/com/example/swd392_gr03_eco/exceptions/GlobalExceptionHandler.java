package com.example.swd392_gr03_eco.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Lắng nghe lỗi từ tất cả Controller
public class GlobalExceptionHandler {

    // Bắt lỗi RuntimeException (Ví dụ: Không tìm thấy ID, Hết hàng...)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", "ERROR");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // Bạn có thể bắt thêm các lỗi khác ở đây (VD: Lỗi validate input)
}